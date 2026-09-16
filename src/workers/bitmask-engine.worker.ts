// ─── Bitmask Faceted Search Engine — Web Worker ───────────────────────────────
//
// Off-main-thread filtering engine using bitwise masking for O(n) product
// filtering with sub-millisecond performance on catalogs up to 10K items.
//
// Protocol:
//   Main → Worker: INIT (encoded products), FILTER (facet masks + sort)
//   Worker → Main: FILTER_RESULT (matched IDs + facet counts)
//
// ──────────────────────────────────────────────────────────────────────────────

import type {
  EncodedProduct,
  FacetQueryMask,
  BitmaskWorkerRequest,
  BitmaskWorkerResponse,
} from '../types/engine';

// ─── State ────────────────────────────────────────────────────────────────────
let encodedProducts: EncodedProduct[] = [];

// ─── Facet bit ranges for count computation ───────────────────────────────────
// Each entry: [facetId, fieldIndex, [bit positions...]]
const FACET_BITS: Array<[string, 0 | 1, Array<[string, number]>]> = [
  ['productType', 0, [
    ['kurta', 1 << 0], ['gown', 1 << 1], ['saree', 1 << 2],
    ['lehenga', 1 << 3], ['hoop-art', 1 << 4], ['blouse', 1 << 5],
  ]],
  ['fabric', 0, [
    ['silk', 1 << 6], ['cotton', 1 << 7], ['georgette', 1 << 8],
    ['chiffon', 1 << 9], ['velvet', 1 << 10], ['net', 1 << 11],
    ['organza', 1 << 12], ['crepe', 1 << 13],
  ]],
  ['work', 0, [
    ['zari', 1 << 14], ['thread', 1 << 15], ['mirror', 1 << 16],
    ['sequin', 1 << 17], ['stone', 1 << 18], ['resham', 1 << 19],
    ['gota', 1 << 20], ['printed', 1 << 21], ['plain', 1 << 22],
    ['handpainted', 1 << 23],
  ]],
  ['occasion', 0, [
    ['wedding', 1 << 24], ['festive', 1 << 25], ['party', 1 << 26],
    ['casual', 1 << 27], ['office', 1 << 28], ['mehendi', 1 << 29],
    ['reception', 1 << 30],
  ]],
  ['color', 1, [
    ['red', 1 << 0], ['maroon', 1 << 1], ['pink', 1 << 2],
    ['peach', 1 << 3], ['gold', 1 << 4], ['yellow', 1 << 5],
    ['green', 1 << 6], ['teal', 1 << 7], ['blue', 1 << 8],
    ['navy', 1 << 9], ['purple', 1 << 10], ['black', 1 << 11],
    ['white', 1 << 12], ['ivory', 1 << 13], ['beige', 1 << 14],
    ['multi', 1 << 15],
  ]],
  ['priceRange', 1, [
    ['under2k', 1 << 16], ['2k-5k', 1 << 17], ['5k-10k', 1 << 18],
    ['10k-25k', 1 << 19], ['25k-50k', 1 << 20], ['above50k', 1 << 21],
  ]],
  ['discountRange', 1, [
    ['none', 1 << 22], ['10plus', 1 << 23], ['20plus', 1 << 24],
    ['30plus', 1 << 25], ['50plus', 1 << 26],
  ]],
];

// ─── Core Filter Algorithm ────────────────────────────────────────────────────

function matchesAllFacets(
  product: EncodedProduct,
  facetMasks: FacetQueryMask[],
  excludeFacetId?: string
): boolean {
  for (let i = 0; i < facetMasks.length; i++) {
    const facet = facetMasks[i];
    if (facet.facetId === excludeFacetId) continue;
    // OR within facet (any selected value matches), AND across facets
    if ((product.fields[facet.fieldIndex] & facet.mask) === 0) {
      return false;
    }
  }
  return true;
}

