// ─── Zustand Cart & Inventory Lock Store ──────────────────────────────────────
import { create } from 'zustand';
import type { CartItem, CartState } from '../../types/cart';
import type { Product, Size } from '../../types/product';
import { StockMatrix } from '../../engine/inventory/stock-matrix';
import { LockManager } from '../../engine/inventory/lock-manager';
import { seedStockMatrix } from '../../data/inventory';

// Instantiate Core Engines as singletons
export const stockMatrix = new StockMatrix(seedStockMatrix());
export const lockManager = new LockManager(stockMatrix);

interface CartStoreState extends CartState {
  addToCart: (product: Product, size: Size, quantity: number) => { success: boolean; error?: string };
  removeFromCart: (cartItemId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  checkout: () => Promise<boolean>;
  tickLocks: () => void;
  toastMessage: string | null;
  clearToast: () => void;
}

// Calculate totals from items list
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.product.price - item.product.salePrice) * item.quantity,
    0
  );
  return { totalItems, totalPrice, totalDiscount };
};

export const useCartStore = create<CartStoreState>((set, get) => {
  // Listen to LockManager events to keep CartState in sync
  lockManager.onLockEvent((event) => {
    if (event.type === 'expired') {
      // Find cart item linked to this lock and mark it as expired or remove it
      set((state) => {
        const itemIndex = state.items.findIndex((item) => item.lockId === event.lock.lockId);
        if (itemIndex === -1) return {};

        const updatedItems = [...state.items];
        const expiredItem = updatedItems[itemIndex];

        // Notify user about lock expiry via toast
        const toastMessage = `Reservation for "${expiredItem.product.name}" (Size ${expiredItem.size}) has expired. Item released back to inventory.`;

        // Filter out the item (or we can mark it out of stock, filtering is cleaner)
        const newItems = updatedItems.filter((_, i) => i !== itemIndex);

        return {
          items: newItems,
          ...calculateTotals(newItems),
          toastMessage,
        };
      });
    }
  });

  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    totalDiscount: 0,
    isCartOpen: false,
    toastMessage: null,

    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    clearToast: () => set({ toastMessage: null }),

    addToCart: (product: Product, size: Size, quantity: number) => {
      // Try to acquire reservation lock from LockManager
      const userId = 'anonymous_user';
      const lockResult = lockManager.acquireLock(product.id, size, quantity, userId);

      if (!lockResult.success) {
        let error = 'Unable to reserve item.';
        if (lockResult.reason === 'out_of_stock') {
          error = `Out of stock in Size ${size}. Only ${lockResult.availableQuantity || 0} left.`;
        } else if (lockResult.reason === 'max_quantity') {
          error = `Cannot purchase more than ${lockResult.availableQuantity || 5} units at once.`;
        }
        return { success: false, error };
      }

      set((state) => {
        // Check if matching product and size already in cart
        const existingIndex = state.items.findIndex(
          (item) => item.productId === product.id && item.size === size
        );

        let updatedItems = [...state.items];

        if (existingIndex !== -1) {
          // Since we acquire a separate lock for additional quantities,
          // for simplicity we release the old lock and acquire a new consolidated one,
          // or we just stack them. To be simple, we just create a new cart entry.
          // In premium catalog, same items of different lock expiry are kept separate or consolidated.
          // Let's create a new separate line or merge. Let's create a separate cart line so user sees separate timers.
        }

        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          product,
          size,
          quantity,
          lockId: lockResult.lockId || null,
          lockExpiresAt: lockResult.expiresAt || 0,
          addedAt: Date.now(),
        };

        updatedItems = [newItem, ...updatedItems];

        return {
          items: updatedItems,
          ...calculateTotals(updatedItems),
          isCartOpen: true, // Auto open cart on add
        };
      });

      return { success: true };
    },

    removeFromCart: (cartItemId: string) => {
      set((state) => {
        const item = state.items.find((i) => i.id === cartItemId);
        if (item?.lockId) {
          lockManager.releaseLock(item.lockId);
        }

        const newItems = state.items.filter((i) => i.id !== cartItemId);
        return {
          items: newItems,
          ...calculateTotals(newItems),
        };
      });
    },

    checkout: async () => {
      const state = get();
      if (state.items.length === 0) return false;

      // Commit locks for all items in cart
      let allCommitted = true;
      for (const item of state.items) {
        if (item.lockId) {
          const success = lockManager.commitLock(item.lockId);
          if (!success) allCommitted = false;
        }
      }

      if (allCommitted) {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
          totalDiscount: 0,
          toastMessage: 'Checkout Successful! Your order has been placed and inventory locked.',
        });
        return true;
      } else {
        set({
          toastMessage: 'Checkout failed for some items because reservations expired. Check your cart.',
        });
        return false;
      }
    },

    tickLocks: () => {
      // Force trigger state update to update lock timers in UI
      set((state) => {
        // If items are expired (lock time remaining <= 0), they are cleaned up by LockManager event,
        // but we trigger a simple shallow state update to force re-render components displaying timers
        return { items: [...state.items] };
      });
    },
  };
});

// Setup periodic ticking for countdown timers
if (typeof window !== 'undefined') {
  setInterval(() => {
    useCartStore.getState().tickLocks();
  }, 1000);
}
