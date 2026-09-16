// ─── Quick View Shop Modal Component ──────────────────────────────────────────
import React, { useState } from 'react';
import type { Product, Size } from '../../types/product';
import { SizeSelector } from '../filters/SizeSelector';
import { useCartStore } from '../../app/providers/cart-store';
import { ProgressiveImage } from '../shared/ProgressiveImage';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickView: React.FC<QuickViewProps> = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size before adding.');
      return;
    }
    setErrorMsg(null);

    const res = addToCart(product, selectedSize, quantity);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Failed to reserve item.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white border border-stone-100 rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-stone-500 hover:text-stone-900 transition-colors shadow-sm"
        >
          &times;
        </button>

        {/* Gallery Image */}
        <div className="w-full md:w-1/2 bg-stone-50 relative aspect-[3/4] md:aspect-auto">
          <ProgressiveImage
            src={product.images[0].url}
            blurhash={product.images[0].blurhash}
            sources={product.images[0].sources}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">
                Nandini Collection
              </span>
              <h3 className="font-serif text-xl font-medium text-stone-900 mt-1 capitalize">
                {product.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5 capitalize">
                Fabric: {product.fabric} • Occasion: {product.occasion.join(', ')}
              </p>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-lg font-bold text-stone-900">
                {formatPrice(product.salePrice)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-xs text-stone-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-amber-700">
                    ({product.discount}% OFF)
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-stone-550 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-stone-100 pt-4">
              <SizeSelector
                productId={product.id}
                selectedSize={selectedSize}
                onSelectSize={(size) => {
                  setSelectedSize(size);
                  setErrorMsg(null);
                }}
              />
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 mt-6 space-y-3.5">
            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded text-xs text-rose-700 font-semibold animate-shake">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-700 font-semibold text-center">
                ✓ Reserved & Added to Cart!
              </div>
            )}

            <div className="flex gap-4">
              {/* Qty Dropdown */}
              {!isSuccess && (
                <div className="flex flex-col">
                  <label className="text-[9px] font-bold text-stone-500 uppercase mb-1">
                    Qty
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="px-3 py-2.5 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm bg-white cursor-pointer font-semibold"
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                disabled={isSuccess}
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-all shadow disabled:bg-emerald-600 disabled:shadow-none"
              >
                {isSuccess ? 'Added' : 'Reserve & Add To Cart'}
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              * Reservation guarantees stock lock for 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickView;
