// ─── App Root Shell Component ────────────────────────────────────────────────
import React, { useState } from 'react';
import { useFilterStore } from './app/providers/filter-store';
import { useCartStore } from './app/providers/cart-store';
import { useFilterEngine } from './hooks/useFilterEngine';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/layout/HeroBanner';
import { ActiveFilters } from './components/filters/ActiveFilters';
import { FilterPanel } from './components/filters/FilterPanel';
import { ProductGrid } from './components/catalog/ProductGrid';
import { QuickView } from './components/catalog/QuickView';
import { ProductDetail } from './components/product/ProductDetail';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutFlow } from './components/cart/CheckoutFlow';
import { Toast } from './components/shared/Toast';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { PolicyModal, type PolicySection } from './components/shared/PolicyModal';
import { WhatsAppButton } from './components/shared/WhatsAppButton';
import type { Product } from './types/product';

export const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickShopProduct, setQuickShopProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<PolicySection | null>(null);

  // Read filter store and trigger worker bridge hook
  const filters = useFilterStore((state) => state.filters);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  const { matchedIds, facetCounts, totalMatches, computeTimeMs, isPending } = useFilterEngine(filters);

  // Cart operations
  const openCart = useCartStore((state) => state.openCart);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Scroll window smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedProduct(null);
    setQuickShopProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans pb-14 md:pb-0">
      {/* Dynamic Toast alerts */}
      <Toast />

      {/* Navigation Header */}
      <Header onCartToggle={openCart} onGoHome={handleGoHome} />

      <main className="flex-1">
        {selectedProduct ? (
          /* PRODUCT DETAILS PAGE VIEW */
            <ProductDetail
              product={selectedProduct}
              onBack={handleGoHome}
              onSelectProduct={handleSelectProduct}
              onOpenPolicies={() => setOpenPolicy('shipping')}
          />
        ) : (
          /* CATALOG SEARCH VIEW */
          <>
            {/* Banner Section */}
            <HeroBanner />

            {/* Catalog Layout container */}
            <div id="collection" className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-8 sm:px-6 md:flex-row">
              {/* Desktop sidebar Filter panel */}
              <div className="hidden md:block w-64 flex-shrink-0 sticky top-22 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-2 custom-scroll">
                <FilterPanel currentCounts={facetCounts} />
              </div>

              {/* Main List Section */}
              <div className="flex-1 w-full space-y-4">
                {/* Control bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-serif text-xl font-medium text-stone-900">
                      The collection
                    </h2>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
                      {totalMatches} pieces · {computeTimeMs}ms
                    </span>
                  </div>

                  {/* Sort filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                      Sort
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      aria-label="Sort the collection"
                      className="cursor-pointer rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium focus:border-stone-900 focus:outline-none"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">New Arrivals</option>
                      <option value="rating">Customer Rating</option>
                      <option value="discount">Best Discounts</option>
                    </select>
                  </div>
                </div>

                {/* Filter tags panel */}
                <ActiveFilters />

                {/* Performance Catalog window */}
                <ProductGrid
                  matchedIds={matchedIds}
                  isPending={isPending}
                  onSelectProduct={handleSelectProduct}
                  onQuickAdd={setQuickShopProduct}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer layout */}
      <Footer onOpenPolicy={setOpenPolicy} />

      {/* Persistent customer support entry point. Product pages include the selected product in the message. */}
      <WhatsAppButton product={selectedProduct} />

      <PolicyModal section={openPolicy} onClose={() => setOpenPolicy(null)} />

      {/* Mobile Drawer Filter panel */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-sm animate-fade-in md:hidden">
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col relative animate-slide-left">
            <FilterPanel
              currentCounts={facetCounts}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile Nav footer */}
      <MobileNav
        onFilterToggle={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        onCartToggle={openCart}
        onGoHome={handleGoHome}
      />

      {/* Slide-out Cart Drawer panel */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {/* Multi-step Checkout dialog flow */}
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenPolicies={() => setOpenPolicy('shipping')}
      />

      {/* Quick View shop drawer modal */}
      <QuickView product={quickShopProduct} onClose={() => setQuickShopProduct(null)} />
    </div>
  );
};
export default App;
