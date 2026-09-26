// ─── Product Card Component (Leaf Node Memoized) ──────────────────────────────
import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { ProgressiveImage } from '../shared/ProgressiveImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const primaryImage = product.images[0];
  const hoverImage = product.images[1] || primaryImage;
  const typeLabel = product.type === 'hoop-art'
    ? 'Hoop Art'
    : product.type.charAt(0).toUpperCase() + product.type.slice(1);

  // Determine badge
  let badgeText = '';
  let badgeColor = '';
  if (product.isNew) {
    badgeText = 'NEW';
    badgeColor = 'bg-stone-900 text-white';
  } else if (product.isBestseller) {
    badgeText = 'BESTSELLER';
    badgeColor = 'bg-amber-700 text-white';
  } else if (product.discount >= 30) {
    badgeText = `${product.discount}% OFF`;
    badgeColor = 'bg-red-700 text-white';
  }

  return (
    <div
      onClick={() => onSelect(product)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(product);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-stone-200/80 bg-white cursor-pointer shadow-[0_8px_25px_rgba(55,45,35,0.04)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(55,45,35,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}
    >
      {/* Visual & Image Wrap */}
      <div className="relative overflow-hidden aspect-[3/4] w-full">
        {/* Render Primary / Hover image swap */}
        <ProgressiveImage
          src={isHovered ? hoverImage.url : primaryImage.url}
          blurhash={isHovered ? hoverImage.blurhash : primaryImage.blurhash}
          sources={isHovered ? hoverImage.sources : primaryImage.sources}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Badge */}
        {badgeText && (
          <span className={`absolute left-3 top-3 rounded-sm px-2 py-1 text-[9px] font-bold tracking-[0.16em] uppercase ${badgeColor}`}>
            {badgeText}
          </span>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/95 backdrop-blur-sm text-[10px] font-bold text-stone-800 shadow-sm">
          <span>{product.rating}</span>
          <span className="text-amber-500">★</span>
          <span className="text-stone-400 font-normal border-l border-stone-200 pl-1">
            {product.reviewCount}
          </span>
        </div>

        {/* Quick Add Overlay Button */}
        {onQuickAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="absolute inset-x-3 bottom-3 py-2 text-xs font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-stone-900 rounded border border-stone-200 shadow hover:bg-stone-900 hover:text-white hover:border-stone-900 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out"
          >
            Quick Shop
          </button>
        )}
      </div>

      {/* Detail Block */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
          {product.isNew ? 'Just arrived' : 'Nandini edit'}
        </span>
        <h3 className="mt-1 line-clamp-1 font-serif text-[15px] font-medium text-stone-900 transition-colors group-hover:text-amber-800">
          {product.name}
        </h3>
        <p className="mt-1 text-[11px] capitalize text-stone-500">
          {product.type === 'hoop-art' ? 'Hand-embroidered' : product.fabric} • {typeLabel}
        </p>

        {/* Price Row */}
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-sm font-bold text-stone-900">
            {formatPrice(product.salePrice)}
          </span>
          {product.discount > 0 && (
            <>
              <span className="text-[11px] text-stone-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] font-bold text-amber-700">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
