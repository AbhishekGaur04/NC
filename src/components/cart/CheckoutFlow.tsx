import React, { useState } from 'react';
import { useCartStore } from '../../app/providers/cart-store';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPolicies?: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, onOpenPolicies }) => {
  const { items, totalPrice, totalDiscount, checkout } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Delivery, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    name: 'Nandini Sen',
    phone: '+91 98765 43210',
    street: '12, Primrose Gardens, Park Street Area',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
  });

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(async () => {
      const success = await checkout();
      setIsProcessing(false);
      if (success) {
        setStep(3);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-stone-100 rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-up max-h-[90vh]">
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
          {step < 3 && (
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
              <h3 className="text-xl font-serif text-stone-900">Secure Checkout</h3>
              <div className="flex gap-2 text-xs font-semibold text-stone-400">
                <span className={step === 1 ? 'text-amber-700' : 'text-emerald-600'}>
                  1. Delivery
                </span>
                <span>/</span>
                <span className={step === 2 ? 'text-amber-700' : ''}>2. Payment</span>
              </div>
            </div>
          )}

          {step === 1 && (
            /* STEP 1: DELIVERY ADDRESS */
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
                Shipping Address
              </h4>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                    />
                  </div>
                </div>
              </div>

              <p className="border-t border-stone-100 pt-4 text-[11px] leading-relaxed text-stone-500">
                By continuing, you confirm that you have reviewed our final-sale, shipping and exchange terms.{' '}
                <button type="button" onClick={onOpenPolicies} className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900">
                  View shipping & exchanges
                </button>
              </p>

              <div className="flex gap-3 justify-end pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-stone-200 text-stone-600 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            /* STEP 2: PAYMENT CARD DETAILS */
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
                Card Payment Details
              </h4>

              <div className="space-y-3.5">
                <div className="bg-amber-50/50 border border-amber-100 rounded-md p-3 text-xs text-amber-800 flex items-center gap-2">
                  <span>🔒</span>
                  <span>Payment is encrypted and processed via bank secure gateway.</span>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="Nandini Sen"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-855"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="••••  ••••  ••••  4321"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm tracking-widest text-stone-855"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-855"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength={3}
                      className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-855"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="px-5 py-2 border border-stone-200 text-stone-600 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow flex items-center gap-2 disabled:bg-stone-500"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Locking Order...</span>
                    </>
                  ) : (
                    <span>Pay {formatPrice(totalPrice - totalDiscount)}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            /* STEP 3: SUCCESS CONFIRMATION */
            <div className="text-center py-10 space-y-5 animate-scale-up">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-3xl shadow">
                ✓
              </div>
              <div>
                <h3 className="text-2xl font-serif text-stone-900">Order Placed Successfully</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Your purchase is complete, and the matching garments have been locked to your name in our warehouse inventory.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-100 rounded-md p-4 max-w-md mx-auto text-left space-y-2.5">
                <div className="flex justify-between text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Order ID:</span>
                  <span>NC-2026-890251</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Shipment Delivery:</span>
                  <span>Expected in 3-5 Business Days</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600 border-t border-stone-200/60 pt-2.5">
                  <span className="font-semibold text-stone-800">Shipped To:</span>
                  <span className="text-right">
                    {address.name} <br /> {address.street}, {address.city} - {address.pincode}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  onClose();
                }}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-850 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow"
              >
                Continue Styling
              </button>
            </div>
          )}
        </div>

        {/* Side Invoice Summary Panels (Steps 1 & 2) */}
        {step < 3 && (
          <div className="w-full md:w-64 bg-stone-50 border-t md:border-t-0 md:border-l border-stone-100 p-6 flex flex-col justify-between max-h-72 md:max-h-none overflow-y-auto">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Garments Ordered
              </h4>

              <div className="space-y-3.5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="h-12 w-9 object-cover rounded bg-stone-100 aspect-[3/4]"
                    />
                    <div className="flex-1 text-[11px] leading-tight">
                      <p className="font-semibold text-stone-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-stone-400 mt-0.5">Size: {item.size} • Qty: {item.quantity}</p>
                      <p className="font-bold text-stone-900 mt-1">
                        {formatPrice(item.product.salePrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200/60 pt-4 mt-6 space-y-2 text-[11px] text-stone-600">
              <div className="flex justify-between">
                <span>Gross Price</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Discounts</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200/60 pt-2 text-xs">
                <span>Net Payable</span>
                <span>{formatPrice(totalPrice - totalDiscount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CheckoutFlow;
