// ─── Style Recommendations & Completing the Look Carousel ──────────────────────
import React from 'react';
import type { Product } from '../../types/product';
import { useRecommendations } from '../../hooks/useRecommendations';
import { ProgressiveImage } from '../shared/ProgressiveImage';

interface StylePairingsProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const StylePairings: React.FC<StylePairingsProps> = ({ product, onSelectProduct }) => {
  const { similar, pairings } = useRecommendations(product.id, product.type, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderCard = (item: Product, badge: string) => {
    return (
      <div
        key={item.id}
        onClick={() => onSelectProduct(item)}
        className="group flex-shrink-0 w-44 sm:w-56 cursor-pointer bg-white border border-stone-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative overflow-hidden aspect-[3/4]">
          <ProgressiveImage
            src={item.images[0].url}
            blurhash={item.images[0].blurhash}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {badge && (
            <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-700 text-white rounded">
              {badge}
            </span>
          )}
        </div>

        <div className="p-3">
          <h4 className="font-medium text-xs sm:text-sm text-stone-800 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {item.name}
          </h4>
          <p className="text-[11px] text-stone-400 mt-0.5 capitalize">
            {item.fabric} • {item.type}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {formatPrice(item.salePrice)}
            </span>
            {item.discount > 0 && (
              <>
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  {formatPrice(item.price)}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-700">
                  ({item.discount}% Off)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12 border-t border-stone-100 pt-10 space-y-10">
      {/* 1. Complete the Look (Pairings) */}
      {pairings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-stone-900">Complete the Look</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Our in-house design team suggests pairing these together.
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-stone-200">
            {pairings.map((item) => renderCard(item, 'Perfect Pairing'))}
          </div>
        </div>
      )}

      {/* 2. Similar Styling Suggestions */}
      {similar.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-serif text-stone-900">You May Also Like</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Similar fabrics, embroidery, and design work profiles.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-stone-200">
            {similar.map((item) => renderCard(item, 'Similar Tag'))}
          </div>
        </div>
      )}
    </div>
  );
};
export default StylePairings;
