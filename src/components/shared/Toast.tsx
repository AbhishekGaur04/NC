// ─── Toast Alert notification Component ─────────────────────────────────────────
import React, { useEffect } from 'react';
import { useCartStore } from '../../app/providers/cart-store';

export const Toast: React.FC = () => {
  const toastMessage = useCartStore((state) => state.toastMessage);
  const clearToast = useCartStore((state) => state.clearToast);

  useEffect(() => {
    if (!toastMessage) return;

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      clearToast();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-stone-900 border border-stone-850 text-white rounded-lg shadow-2xl p-4 flex gap-3.5 items-start animate-slide-up">
      {/* Icon status */}
      <span className="text-lg leading-none mt-0.5">ℹ️</span>

      {/* Message and actions */}
      <div className="flex-1 space-y-1">
        <p className="text-xs font-semibold leading-normal">{toastMessage}</p>
        <button
          type="button"
          onClick={clearToast}
          className="text-[10px] uppercase tracking-wider font-bold text-amber-500 hover:text-amber-450 mt-1 transition-colors"
        >
          Dismiss
        </button>
      </div>

      {/* Manual close */}
      <button
        type="button"
        onClick={clearToast}
        className="text-stone-400 hover:text-white text-lg leading-none font-bold"
      >
        &times;
      </button>
    </div>
  );
};
export default Toast;
