// ─── Header Navigation Layout Component (Sticky Glassmorphism) ────────────────
import React from 'react';
import { useFilterStore } from '../../app/providers/filter-store';
import { useCartStore } from '../../app/providers/cart-store';

interface HeaderProps {
  onCartToggle: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartToggle, onGoHome }) => {
  const searchQuery = useFilterStore((state) => state.filters.searchQuery);
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery);
  const cartItemsCount = useCartStore((state) => state.totalItems);

  return (
    <header className="safe-area-top sticky top-0 z-40 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-xl">
      <div className="hidden md:flex items-center justify-center bg-stone-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-100">
        Complimentary shipping across India on orders above ₹2,500
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[4.75rem] flex items-center justify-between gap-4">
        {/* Brand Logo Link */}
        <button
          type="button"
          onClick={onGoHome}
          className="min-w-0 flex-shrink flex items-baseline gap-2 md:gap-4 focus:outline-none"
          aria-label="NandiniCollection home"
        >
          <span className="whitespace-nowrap font-serif text-[clamp(1.05rem,5.5vw,1.5rem)] font-normal tracking-[clamp(0.2em,1.4vw,0.32em)] leading-none uppercase text-stone-900 hover:text-amber-800 transition-colors">
            Nandini
          </span>
          <span className="whitespace-nowrap font-sans text-[clamp(0.42rem,1.8vw,0.68rem)] font-bold tracking-[clamp(0.22em,0.8vw,0.32em)] leading-none text-[#bf4d0b] uppercase">
            Collection
          </span>
        </button>

        {/* Global Search box */}
        <div className="flex-1 max-w-lg relative hidden md:block">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-200 rounded-full focus:border-stone-900 focus:outline-none bg-white/60 hover:bg-white transition-colors"
          />
          <svg className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          {/* Mobile search toggle trigger or info */}
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 hidden xl:inline-block">Kota · Rajasthan</span>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={onCartToggle}
            className="relative p-2 text-stone-700 hover:text-stone-900 transition-colors focus:outline-none"
            aria-label="Toggle Shopping Cart"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 8.5h14l-1 11H6l-1-11Z"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"/></svg>
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 h-4.5 min-w-4.5 px-1 flex items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white shadow-sm ring-2 ring-white scale-95 animate-scale-up">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
