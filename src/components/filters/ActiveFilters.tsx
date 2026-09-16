// ─── Active Filter Chips Component ───────────────────────────────────────────
import React from 'react';
import { useFilterStore } from '../../app/providers/filter-store';
import { FACET_LABELS } from '../../data/products';

export const ActiveFilters: React.FC = () => {
  const filters = useFilterStore((state) => state.filters);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);
  const clearAll = useFilterStore((state) => state.clearAll);

  const activeChips: Array<{ facet: string; value: string; label: string }> = [];

  // Gather active filter values and resolve display labels
  Object.entries(filters).forEach(([facetKey, values]) => {
    if (facetKey === 'sortBy' || facetKey === 'searchQuery') return;
    if (Array.isArray(values)) {
      values.forEach((val) => {
        // @ts-ignore
        const groupLabels = FACET_LABELS[facetKey];
        const label = groupLabels ? groupLabels[val] || val : val;
        activeChips.push({
          facet: facetKey,
          value: val,
          label: `${facetKey === 'color' ? 'Color: ' : ''}${label}`,
        });
      });
    }
  });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 px-1">
      <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
        Active:
      </span>

      {activeChips.map((chip) => (
        <span
          key={`${chip.facet}-${chip.value}`}
          onClick={() => {
            // @ts-ignore
            toggleFilter(chip.facet, chip.value);
          }}
          className="group inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 border border-stone-200 text-stone-700 rounded-full text-xs font-medium cursor-pointer hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 animate-fade-in"
        >
          <span>{chip.label}</span>
          <span className="text-[10px] text-stone-400 group-hover:text-stone-200 font-bold transition-colors">
            &times;
          </span>
        </span>
      ))}

      <button
        type="button"
        onClick={clearAll}
        className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition-colors uppercase tracking-wider pl-1.5"
      >
        Clear All
      </button>
    </div>
  );
};
export default ActiveFilters;
