// ─── Style Recommendation Engine — Web Worker ─────────────────────────────────
//
// In-browser cosine similarity model using pre-computed 32-dimensional
// product tag vector embeddings. Supports:
//   - Similar product recommendations
//   - Fashion pairing suggestions (complementary items)
//
// ──────────────────────────────────────────────────────────────────────────────

import type {
  ProductVector,
  RecommendationWorkerRequest,
  RecommendationWorkerResponse,
} from '../types/engine';

// ─── State ────────────────────────────────────────────────────────────────────
let productVectors: ProductVector[] = [];
let vectorMap: Map<number, number[]> = new Map();

// ─── Cosine Similarity ───────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  const len = a.length;

  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ─── Pairing Rules (Domain Knowledge) ─────────────────────────────────────────
// Fashion pairings: boost similarity for complementary product types

const PAIRING_BOOST: Record<string, string[]> = {
  saree:   ['blouse', 'dupatta'],
  kurta:   ['dupatta', 'lehenga'],
  gown:    ['dupatta'],
  lehenga: ['blouse', 'dupatta'],
  blouse:  ['saree', 'lehenga'],
  dupatta: ['saree', 'kurta', 'lehenga', 'gown'],
};

function getPairingBoost(sourceType: string, targetType: string): number {
  const pairTypes = PAIRING_BOOST[sourceType];
  if (pairTypes && pairTypes.includes(targetType)) return 0.3;
  return 0;
}

// ─── Find Similar Products ────────────────────────────────────────────────────

function findSimilar(
  productId: number,
  topK: number,
  excludeIds: number[] = []
): Array<{ id: number; score: number }> {
  const sourceVec = vectorMap.get(productId);
  if (!sourceVec) return [];

  const excludeSet = new Set(excludeIds);
  excludeSet.add(productId);

  const scores: Array<{ id: number; score: number }> = [];

  for (const pv of productVectors) {
    if (excludeSet.has(pv.productId)) continue;
    const score = cosineSimilarity(sourceVec, pv.embedding);
    scores.push({ id: pv.productId, score });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK);
}

// ─── Find Fashion Pairings ────────────────────────────────────────────────────

function findPairings(
  productId: number,
  productType: string,
  topK: number
): Array<{ id: number; score: number }> {
  const sourceVec = vectorMap.get(productId);
  if (!sourceVec) return [];

  const scores: Array<{ id: number; score: number }> = [];

  for (const pv of productVectors) {
    if (pv.productId === productId) continue;

    const baseSimilarity = cosineSimilarity(sourceVec, pv.embedding);

    // We infer the product type from the embedding's first 6 dimensions
    // (which correspond to product type encoding)
    const targetTypeIndex = pv.embedding.slice(0, 6).indexOf(
      Math.max(...pv.embedding.slice(0, 6))
    );
    const targetTypes = ['kurta', 'gown', 'saree', 'lehenga', 'dupatta', 'blouse'];
    const targetType = targetTypes[targetTypeIndex] || '';

    const boost = getPairingBoost(productType, targetType);
    const finalScore = Math.min(1, baseSimilarity + boost);

    if (boost > 0 || baseSimilarity > 0.5) {
      scores.push({ id: pv.productId, score: finalScore });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, topK);
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.onmessage = function (e: MessageEvent<RecommendationWorkerRequest>) {
  const msg = e.data;

  switch (msg.type) {
    case 'INIT':
      productVectors = msg.vectors;
      vectorMap = new Map(msg.vectors.map(v => [v.productId, v.embedding]));
      break;

    case 'GET_SIMILAR': {
      const results = findSimilar(msg.productId, msg.topK, msg.excludeIds);
      const response: RecommendationWorkerResponse = {
        type: 'SIMILAR_RESULT',
        productId: msg.productId,
        results,
      };
      self.postMessage(response);
      break;
    }

    case 'GET_PAIRINGS': {
      const results = findPairings(msg.productId, msg.productType, msg.topK);
      const response: RecommendationWorkerResponse = {
        type: 'PAIRING_RESULT',
        productId: msg.productId,
        results,
      };
      self.postMessage(response);
      break;
    }
  }
};
