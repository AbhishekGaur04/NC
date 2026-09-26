// ─── Cart Drawer Component with Live Countdown Timers ────────────────────────
import React from 'react';
import { useCartStore, lockManager } from '../../app/providers/cart-store';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, totalPrice, totalDiscount, isCartOpen, closeCart, removeFromCart } = useCartStore();

  if (!isCartOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimerInfo = (lockId: string | null) => {
    if (!lockId) return null;
    const remainingSeconds = lockManager.getLockTimeRemaining(lockId);

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
      seconds: remainingSeconds,
      timeStr,
      isLow: remainingSeconds <= 60, // Last minute alert
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-baseline gap-2">
            <h3 id="cart-title" className="text-lg font-serif text-stone-900">Your Atelier Cart</h3>
            <span className="text-xs text-stone-400 font-medium">({items.length} items)</span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="text-stone-400 hover:text-stone-900 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scroll">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <span className="text-4xl text-stone-300">👜</span>
              <h4 className="font-serif text-stone-750 font-medium">Atelier Cart is Empty</h4>
              <p className="text-xs text-stone-400 max-w-xs">
                Explore our premium collection of Sarees, Gowns, and Kurtas to fill your styling selections.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const timer = getTimerInfo(item.lockId);

              return (
                <div
                  key={item.id}
                  className="flex gap-4 border border-stone-100 p-3 rounded-lg bg-stone-50/50 hover:bg-stone-50 transition-colors relative"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-15 flex-shrink-0 bg-stone-100 rounded overflow-hidden aspect-[3/4]">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-800 line-clamp-1 pr-4">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Size: <span className="font-bold text-stone-700">{item.size}</span> • Fabric:{' '}
                        <span className="capitalize">{item.product.fabric}</span>
                      </p>
                    </div>

                    {/* Timer banner */}
                    {timer && (
                      <div
                        className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider mt-1.5 ${
                          timer.isLow ? 'text-rose-600 animate-pulse' : 'text-amber-700'
                        }`}
                      >
                        <span className="text-xs">⏱</span>
                        <span>Reserved: {timer.timeStr}</span>
                      </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {formatPrice(item.product.salePrice * item.quantity)}
                        </span>
                        {item.product.discount > 0 && (
                          <span className="text-[9px] text-stone-400 line-through">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 text-stone-400 hover:text-stone-900 text-xs font-bold p-1"
                    title="Remove from Cart"
                  >
                    &times;
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Block */}
        {items.length > 0 && (
          <div className="border-t border-stone-100 p-6 space-y-4 bg-white">
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Product Discounts</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 font-bold uppercase">Free</span>
              </div>
              <div className="flex justify-between text-stone-950 font-bold text-sm border-t border-stone-100 pt-3 mt-1">
                <span>Total Payable</span>
                <span>{formatPrice(totalPrice - totalDiscount)}</span>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-md p-3 text-[10px] text-stone-500 leading-relaxed">
              ⚠️ <span className="font-semibold text-stone-800">Flash Sale Inventory Lock:</span> Cart items are held for exactly 10 minutes. If checkout is not completed before expiry, items will release automatically for other customers.
            </div>

            <button
              type="button"
              onClick={() => {
                closeCart();
                onCheckout();
              }}
              className="w-full py-3 bg-stone-900 hover:bg-stone-850 text-white rounded-md text-sm font-semibold uppercase tracking-wider transition-colors shadow-md hover:shadow-lg"
            >
              Secure Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartDrawer;
