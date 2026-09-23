import React from 'react';
import type { Product } from '../../types/product';

const WHATSAPP_NUMBER = '918824122515';

interface WhatsAppButtonProps {
  product?: Product | null;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ product }) => {
  const message = product
    ? `Hi Nandini Collection, I am interested in the ${product.name} listed at ₹${product.salePrice.toLocaleString('en-IN')}. Please share availability, sizes and ordering details.`
    : 'Hi Nandini Collection, I would like help choosing an outfit from the collection.';

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={product ? `Ask about ${product.name} on WhatsApp` : 'Chat with Nandini Collection on WhatsApp'}
      className="group fixed bottom-20 right-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-6 md:right-6"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" role="presentation">
          <path d="M20.5 3.5A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.15 1.6 5.96L.1 23.9l6.2-1.63a11.86 11.86 0 0 0 5.78 1.48h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.16-3.47-8.37ZM12.1 21.7h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.68.97.98-3.59-.23-.37a9.8 9.8 0 0 1-1.5-5.25C2.3 6.46 6.69 2.07 12.1 2.07c2.62 0 5.08 1.02 6.93 2.87a9.74 9.74 0 0 1 2.88 6.94c0 5.42-4.4 9.82-9.81 9.82Zm5.38-7.36c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.02-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.71.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </span>
      <span className="hidden text-[11px] font-bold uppercase tracking-[0.12em] sm:inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;
