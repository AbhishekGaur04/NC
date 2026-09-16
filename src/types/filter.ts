// ─── Filter State & Facet Types ───────────────────────────────────────────────

import type { ProductType, Fabric, Work, Occasion, Color, Size, PriceRange, DiscountRange } from './product';

export interface FacetOption {
  value: string;
  label: string;
  count: number;          // Number of products matching this option
  isActive: boolean;      // Currently selected by user
  colorHex?: string;      // For color swatches
}

export interface FacetGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'color' | 'size' | 'range' | 'toggle';
  options: FacetOption[];
  isExpanded: boolean;
}

export interface FilterState {
  productType: ProductType[];
  fabric: Fabric[];
  work: Work[];
  occasion: Occasion[];
  color: Color[];
  size: Size[];
  priceRange: PriceRange[];
  discountRange: DiscountRange[];
  sortBy: SortOption;
  searchQuery: string;
}

export type SortOption =
  | 'relevance'
  | 'price-low'
  | 'price-high'
  | 'newest'
  | 'rating'
  | 'discount';

export interface FilterResult {
  matchedIds: number[];
  facetCounts: Record<string, Record<string, number>>;
  totalMatches: number;
  computeTimeMs: number;
}

export type FilterAction =
  | { type: 'TOGGLE_FILTER'; facet: keyof Omit<FilterState, 'sortBy' | 'searchQuery'>; value: string }
  | { type: 'SET_SORT'; sortBy: SortOption }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'CLEAR_FACET'; facet: keyof Omit<FilterState, 'sortBy' | 'searchQuery'> }
  | { type: 'CLEAR_ALL' };
