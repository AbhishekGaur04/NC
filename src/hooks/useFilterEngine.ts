// ─── React Filter Engine Hook (Worker Bridge) ─────────────────────────────────
import { useEffect, useRef, useState, useTransition } from 'react';
import type { FilterState, FilterResult } from '../types/filter';
import type { FacetQueryMask, BitmaskWorkerResponse } from '../types/engine';
import { products } from '../data/products';
import { encodeCatalog } from '../engine/bitmask/encoder';
import { BITMASK_SCHEMA, FACET_FIELD_INDEX, type FacetId } from '../engine/bitmask/schema';

// Encode product catalog once at module load
const encodedCatalog = encodeCatalog(products);

// Map of product ID to searchable catalogue text for worker-side relevance ranking
const productNamesMap: Record<number, string> = products.reduce((acc, p) => {
  acc[p.id] = [p.name, p.type, p.fabric, ...p.work, ...p.occasion, ...p.colors, ...p.tags].join(' | ');
  return acc;
}, {} as Record<number, string>);

export function useFilterEngine(filters: FilterState) {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<FilterResult>({
    matchedIds: products.map((p) => p.id),
    facetCounts: {},
    totalMatches: products.length,
    computeTimeMs: 0,
  });

  const workerRef = useRef<Worker | null>(null);

  // Initialize Worker
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/bitmask-engine.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<BitmaskWorkerResponse>) => {
      const data = e.data;
      if (data.type === 'FILTER_RESULT') {
        startTransition(() => {
          setResults({
            matchedIds: data.matchedIds,
            facetCounts: data.facetCounts,
            totalMatches: data.totalMatches,
            computeTimeMs: data.computeTimeMs,
          });
        });
      }
    };

    // Initialize worker with encoded catalog
    worker.postMessage({
      type: 'INIT',
      products: encodedCatalog,
    });

    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  // Post new filters to Web Worker when state changes
  useEffect(() => {
    if (!workerRef.current) return;

    // Convert FilterState to FacetQueryMask[]
    const facetMasks: FacetQueryMask[] = [];

    const keys = Object.keys(filters) as Array<keyof FilterState>;

    for (const key of keys) {
      if (key === 'sortBy' || key === 'searchQuery') continue;

      const selections = filters[key] as string[];
      if (selections && selections.length > 0) {
        const fieldIndex = FACET_FIELD_INDEX[key];
        const schema = BITMASK_SCHEMA[key as FacetId];

        let mask = 0;
        for (const val of selections) {
          // @ts-ignore - dynamic lookup on schema values
          const bit = schema.values[val];
          if (bit !== undefined) {
            mask |= bit;
          }
        }

        if (mask > 0) {
          facetMasks.push({
            facetId: key,
            fieldIndex,
            mask,
          });
        }
      }
    }

    // Debounce worker message slightly for rapid typing or range dragging (50ms is perfect)
    const timeoutId = setTimeout(() => {
      workerRef.current?.postMessage({
        type: 'FILTER',
        facetMasks,
        sortBy: filters.sortBy,
        searchQuery: filters.searchQuery,
        productNames: productNamesMap,
      });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return {
    matchedIds: results.matchedIds,
    facetCounts: results.facetCounts,
    totalMatches: results.totalMatches,
    computeTimeMs: results.computeTimeMs,
    isPending,
  };
}
