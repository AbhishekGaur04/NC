// ─── Zustand Filter Store ─────────────────────────────────────────────────────
import { create } from 'zustand';
import type { FilterState, SortOption } from '../../types/filter';

interface FilterStoreState {
  filters: FilterState;
  toggleFilter: (facet: keyof Omit<FilterState, 'sortBy' | 'searchQuery'>, value: string) => void;
  clearFacet: (facet: keyof Omit<FilterState, 'sortBy' | 'searchQuery'>) => void;
  clearAll: () => void;
  setSortBy: (sortBy: SortOption) => void;
  setSearchQuery: (query: string) => void;
}

const initialFilters: FilterState = {
  productType: [],
  fabric: [],
  work: [],
  occasion: [],
  color: [],
  size: [],
  priceRange: [],
  discountRange: [],
  sortBy: 'relevance',
  searchQuery: '',
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  filters: initialFilters,

  toggleFilter: (facet, value) =>
    set((state) => {
      const currentList = state.filters[facet] as string[];
      const isExist = currentList.includes(value);
      const updatedList = isExist
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];

      return {
        filters: {
          ...state.filters,
          [facet]: updatedList,
        },
      };
    }),

  clearFacet: (facet) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [facet]: [],
      },
    })),

  clearAll: () =>
    set(() => ({
      filters: initialFilters,
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
      },
    })),

  setSearchQuery: (searchQuery) =>
    set((state) => ({
      filters: {
        ...state.filters,
        searchQuery,
      },
    })),
}));
