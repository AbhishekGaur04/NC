// ─── Cart & Inventory Lock Types ──────────────────────────────────────────────

import type { Size, Product } from './product';

export interface CartItem {
  id: string;               // Unique cart line ID
  productId: number;
  product: Product;
  size: Size;
  quantity: number;
  lockId: string | null;    // Inventory reservation lock
  lockExpiresAt: number;    // Timestamp
  addedAt: number;
}

export interface InventoryLock {
  lockId: string;
  productId: number;
  size: Size;
  quantity: number;
  acquiredAt: number;
  expiresAt: number;
  userId: string;
  status: 'active' | 'expired' | 'committed';
}

export interface LockResult {
  success: boolean;
  lockId?: string;
  expiresAt?: number;
  reason?: 'out_of_stock' | 'already_locked' | 'max_quantity';
  availableQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  isCartOpen: boolean;
}

export type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';

export interface CheckoutState {
  step: CheckoutStep;
  isProcessing: boolean;
}
