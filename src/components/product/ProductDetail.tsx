// ─── Product Detail Page Layout with Zoom Gallery ────────────────────────────
import React, { useState } from 'react';
import type { Product, Size } from '../../types/product';
import { SizeSelector } from '../filters/SizeSelector';
import { StylePairings } from './StylePairings';
import { useCartStore } from '../../app/providers/cart-store';
import { ProgressiveImage } from '../shared/ProgressiveImage';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenPolicies?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onSelectProduct,
  onOpenPolicies,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    display: 'none',
    backgroundPosition: '0% 0%',
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const typeLabel = product.type === 'hoop-art'
    ? 'Hoop Art'
    : product.type.charAt(0).toUpperCase() + product.type.slice(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${product.images[activeImageIndex].url})`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
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
      }, 1500);
    } else {
      setErrorMsg(res.error || 'Failed to reserve item.');
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Back Button Link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider focus:outline-none"
      >
        ← Back to Catalog
      </button>

      {/* Main product display section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side: Images & Interactive Zoom Gallery */}
        <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`h-20 w-15 md:h-24 md:w-18 flex-shrink-0 border rounded overflow-hidden aspect-[3/4] transition-all duration-300 ${
                  activeImageIndex === idx ? 'border-stone-950 scale-105 shadow-sm' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Active Image frame with Magnifier hover */}
          <div className="flex-1 order-1 md:order-2 bg-stone-50 border border-stone-100 rounded-lg overflow-hidden relative aspect-[3/4]">
            <div
              className="relative w-full h-full cursor-zoom-in overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <ProgressiveImage
                src={product.images[activeImageIndex].url}
                blurhash={product.images[activeImageIndex].blurhash}
                sources={product.images[activeImageIndex].sources}
                alt={product.images[activeImageIndex].alt}
                className="w-full h-full object-cover"
              />

              {/* Magnifier Panel */}
              <div
                className="absolute inset-0 pointer-events-none bg-no-repeat bg-[length:250%] transition-opacity duration-200"
                style={{
                  ...zoomStyle,
                  transition: 'opacity 0.15s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Form */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between py-2">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                Nandini Collection
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-1 capitalize leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                  {product.fabric}
                </span>
                <span>•</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                  {typeLabel}
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3.5 border-y border-stone-100 py-3.5">
              <span className="text-2xl font-bold text-stone-900">
                {formatPrice(product.salePrice)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-semibold text-amber-700">
                    ({product.discount}% OFF)
                  </span>
                </>
              )}
            </div>

            {/* Description details */}
            <div className="space-y-2 text-sm text-stone-650 leading-relaxed">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 pt-2 text-xs text-stone-550 space-y-1.5">
                <li>
                  Craft & Embroidery Work: <span className="capitalize font-semibold text-stone-750">{product.work.join(', ')}</span>
                </li>
                <li>
                  Ideal Occasions: <span className="capitalize font-semibold text-stone-750">{product.occasion.join(', ')}</span>
                </li>
                <li>Authentic premium quality finishes with designer thread linings.</li>
              </ul>
            </div>

            {/* Size Facet selector */}
            <div className="border-t border-stone-100 pt-5">
              <SizeSelector
                productId={product.id}
                selectedSize={selectedSize}
                onSelectSize={(size) => {
                  setSelectedSize(size);
                  setErrorMsg(null);
                }}
              />
              <button
                type="button"
                onClick={onOpenPolicies}
                className="mt-4 text-left text-[11px] font-semibold text-amber-700 underline decoration-amber-200 underline-offset-4 hover:text-amber-900"
              >
                Final sale · 2-day defect and size exchange policy
              </button>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6 mt-8 space-y-4">
            {/* Error notifications */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded text-xs text-rose-700 font-semibold animate-shake">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Success notifications */}
            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-700 font-semibold text-center">
                ✓ Garment Reserved! Check your cart drawer.
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
                className="flex-1 py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:bg-emerald-600 disabled:shadow-none"
              >
                {isSuccess ? 'Reserved' : 'Reserve & Add To Cart'}
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              * Stocks are reserved and locked to your cart for 10 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Complete the Look */}
      <StylePairings product={product} onSelectProduct={onSelectProduct} />
    </article>
  );
};
export default ProductDetail;
