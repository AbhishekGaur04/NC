// ─── Mobile Bottom Navigation Component ─────────────────────────────────────────
import React from 'react';
import { useFilterStore } from '../../app/providers/filter-store';
import { useCartStore } from '../../app/providers/cart-store';

interface MobileNavProps {
  onFilterToggle: () => void;
  onCartToggle: () => void;
  onGoHome: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  onFilterToggle,
  onCartToggle,
  onGoHome,
}) => {
  const cartItemsCount = useCartStore((state) => state.totalItems);
  const clearAllFilters = useFilterStore((state) => state.clearAll);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-150/40 md:hidden flex justify-around items-center h-14 shadow-lg">
      {/* Home trigger */}
      <button
        type="button"
        onClick={() => {
          clearAllFilters();
          onGoHome();
        }}
        className="flex flex-col items-center justify-center text-[10px] uppercase font-bold text-stone-500 hover:text-stone-900 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 10h16M6 10v9M10 10v9M14 10v9M18 10v9M3 19h18M4 10l8-6 8 6"/></svg>
        <span>Atelier</span>
      </button>

      {/* Sidebar mobile filters trigger */}
      <button
        type="button"
        onClick={onFilterToggle}
        className="flex flex-col items-center justify-center text-[10px] uppercase font-bold text-stone-500 hover:text-stone-900 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="currentColor"/><circle cx="15" cy="17" r="2" fill="currentColor"/></svg>
        <span>Filters</span>
      </button>

      {/* Cart trigger */}
      <button
        type="button"
        onClick={onCartToggle}
        className="flex flex-col items-center justify-center text-[10px] uppercase font-bold text-stone-500 hover:text-stone-900 transition-colors relative"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 8.5h14l-1 11H6l-1-11Z"/><path d="M8.5 9V7a3.5 3.5 0 0 1 7 0v2"/></svg>
        <span>Cart</span>
        {cartItemsCount > 0 && (
          <span className="absolute top-0 right-2.5 h-4.5 min-w-4.5 px-1 flex items-center justify-center rounded-full bg-amber-700 text-[8px] font-bold text-white shadow-sm ring-2 ring-white">
            {cartItemsCount}
          </span>
        )}
      </button>
    </nav>
  );
};
export default MobileNav;
