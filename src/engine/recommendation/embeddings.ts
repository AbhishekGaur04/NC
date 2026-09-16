// ─── Product Tag Vector Embeddings ────────────────────────────────────────────
//
// Generates 32-dimensional feature vectors for each product based on
// normalized attribute encoding. Used by the recommendation worker
// for cosine similarity matching.
//
// Dimensions [0-31]:
//   [0-5]   Product Type (one-hot)
//   [6-13]  Fabric (one-hot)
//   [14-23] Work types (multi-hot, normalized)
//   [24-26] Price bucket (ordinal)
//   [27-29] Occasion profile (compressed PCA-like)
//   [30]    Formality score (0=casual → 1=formal)
//   [31]    Embellishment density (0=plain → 1=heavy)
//
// ──────────────────────────────────────────────────────────────────────────────

import type { Product } from '../../types/product';
import type { ProductVector } from '../../types/engine';

const TYPE_INDEX: Record<string, number> = {
  kurta: 0, gown: 1, saree: 2, lehenga: 3, dupatta: 4, blouse: 5,
};

const FABRIC_INDEX: Record<string, number> = {
  silk: 0, cotton: 1, georgette: 2, chiffon: 3,
  velvet: 4, net: 5, organza: 6, crepe: 7,
};

const WORK_INDEX: Record<string, number> = {
  zari: 0, thread: 1, mirror: 2, sequin: 3, stone: 4,
  resham: 5, gota: 6, printed: 7, plain: 8, handpainted: 9,
};

const OCCASION_FORMALITY: Record<string, number> = {
  wedding: 1.0, reception: 0.9, party: 0.7, festive: 0.6,
  mehendi: 0.5, office: 0.4, casual: 0.1,
};

const WORK_DENSITY: Record<string, number> = {
  zari: 0.95, resham: 0.85, gota: 0.80, stone: 0.75,
  mirror: 0.70, sequin: 0.65, thread: 0.50, handpainted: 0.60,
  printed: 0.30, plain: 0.05,
};

const PRICE_BUCKETS = [2000, 5000, 10000, 25000, 50000];

export function generateEmbedding(product: Product): number[] {
  const vec = new Array(32).fill(0);

  // [0-5] Product Type — one-hot
  const typeIdx = TYPE_INDEX[product.type];
  if (typeIdx !== undefined) vec[typeIdx] = 1.0;

  // [6-13] Fabric — one-hot
  const fabricIdx = FABRIC_INDEX[product.fabric];
  if (fabricIdx !== undefined) vec[6 + fabricIdx] = 1.0;

  // [14-23] Work — multi-hot normalized
  const workCount = product.work.length || 1;
  for (const w of product.work) {
    const wIdx = WORK_INDEX[w];
    if (wIdx !== undefined) vec[14 + wIdx] = 1.0 / workCount;
  }

  // [24-26] Price bucket — ordinal encoding
  const price = product.salePrice;
  let priceBucket = 0;
  for (let i = 0; i < PRICE_BUCKETS.length; i++) {
    if (price > PRICE_BUCKETS[i]) priceBucket = i + 1;
  }
  vec[24] = priceBucket / 5;
  vec[25] = price > 10000 ? 1 : 0;   // premium flag
  vec[26] = price > 25000 ? 1 : 0;   // luxury flag

  // [27-29] Occasion profile — compressed
  let formalitySum = 0;
  let occasionCount = 0;
  for (const o of product.occasion) {
    const f = OCCASION_FORMALITY[o];
    if (f !== undefined) {
      formalitySum += f;
      occasionCount++;
    }
  }
  vec[27] = occasionCount > 0 ? formalitySum / occasionCount : 0.5;
  vec[28] = product.occasion.includes('wedding') ? 1 : 0;
  vec[29] = product.occasion.includes('casual') ? 1 : 0;

  // [30] Formality score
  vec[30] = vec[27]; // Same as occasion formality average

  // [31] Embellishment density
  let densitySum = 0;
  let densityCount = 0;
  for (const w of product.work) {
    const d = WORK_DENSITY[w];
    if (d !== undefined) {
      densitySum += d;
      densityCount++;
    }
  }
  vec[31] = densityCount > 0 ? densitySum / densityCount : 0;

  return vec;
}

export function generateCatalogVectors(products: Product[]): ProductVector[] {
  return products.map(p => ({
    productId: p.id,
    embedding: generateEmbedding(p),
  }));
}
