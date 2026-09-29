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
  const recommendations = pairings.length > 0 ? pairings : similar;
  const recommendationBadge = pairings.length > 0 ? 'Perfect Pairing' : 'Similar Style';

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
    <div className="mt-12 border-t border-stone-100 pt-10">
      {recommendations.length > 0 && (
        <section className="space-y-4" aria-labelledby="complete-the-look-heading">
          <div>
            <h3 id="complete-the-look-heading" className="text-lg sm:text-xl font-serif text-stone-900">
              Complete the Look
            </h3>
            <p className="mt-0.5 text-xs text-stone-500">
              Curated pieces that complement your current selection.
            </p>
          </div>

          <div className="flex snap-x gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-stone-200">
            {recommendations.map((item) => renderCard(item, recommendationBadge))}
          </div>
        </section>
      )}
    </div>
  );
};
export default StylePairings;
