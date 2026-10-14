import React, { useState } from 'react';
import { useCartStore } from '../../app/providers/cart-store';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPolicies?: () => void;
}

const initialAddress = {
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
};

const ADDRESS_LIMITS = {
  name: 80,
  phone: 15,
  street: 160,
  city: 80,
  state: 80,
  pincode: 6,
} as const;

const validateAddress = (address: typeof initialAddress): string | null => {
  if (!address.name || !/^[\p{L} .'-]{2,80}$/u.test(address.name)) {
    return 'Enter a valid contact name (2–80 characters).';
  }
  if (!/^\+?[0-9 ()-]{7,15}$/.test(address.phone)) {
    return 'Enter a valid phone number.';
  }
  if (!/^\d{6}$/.test(address.pincode)) {
    return 'Enter a valid 6-digit pincode.';
  }
  if (!address.street || address.street.length > ADDRESS_LIMITS.street) {
    return `Enter a street address up to ${ADDRESS_LIMITS.street} characters.`;
  }
  if (!address.city || address.city.length > ADDRESS_LIMITS.city || !address.state || address.state.length > ADDRESS_LIMITS.state) {
    return 'Enter valid city and state names.';
  }
  return null;
};

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, onOpenPolicies }) => {
  const { items, totalPrice, totalDiscount, openCart } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Delivery, 2: WhatsApp request, 3: Request ready
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderRequestError, setOrderRequestError] = useState<string | null>(null);
  const [address, setAddress] = useState(initialAddress);
  const [requestId] = useState(
    () => `NC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
  );

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
      const normalizedAddress = Object.fromEntries(
        Object.entries(address).map(([key, value]) => [key, value.trim()]),
      ) as typeof address;
      setAddress(normalizedAddress);
      const validationError = validateAddress(normalizedAddress);
      if (validationError) {
        setAddressError(validationError);
        return;
      }
      setAddressError(null);
      setStep(2);
    }
  };

  const buildWhatsAppInvoice = () => {
    const imageBaseUrl = window.location.origin;
    const lines = items.flatMap((item) => [
      `${item.product.name}`,
      `SKU: ${item.product.sku || `NC-${item.product.id}`} | Size: ${item.size} | Qty: ${item.quantity}`,
      `Unit price: ${formatPrice(item.product.salePrice)} | Line total: ${formatPrice(item.product.salePrice * item.quantity)}`,
      `Product images: ${item.product.images.map((image) => `${imageBaseUrl}${image.url}`).join(' | ')}`,
      '',
    ]);

    return [
      'NANDINI COLLECTION — ORDER REQUEST',
      `Request reference: ${requestId}`,
      '',
      'CUSTOMER & DELIVERY DETAILS',
      `Name: ${address.name}`,
      `Phone: ${address.phone}`,
      `Address: ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      '',
      'ORDER ITEMS',
      ...lines,
      'REQUEST ESTIMATE',
      `Gross price: ${formatPrice(totalPrice)}`,
      `Discount: -${formatPrice(totalDiscount)}`,
      `Estimated total: ${formatPrice(totalPrice - totalDiscount)}`,
      'Payment mode: To be confirmed with the store',
      '',
      'Please confirm item availability, final delivery details and payment instructions. This is an order request, not a completed order. Product image links are included above for each item.',
    ].join('\n');
  };

  const handleWhatsAppRequest = () => {
    setIsProcessing(true);
    setOrderRequestError(null);
    try {
      const invoice = buildWhatsAppInvoice();
      const whatsappUrl = `https://wa.me/918824122515?text=${encodeURIComponent(invoice)}`;
      const whatsappWindow = window.open(whatsappUrl, '_blank');

      if (!whatsappWindow) {
        setOrderRequestError('WhatsApp could not be opened. Allow pop-ups for this site and try again.');
        return;
      }
      whatsappWindow.opener = null;

      // A WhatsApp draft is not an order confirmation. Keep the cart and its
      // local reservation until the store confirms availability and payment.
      setStep(3);
    } catch {
      setOrderRequestError('We could not open WhatsApp. Please try again or contact the store directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="modal-viewport-height w-full max-w-2xl bg-white border border-stone-100 rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-up" role="dialog" aria-modal="true" aria-label="Checkout dialog">
        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
          {step < 3 && (
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-100">
              <h3 id="checkout-title" className="text-xl font-serif text-stone-900">Order Request</h3>
              <div className="flex gap-2 text-xs font-semibold text-stone-400">
                <span className={step === 1 ? 'text-amber-700' : 'text-emerald-600'}>
                  1. Delivery
                </span>
                <span>/</span>
                <span className={step === 2 ? 'text-amber-700' : ''}>2. WhatsApp</span>
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
                    maxLength={ADDRESS_LIMITS.name}
                    autoComplete="name"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value.slice(0, ADDRESS_LIMITS.name) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:border-stone-900 focus:outline-none text-sm text-stone-850"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={ADDRESS_LIMITS.phone}
                      autoComplete="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value.slice(0, ADDRESS_LIMITS.phone) })}
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
                      inputMode="numeric"
                      maxLength={ADDRESS_LIMITS.pincode}
                      autoComplete="postal-code"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, ADDRESS_LIMITS.pincode) })}
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
                    maxLength={ADDRESS_LIMITS.street}
                    autoComplete="street-address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value.slice(0, ADDRESS_LIMITS.street) })}
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
                      maxLength={ADDRESS_LIMITS.city}
                      autoComplete="address-level2"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value.slice(0, ADDRESS_LIMITS.city) })}
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
                      maxLength={ADDRESS_LIMITS.state}
                      autoComplete="address-level1"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value.slice(0, ADDRESS_LIMITS.state) })}
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

              {addressError && (
                <p role="alert" className="rounded-md border border-rose-100 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {addressError}
                </p>
              )}

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
                  Continue to WhatsApp
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            /* STEP 2: WHATSAPP ORDER CONFIRMATION */
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-2">
                Confirm Order on WhatsApp
              </h4>

              <div className="space-y-3.5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 text-xs text-emerald-800 flex items-start gap-2">
                  <span>💬</span>
                  <span>WhatsApp will open with your order request prefilled. Review it and tap Send in WhatsApp. The store will confirm availability, delivery and payment with you.</span>
                </div>
              </div>

              {orderRequestError && (
                <p role="alert" className="rounded-md border border-rose-100 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                  {orderRequestError}
                </p>
              )}

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
                  onClick={handleWhatsAppRequest}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all shadow flex items-center gap-2 disabled:bg-stone-500"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Sending Bill...</span>
                  </>
                ) : (
                    <span>Send Bill on WhatsApp</span>
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
                <h3 className="text-2xl font-serif text-stone-900">Your WhatsApp Request Is Ready</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Review the prefilled message in WhatsApp and tap Send to contact us. Your order is not confirmed until we verify availability and arrange payment with you.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-100 rounded-md p-4 max-w-md mx-auto text-left space-y-2.5">
                <div className="flex justify-between text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Request reference:</span>
                  <span>{requestId}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600 border-t border-stone-200/60 pt-2.5">
                  <span className="font-semibold text-stone-800">Delivery address:</span>
                  <span className="text-right">
                    {address.name} <br /> {address.street}, {address.city} - {address.pincode}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOrderRequestError(null);
                  onClose();
                  openCart();
                }}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-850 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shadow"
              >
                Review Cart
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
