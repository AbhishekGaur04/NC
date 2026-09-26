// ─── Size Selector Module (Compulsory Module) ─────────────────────────────────
import React, { useEffect, useState, useTransition } from 'react';
import type { Size } from '../../types/product';
import { stockMatrix } from '../../app/providers/cart-store';

interface SizeSelectorProps {
  productId: number;
  selectedSize: Size | null;
  onSelectSize: (size: Size) => void;
  isFilterMode?: boolean; // If true, behaves like a multi-select facet filter
}

export const SizeSelector: React.FC<SizeSelectorProps> = React.memo(({
  productId,
  selectedSize,
  onSelectSize,
  isFilterMode = false,
}) => {
  const [, startTransition] = useTransition();
  const [sizesAvailability, setSizesAvailability] = useState(() =>
    stockMatrix.getSizeAvailability(productId)
  );

  // Keep stock counts in sync with StockMatrix events (isolated leaf-node rendering)
  useEffect(() => {
    const unsubscribe = stockMatrix.subscribe(() => {
      startTransition(() => {
        setSizesAvailability(stockMatrix.getSizeAvailability(productId));
      });
    });
    return unsubscribe;
  }, [productId]);

  const handleSizeClick = (size: Size) => {
    onSelectSize(size);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wider uppercase text-stone-700">
          {isFilterMode ? 'Sizes' : 'Select Size'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizesAvailability.map(({ size }) => {
          const isSelected = selectedSize === size;
          const status = stockMatrix.getStockStatus(productId, size);

          // Style conditions
          let btnClass = 'px-4 py-2 text-sm font-medium border rounded-md transition-all duration-300 relative ';

          if (status === 'out_of_stock') {
            btnClass += 'border-stone-200 text-stone-400 bg-stone-50 cursor-not-allowed line-through';
          } else if (status === 'low_stock') {
            btnClass += isSelected
              ? 'border-amber-700 text-amber-700 bg-amber-50/50'
              : 'border-amber-200 text-stone-700 hover:border-amber-500 bg-amber-50/10';
          } else {
            btnClass += isSelected
              ? 'border-stone-900 text-white bg-stone-900'
              : 'border-stone-200 text-stone-800 hover:border-stone-400 bg-white';
          }

          return (
            <button
              key={size}
              type="button"
              disabled={status === 'out_of_stock' && !isFilterMode}
              onClick={() => handleSizeClick(size)}
              className={btnClass}
            >
              {size}

              {/* Stock Badges (only if low stock) */}
              {!isFilterMode && status === 'low_stock' && (
                <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Low Stock Indicator Helper */}
      {!isFilterMode && (
        <div className="flex gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> In Stock
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Low Stock (≤ 3 left)
          </div>
          <div className="flex items-center gap-1.5 font-medium line-through decoration-stone-300">
            XS
          </div> Out of Stock
        </div>
      )}

    </div>
  );
});

SizeSelector.displayName = 'SizeSelector';
