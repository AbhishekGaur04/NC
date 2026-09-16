// ─── Initial Inventory Stock Matrix Seeding ──────────────────────────────────
import { products } from './products';
import type { StockEntry } from '../engine/inventory/stock-matrix';
import { SIZE_BITS } from '../engine/inventory/stock-matrix';

export const seedStockMatrix = (): StockEntry[] => {
  return products.map(product => {
    let sizeMask = 0;
    let inStockMask = 0;
    const quantities: Record<string, number> = {};

    product.sizes.forEach(s => {
      const bit = SIZE_BITS[s.size];
      if (bit !== undefined) {
        sizeMask |= bit;
        if (s.inStock && s.quantity > 0) {
          inStockMask |= bit;
          quantities[s.size] = s.quantity;
        } else {
          quantities[s.size] = 0;
        }
      }
    });

    return {
      productId: product.id,
      sizeMask,
      inStockMask,
      quantities,
    };
  });
};
