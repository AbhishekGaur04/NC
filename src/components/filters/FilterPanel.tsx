// ─── Filter Panel Sidebar Component ───────────────────────────────────────────
import React from 'react';
import { useFilterStore } from '../../app/providers/filter-store';
import { FilterGroup } from './FilterGroup';
import { FACET_LABELS } from '../../data/products';

interface FilterPanelProps {
  currentCounts: Record<string, Record<string, number>>;
  onClose?: () => void; // for mobile drawer
}

export const FilterPanel: React.FC<FilterPanelProps> = React.memo(({
  currentCounts,
  onClose,
}) => {
  const clearAll = useFilterStore((state) => state.clearAll);

  // Convert schema descriptors into options lists
  const getOptions = (facetId: keyof typeof FACET_LABELS) => {
    return Object.entries(FACET_LABELS[facetId]).map(([value, label]) => ({
      value,
      label,
    }));
  };

  return (
    <aside className="w-full flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 py-4 px-1">
        <h2 className="text-sm font-bold tracking-wider uppercase text-stone-900">
          Filters
        </h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors uppercase tracking-wider"
          >
            Clear All
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-stone-500 hover:text-stone-900 md:hidden"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Filter Categories list */}
      <div className="flex-1 overflow-y-auto custom-scroll pr-1 space-y-1">
        <FilterGroup
          facetId="productType"
          label="Category"
          type="checkbox"
          options={getOptions('productType')}
          currentCounts={currentCounts.productType || {}}
        />

        <FilterGroup
          facetId="color"
          label="Colors"
          type="color"
          options={getOptions('color')}
          currentCounts={currentCounts.color || {}}
        />

        <FilterGroup
          facetId="priceRange"
          label="Price"
          type="checkbox"
          options={getOptions('priceRange')}
          currentCounts={currentCounts.priceRange || {}}
        />

        <FilterGroup
          facetId="fabric"
          label="Fabric"
          type="checkbox"
          options={getOptions('fabric')}
          currentCounts={currentCounts.fabric || {}}
        />

        <FilterGroup
          facetId="work"
          label="Work & Craft"
          type="checkbox"
          options={getOptions('work')}
          currentCounts={currentCounts.work || {}}
        />

        <FilterGroup
          facetId="occasion"
          label="Occasion"
          type="checkbox"
          options={getOptions('occasion')}
          currentCounts={currentCounts.occasion || {}}
        />

        <FilterGroup
          facetId="discountRange"
          label="Discount"
          type="checkbox"
          options={getOptions('discountRange')}
          currentCounts={currentCounts.discountRange || {}}
        />
      </div>
    </aside>
  );
});

FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
