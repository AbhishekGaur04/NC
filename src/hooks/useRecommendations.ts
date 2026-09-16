// ─── React Hook for Recommendations & Pairings ─────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import type { Product } from '../types/product';
import type { RecommendationWorkerResponse } from '../types/engine';
import { products } from '../data/products';
import { generateCatalogVectors } from '../engine/recommendation/embeddings';

// Pre-generate vectors once
const catalogVectors = generateCatalogVectors(products);

export function useRecommendations(productId: number, productType: string, topK: number = 4) {
  const [similar, setSimilar] = useState<Product[]>([]);
  const [pairings, setPairings] = useState<Product[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/recommendation.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<RecommendationWorkerResponse>) => {
      const data = e.data;

      if (data.type === 'SIMILAR_RESULT' && data.productId === productId) {
        const matched = data.results.map((res) => {
          const item = products.find((p) => p.id === res.id);
          return item;
        }).filter(Boolean) as Product[];
        setSimilar(matched);
      }

      if (data.type === 'PAIRING_RESULT' && data.productId === productId) {
        const matched = data.results.map((res) => {
          const item = products.find((p) => p.id === res.id);
          return item;
        }).filter(Boolean) as Product[];
        setPairings(matched);
      }
    };

    // Initialize recommendations worker with catalog embeddings
    worker.postMessage({
      type: 'INIT',
      vectors: catalogVectors,
    });

    // Request initial suggestions
    worker.postMessage({
      type: 'GET_SIMILAR',
      productId,
      topK,
    });

    worker.postMessage({
      type: 'GET_PAIRINGS',
      productId,
      productType,
      topK,
    });

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, [productId, productType, topK]);

  return { similar, pairings };
}
export default useRecommendations;
