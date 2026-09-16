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

  // Custom stitched measurements state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState({
    bust: '',
    waist: '',
    hip: '',
    height: '',
  });

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
    if (size === 'Custom' && !isFilterMode) {
      setShowCustomModal(true);
    }
    onSelectSize(size);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wider uppercase text-stone-700">
          {isFilterMode ? 'Sizes' : 'Select Size'}
        </span>
        {!isFilterMode && (
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="text-xs font-semibold underline text-amber-700 hover:text-amber-800 transition-colors"
          >
            Size Guide & Custom Stitching
          </button>
        )}
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

      {/* Custom Stitching Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white border border-stone-100 rounded-lg p-6 shadow-2xl animate-fade-in relative">
            <button
              type="button"
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-lg"
            >
              &times;
            </button>

            <h3 className="text-xl font-serif text-stone-900 mb-2">Custom Tailored Fit</h3>
            <p className="text-xs text-stone-500 mb-6">
              Our master tailors will hand-stitch your piece to perfection. Input your measurements below (in inches).
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Bust
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="34"
                    value={customMeasurements.bust}
                    onChange={(e) => setCustomMeasurements({ ...customMeasurements, bust: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-amber-600 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Waist
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="28"
                    value={customMeasurements.waist}
                    onChange={(e) => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-amber-600 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Hips
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="38"
                    value={customMeasurements.hip}
                    onChange={(e) => setCustomMeasurements({ ...customMeasurements, hip: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-amber-600 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    Height (Ft/In)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="5'4"
                    value={customMeasurements.height}
                    onChange={(e) => setCustomMeasurements({ ...customMeasurements, height: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-amber-600 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 rounded p-3 text-[11px] text-stone-600 leading-relaxed">
                <span className="font-semibold text-stone-800">Note:</span> Custom tailored outfits require an additional 4-5 business days for styling, embroidery finishing, and master-craft tailoring.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-md text-sm text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-sm transition-colors"
                >
                  Apply Measurements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

SizeSelector.displayName = 'SizeSelector';
