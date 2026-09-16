// ─── Stock Matrix: Size × SKU Availability Bitmask ────────────────────────────
//
// Each product has a 7-bit size availability bitmask:
//   bit 0 = XS, bit 1 = S, bit 2 = M, bit 3 = L,
//   bit 4 = XL, bit 5 = XXL, bit 6 = Custom/Unstitched
//
// The StockMatrix provides O(1) lookups for size availability
// without network calls.
// ──────────────────────────────────────────────────────────────────────────────

import type { Size, SizeStock } from '../../types/product';

export const SIZE_BITS: Record<Size, number> = {
  XS:     1 << 0,
  S:      1 << 1,
  M:      1 << 2,
  L:      1 << 3,
  XL:     1 << 4,
  XXL:    1 << 5,
  Custom: 1 << 6,
};

export const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

export interface StockEntry {
  productId: number;
  sizeMask: number;       // Which sizes exist for this product
  inStockMask: number;    // Which sizes are currently in stock
  quantities: Partial<Record<Size, number>>;
}

export class StockMatrix {
  private entries: Map<number, StockEntry> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor(initialData: StockEntry[]) {
    for (const entry of initialData) {
      this.entries.set(entry.productId, { ...entry });
    }
  }

  /** Check if a specific size is in stock for a product */
  isSizeInStock(productId: number, size: Size): boolean {
    const entry = this.entries.get(productId);
    if (!entry) return false;
    return (entry.inStockMask & SIZE_BITS[size]) !== 0;
  }

  /** Check if a specific size exists for a product (even if out of stock) */
  sizeExists(productId: number, size: Size): boolean {
    const entry = this.entries.get(productId);
    if (!entry) return false;
    return (entry.sizeMask & SIZE_BITS[size]) !== 0;
  }

  /** Get quantity for a specific product+size */
  getQuantity(productId: number, size: Size): number {
    const entry = this.entries.get(productId);
    if (!entry) return 0;
    return entry.quantities[size] || 0;
  }

  /** Get stock status string for UI badges */
  getStockStatus(productId: number, size: Size): 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable' {
    if (!this.sizeExists(productId, size)) return 'unavailable';
    if (!this.isSizeInStock(productId, size)) return 'out_of_stock';
    const qty = this.getQuantity(productId, size);
    if (qty <= 3) return 'low_stock';
    return 'in_stock';
  }

  /** Get full size availability for a product (for SizeSelector) */
  getSizeAvailability(productId: number): SizeStock[] {
    const entry = this.entries.get(productId);
    if (!entry) return [];

    return ALL_SIZES
      .filter(size => (entry.sizeMask & SIZE_BITS[size]) !== 0)
      .map(size => ({
        size,
        inStock: (entry.inStockMask & SIZE_BITS[size]) !== 0,
        quantity: entry.quantities[size] || 0,
      }));
  }

  /** Decrement stock (used by LockManager) */
  decrementStock(productId: number, size: Size, qty: number = 1): boolean {
    const entry = this.entries.get(productId);
    if (!entry) return false;

    const current = entry.quantities[size] || 0;
    if (current < qty) return false;

    entry.quantities[size] = current - qty;

    // Update inStockMask if quantity reaches 0
    if (entry.quantities[size] === 0) {
      entry.inStockMask &= ~SIZE_BITS[size];
    }

    this.notifyListeners();
    return true;
  }

  /** Increment stock (used when lock expires) */
  incrementStock(productId: number, size: Size, qty: number = 1): void {
    const entry = this.entries.get(productId);
    if (!entry) return;

    const current = entry.quantities[size] || 0;
    entry.quantities[size] = current + qty;
    entry.inStockMask |= SIZE_BITS[size];

    this.notifyListeners();
  }

  /** Subscribe to stock changes */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
