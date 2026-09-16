// ─── Web Worker Message Protocol Types ────────────────────────────────────────

// ─── Bitmask Engine Messages ──────────────────────────────────────────────────

export interface EncodedProduct {
  id: number;
  fields: [number, number];   // [field0, field1] — two 32-bit bitmask fields
  price: number;
  salePrice: number;
  rating: number;
  createdAt: number;
}

export interface FacetQueryMask {
  facetId: string;
  fieldIndex: 0 | 1;
  mask: number;
}

export type BitmaskWorkerRequest =
  | {
      type: 'INIT';
      products: EncodedProduct[];
    }
  | {
      type: 'FILTER';
      facetMasks: FacetQueryMask[];
      sortBy: string;
      searchQuery: string;
      productNames: Record<number, string>;
    };

export interface BitmaskWorkerResponse {
  type: 'FILTER_RESULT';
  matchedIds: number[];
  facetCounts: Record<string, Record<string, number>>;
  totalMatches: number;
  computeTimeMs: number;
}

// ─── Recommendation Engine Messages ───────────────────────────────────────────

export interface ProductVector {
  productId: number;
  embedding: number[];   // 32-dimensional tag vector
}

export type RecommendationWorkerRequest =
  | {
      type: 'INIT';
      vectors: ProductVector[];
    }
  | {
      type: 'GET_SIMILAR';
      productId: number;
      topK: number;
      excludeIds?: number[];
    }
  | {
      type: 'GET_PAIRINGS';
      productId: number;
      productType: string;
      topK: number;
    };

export interface RecommendationWorkerResponse {
  type: 'SIMILAR_RESULT' | 'PAIRING_RESULT';
  productId: number;
  results: Array<{ id: number; score: number }>;
}
