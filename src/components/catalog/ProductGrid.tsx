// ─── Product Grid Component ──────────────────────────────────────────────────
import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { products } from '../../data/products';

interface ProductGridProps {
  matchedIds: number[];
  isPending: boolean;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  matchedIds,
  isPending,
  onSelectProduct,
  onQuickAdd,
}) => {
  // Map IDs to products catalog
  const filteredProducts = React.useMemo(() => {
    return matchedIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  }, [matchedIds]);

  const apparelProducts = React.useMemo(
    () => filteredProducts.filter((product) => !product.name.toLowerCase().includes('hoop art')),
    [filteredProducts]
  );
  const handmadeProducts = React.useMemo(
    () => filteredProducts.filter((product) => product.name.toLowerCase().includes('hoop art')),
    [filteredProducts]
  );

  // Loading skeleton shimmers
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, i) => (
      <div
        key={`skel-${i}`}
        className="flex flex-col bg-white border border-stone-100 rounded-lg overflow-hidden animate-pulse shadow-sm"
      >
        <div className="aspect-[3/4] bg-stone-100 relative" />
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-3 w-1/4 bg-stone-100 rounded" />
            <div className="h-4 w-3/4 bg-stone-100 rounded" />
            <div className="h-3 w-1/2 bg-stone-100 rounded" />
          </div>
          <div className="h-5 w-1/3 bg-stone-100 rounded mt-4" />
        </div>
      </div>
    ));
  };

  if (isPending && filteredProducts.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 py-4">
        {renderSkeletons()}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <svg
          className="h-16 w-16 text-stone-300 mb-4 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="font-serif text-xl font-medium text-stone-800">
          Nothing matched this edit
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mt-1">
          Try clearing one of the filters or searching for another colour, fabric, or occasion.
        </p>
      </div>
    );
  }

  const renderProductCards = (items: Product[]) => (
    <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );

  return (
    <div className="relative">
      {/* Dynamic processing backdrop overlay */}
      {isPending && (
        <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" />
      )}

      {apparelProducts.length > 0 && renderProductCards(apparelProducts)}

      {handmadeProducts.length > 0 && (
        <section className="relative mt-12 overflow-hidden rounded-sm border border-amber-900/10 bg-[#f3eee7] p-6 sm:p-8 md:p-10" aria-labelledby="hoop-art-heading">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-amber-800/10" />
          <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-amber-800/10" />
          <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center lg:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="max-w-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-800">The Nandini home edit</p>
              <h2 id="hoop-art-heading" className="mt-3 font-serif text-3xl leading-tight text-stone-950 sm:text-4xl">Hoop Art</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
                Hand-embroidered stories for your favourite corner, or a thoughtful gift for someone who notices the little things.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
                <span><span className="text-amber-700">✦</span> Handmade</span>
                <span><span className="text-amber-700">✦</span> Giftable</span>
                <span><span className="text-amber-700">✦</span> One of one</span>
              </div>
            </div>
            <div className="relative w-full">
              {handmadeProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default ProductGrid;
