// ─── Filter Group Component ──────────────────────────────────────────────────
import React, { useState } from 'react';
import { useFilterStore } from '../../app/providers/filter-store';
import { COLOR_HEX } from '../../data/products';

interface FilterGroupProps {
  facetId: string;
  label: string;
  type: 'checkbox' | 'color' | 'size' | 'price' | 'discount';
  options: Array<{ value: string; label: string }>;
  currentCounts: Record<string, number>;
}

export const FilterGroup: React.FC<FilterGroupProps> = React.memo(({
  facetId,
  label,
  type,
  options,
  currentCounts,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const activeFilters = useFilterStore((state) => state.filters[facetId as keyof typeof state.filters] as string[]);
  const toggleFilter = useFilterStore((state) => state.toggleFilter);
  const hasCounts = Object.keys(currentCounts).length > 0;
  const visibleOptions = options.filter((option) => {
    const count = currentCounts[option.value] || 0;
    return !hasCounts || count > 0 || activeFilters.includes(option.value);
  });

  const handleToggle = (value: string) => {
    // @ts-ignore
    toggleFilter(facetId, value);
  };

  return (
    <div className="border-b border-stone-100 py-4">
      {/* Header (Collapsible toggle) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold tracking-wide text-stone-900 focus:outline-none"
      >
        <span className="uppercase text-xs tracking-wider">{label}</span>
        <svg
          className={`h-4 w-4 transform text-stone-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options Body */}
      {isExpanded && (
        <div className="mt-3 space-y-2.5 animate-slide-down">
          {type === 'color' ? (
            /* 1. Color Swatch Grid */
            <div className="grid grid-cols-5 gap-2.5 pt-1">
              {visibleOptions.map((opt) => {
                const count = currentCounts[opt.value] || 0;
                const isSelected = activeFilters.includes(opt.value);
                const hex = COLOR_HEX[opt.value] || '#CCCCCC';
                const isDisabled = count === 0 && !isSelected;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleToggle(opt.value)}
                    title={`${opt.label} (${count})`}
                    className={`relative h-8 w-8 rounded-full border transition-all duration-200 flex items-center justify-center ${
                      isSelected
                        ? 'border-stone-900 scale-110 shadow-sm ring-1 ring-stone-950 ring-offset-2'
                        : 'border-stone-200 hover:scale-105'
                    } ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                    style={{ background: hex }}
                  >
                    {isSelected && (
                      <span
                        className={`text-[10px] font-bold ${
                          opt.value === 'white' || opt.value === 'ivory' || opt.value === 'peach' || opt.value === 'yellow'
                            ? 'text-stone-900'
                            : 'text-white'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                    {count > 0 && !isSelected && (
                      <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-stone-900 text-[7px] font-bold text-white shadow-sm scale-90">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* 2. Standard Checkbox List */
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scroll">
              {visibleOptions.map((opt) => {
                const count = currentCounts[opt.value] || 0;
                const isSelected = activeFilters.includes(opt.value);
                const isDisabled = count === 0 && !isSelected;

                return (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-between text-xs font-medium cursor-pointer py-0.5 select-none transition-colors ${
                      isDisabled
                        ? 'text-stone-300 cursor-not-allowed'
                        : isSelected
                        ? 'text-stone-900 font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => handleToggle(opt.value)}
                        className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <span>{opt.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-stone-900 text-white font-bold'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

FilterGroup.displayName = 'FilterGroup';