function matchesSearch(
  productId: number,
  searchQuery: string,
  productNames: Record<number, string>
): boolean {
  if (!searchQuery) return true;
  const searchableText = productNames[productId];
  if (!searchableText) return false;
  return searchableText.toLowerCase().includes(searchQuery.toLowerCase());
}

function searchRank(productId: number, searchQuery: string, productNames: Record<number, string>): number {
  if (!searchQuery) return 0;
  const query = searchQuery.trim().toLowerCase();
  const searchableText = productNames[productId]?.toLowerCase() || '';
  const [name, type, ...attributes] = searchableText.split(' | ');

  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (type === query || type.startsWith(query)) return 2;
  if (name.includes(query)) return 3;
  if (attributes.some((attribute) => attribute === query || attribute.startsWith(query))) return 4;
  return 5;
}

function filterProducts(
  facetMasks: FacetQueryMask[],
  sortBy: string,
  searchQuery: string,
  productNames: Record<number, string>
): BitmaskWorkerResponse {
  const t0 = performance.now();

  // ── Pass 1: Find all matching products ──────────────────────
  const matched: EncodedProduct[] = [];

  for (let i = 0; i < encodedProducts.length; i++) {
    const product = encodedProducts[i];
    if (!matchesAllFacets(product, facetMasks)) continue;
    if (!matchesSearch(product.id, searchQuery, productNames)) continue;
    matched.push(product);
  }

  // ── Pass 2: Compute facet counts ────────────────────────────
  // For each facet, count how many products match ALL OTHER facets
  // (excluding the current facet). This prevents dead-end zero-count filters.
  const facetCounts: Record<string, Record<string, number>> = {};

  for (const [facetId, fieldIndex, bits] of FACET_BITS) {
    const counts: Record<string, number> = {};
    for (const [value, bitMask] of bits) {
      let count = 0;
      for (let i = 0; i < encodedProducts.length; i++) {
        const product = encodedProducts[i];
        // Check if product has this specific attribute value
        if ((product.fields[fieldIndex] & bitMask) === 0) continue;
        // Check if product matches all OTHER facets (exclude current facet)
        if (!matchesAllFacets(product, facetMasks, facetId)) continue;
        if (!matchesSearch(product.id, searchQuery, productNames)) continue;
        count++;
      }
      counts[value] = count;
    }
    facetCounts[facetId] = counts;
  }

  // ── Pass 3: Sort ────────────────────────────────────────────
  switch (sortBy) {
    case 'price-low':
      matched.sort((a, b) => a.salePrice - b.salePrice);
      break;
    case 'price-high':
      matched.sort((a, b) => b.salePrice - a.salePrice);
      break;
    case 'newest':
      matched.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'rating':
      matched.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      matched.sort((a, b) => {
        const dA = a.price > 0 ? (a.price - a.salePrice) / a.price : 0;
        const dB = b.price > 0 ? (b.price - b.salePrice) / b.price : 0;
        return dB - dA;
      });
      break;
    default:
      // 'relevance' — exact/name/type matches first, then broader attributes
      if (searchQuery.trim()) {
        matched.sort((a, b) => {
          const rankDifference = searchRank(a.id, searchQuery, productNames) - searchRank(b.id, searchQuery, productNames);
          return rankDifference || b.rating - a.rating;
        });
      }
      break;
  }

  const t1 = performance.now();

  return {
    type: 'FILTER_RESULT',
    matchedIds: matched.map(p => p.id),
    facetCounts,
    totalMatches: matched.length,
    computeTimeMs: Math.round((t1 - t0) * 100) / 100,
  };
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.onmessage = function (e: MessageEvent<BitmaskWorkerRequest>) {
  const msg = e.data;

  switch (msg.type) {
    case 'INIT':
      encodedProducts = msg.products;
      // Send initial unfiltered result
      const initResult = filterProducts([], 'relevance', '', {});
      self.postMessage(initResult);
      break;

    case 'FILTER':
      const result = filterProducts(
        msg.facetMasks,
        msg.sortBy,
        msg.searchQuery,
        msg.productNames
      );
      self.postMessage(result);
      break;
  }
};
