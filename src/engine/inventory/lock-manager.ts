// ─── Inventory Lock Manager — Sliding-Window TTL ──────────────────────────────
//
// Implements optimistic UI inventory locking with:
//   - 10-minute TTL per lock
//   - Automatic sliding-window cleanup every 30s
//   - Atomic acquire/release/commit operations
//   - Integration with StockMatrix for real-time availability
//
// ──────────────────────────────────────────────────────────────────────────────

import type { Size } from '../../types/product';
import type { InventoryLock, LockResult } from '../../types/cart';
import { StockMatrix } from './stock-matrix';

const LOCK_TTL_MS = 10 * 60 * 1000;    // 10 minutes
const CLEANUP_INTERVAL_MS = 30 * 1000;  // 30 seconds
const MAX_QUANTITY_PER_LOCK = 5;

let lockCounter = 0;

function generateLockId(): string {
  return `lock_${Date.now()}_${++lockCounter}`;
}

export class LockManager {
  private locks: Map<string, InventoryLock> = new Map();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(event: LockEvent) => void> = new Set();
  private stockMatrix: StockMatrix;

  constructor(stockMatrix: StockMatrix) {
    this.stockMatrix = stockMatrix;
    this.startCleanup();
  }

  /** Acquire an inventory lock — returns success or failure with reason */
  acquireLock(
    productId: number,
    size: Size,
    quantity: number,
    userId: string
  ): LockResult {
    // Validate quantity
    if (quantity > MAX_QUANTITY_PER_LOCK) {
      return { success: false, reason: 'max_quantity', availableQuantity: MAX_QUANTITY_PER_LOCK };
    }

    // Check available stock (accounting for existing active locks)
    const available = this.getAvailableQuantity(productId, size);
    if (available < quantity) {
      return { success: false, reason: 'out_of_stock', availableQuantity: available };
    }

    // Decrement stock in matrix
    const decremented = this.stockMatrix.decrementStock(productId, size, quantity);
    if (!decremented) {
      return { success: false, reason: 'out_of_stock', availableQuantity: 0 };
    }

    // Create lock
    const now = Date.now();
    const lock: InventoryLock = {
      lockId: generateLockId(),
      productId,
      size,
      quantity,
      acquiredAt: now,
      expiresAt: now + LOCK_TTL_MS,
      userId,
      status: 'active',
    };

    this.locks.set(lock.lockId, lock);
    this.emit({ type: 'acquired', lock });

    return {
      success: true,
      lockId: lock.lockId,
      expiresAt: lock.expiresAt,
    };
  }

  /** Release a lock (user removes from cart) */
  releaseLock(lockId: string): void {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'active') return;

    // Return stock
    this.stockMatrix.incrementStock(lock.productId, lock.size, lock.quantity);
    lock.status = 'expired';
    this.locks.delete(lockId);
    this.emit({ type: 'released', lock });
  }

  /** Commit a lock (purchase completed) */
  commitLock(lockId: string): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'active') return false;

    // Check if lock hasn't expired
    if (Date.now() > lock.expiresAt) {
      this.expireLock(lock);
      return false;
    }

    lock.status = 'committed';
    this.locks.delete(lockId);
    this.emit({ type: 'committed', lock });
    return true;
  }

  /** Get the remaining time on a lock in seconds */
  getLockTimeRemaining(lockId: string): number {
    const lock = this.locks.get(lockId);
    if (!lock || lock.status !== 'active') return 0;
    return Math.max(0, Math.floor((lock.expiresAt - Date.now()) / 1000));
  }

  /** Get available quantity accounting for active locks */
  getAvailableQuantity(productId: number, size: Size): number {
    return this.stockMatrix.getQuantity(productId, size);
  }

  /** Subscribe to lock events */
  onLockEvent(listener: (event: LockEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Destroy — clean up timers */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // ─── Private ──────────────────────────────────────────

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredLocks();
    }, CLEANUP_INTERVAL_MS);
  }

  private cleanupExpiredLocks(): void {
    const now = Date.now();
    for (const [, lock] of this.locks) {
      if (lock.status === 'active' && now > lock.expiresAt) {
        this.expireLock(lock);
      }
    }
  }

  private expireLock(lock: InventoryLock): void {
    // Return stock to matrix
    this.stockMatrix.incrementStock(lock.productId, lock.size, lock.quantity);
    lock.status = 'expired';
    this.locks.delete(lock.lockId);
    this.emit({ type: 'expired', lock });
  }

  private emit(event: LockEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export interface LockEvent {
  type: 'acquired' | 'released' | 'expired' | 'committed';
  lock: InventoryLock;
}
