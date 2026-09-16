import React, { useEffect } from 'react';

export type PolicySection = 'about' | 'shipping' | 'terms' | 'privacy';

interface PolicyModalProps {
  section: PolicySection | null;
  onClose: () => void;
}

const SECTION_CONTENT: Record<PolicySection, { eyebrow: string; title: string }> = {
  about: { eyebrow: 'Nandini Collection', title: 'About the atelier' },
  shipping: { eyebrow: 'Customer care', title: 'Shipping, returns & exchanges' },
  terms: { eyebrow: 'Customer care', title: 'Terms & conditions' },
  privacy: { eyebrow: 'Your information', title: 'Privacy policy' },
};

export const PolicyModal: React.FC<PolicyModalProps> = ({ section, onClose }) => {
  useEffect(() => {
    if (!section) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [section, onClose]);

  if (!section) return null;

  const content = SECTION_CONTENT[section];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/65 p-4 backdrop-blur-sm animate-fade-in"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-stone-50 shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-stone-200 bg-white px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">{content.eyebrow}</p>
            <h2 id="policy-modal-title" className="mt-1 font-serif text-2xl text-stone-900">{content.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close information"
            className="rounded-full border border-stone-200 px-3 py-1 text-lg leading-none text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            ×
          </button>
        </header>

        <div className="custom-scroll overflow-y-auto px-6 py-6 text-sm leading-7 text-stone-650 sm:px-8">
          {section === 'about' && (
            <div className="space-y-5">
              <p>At Nandini Collection, we celebrate everyday elegance through thoughtfully designed ethnic wear from Kota, Rajasthan.</p>
              <p>Our collection focuses on sarees, suit sets and occasionwear that balance comfort, expressive colour and hand-finished detail.</p>
              <div className="border-t border-stone-200 pt-5 text-xs text-stone-600">
                <p><strong className="text-stone-800">Atelier:</strong> Kota, Rajasthan, India</p>
                <p><strong className="text-stone-800">Hours:</strong> Monday–Saturday, 11:00–19:00</p>
                <p><strong className="text-stone-800">Email:</strong> <a className="text-amber-700 hover:text-amber-900" href="mailto:chinishringi2706@gmail.com">chinishringi2706@gmail.com</a></p>
                <p><strong className="text-stone-800">Phone:</strong> <a className="text-amber-700 hover:text-amber-900" href="tel:+919057955597">+91 90579 55597</a></p>
              </div>
            </div>
          )}

          {section === 'shipping' && (
            <div className="space-y-7">
              <div>
                <h3 className="font-serif text-xl text-stone-900">Shipping & delivery</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Orders are typically shipped within 2–3 business days.</li>
                  <li>Delivery usually takes 5–7 days after dispatch.</li>
                  <li>Delays caused by logistics partners or public holidays are outside our control.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl text-stone-900">Returns & exchanges</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>All products are final sale. We do not accept returns.</li>
                  <li>Size exchanges may be requested within 2 days of delivery; return and replacement shipping costs are covered by the customer.</li>
                  <li>Defective, damaged or incorrect items may be replaced when reported within 2 days of receipt.</li>
                  <li>Please provide proof of purchase, a description of the issue and clear photos. Replacement shipping for an approved defect or damage is covered by Nandini Collection.</li>
                </ul>
              </div>
              <div className="border-t border-stone-200 pt-5 text-xs text-stone-600">
                <p>To report an issue, call <a className="text-amber-700 hover:text-amber-900" href="tel:+919057955597">+91 90579 55597</a> or message <a className="text-amber-700 hover:text-amber-900" href="https://www.instagram.com/nandinicollection_designer" target="_blank" rel="noreferrer">@nandinicollection_designer</a>.</p>
              </div>
            </div>
          )}

          {section === 'terms' && (
            <div className="space-y-5">
              <p>By accessing this website or placing an order through Instagram, WhatsApp or another Nandini Collection channel, you agree to these terms.</p>
              <ol className="list-decimal space-y-3 pl-5">
                <li><strong className="text-stone-800">Product information:</strong> We work to keep images, descriptions and prices accurate. Minor colour variations may occur because of lighting, screen resolution or fabric dyeing.</li>
                <li><strong className="text-stone-800">Availability:</strong> Products are subject to availability. If an item becomes unavailable, we will inform you as soon as possible.</li>
                <li><strong className="text-stone-800">Orders and payment:</strong> Orders are confirmed only after successful payment. We may cancel an order for pricing errors, stock unavailability or suspicious activity.</li>
                <li><strong className="text-stone-800">Returns and exchanges:</strong> The conditions are described in our Shipping, Returns & Exchanges section.</li>
                <li><strong className="text-stone-800">Intellectual property:</strong> Images, designs, logos and text on this website belong to Nandini Collection and may not be copied or reproduced without written permission.</li>
              </ol>
              <p className="border-t border-stone-200 pt-5 text-xs text-stone-600">Questions: <a className="text-amber-700 hover:text-amber-900" href="mailto:chinishringi2706@gmail.com">chinishringi2706@gmail.com</a> · <a className="text-amber-700 hover:text-amber-900" href="tel:+919057955597">+91 90579 55597</a></p>
            </div>
          )}

          {section === 'privacy' && (
            <div className="space-y-5">
              <p>We value your trust and use your information only to operate and improve the Nandini Collection experience.</p>
              <ol className="list-decimal space-y-3 pl-5">
                <li><strong className="text-stone-800">Information collected:</strong> name, email, shipping address, phone number, payment details, browser/device information, pages visited and messages sent to us.</li>
                <li><strong className="text-stone-800">How we use it:</strong> to fulfil orders, send order and shipping updates, provide support, improve the website and send marketing only when you opt in.</li>
                <li><strong className="text-stone-800">Sharing:</strong> we do not sell or rent personal information. We may share necessary information with payment gateways and service providers that help operate the website.</li>
                <li><strong className="text-stone-800">Cookies:</strong> cookies help remember cart items and understand website traffic. You can disable cookies in your browser settings.</li>
                <li><strong className="text-stone-800">Your rights:</strong> you may request access, correction, marketing opt-out or deletion of your data, subject to legal and transactional requirements.</li>
              </ol>
              <p className="border-t border-stone-200 pt-5 text-xs text-stone-600">Privacy questions: <a className="text-amber-700 hover:text-amber-900" href="mailto:chinishringi2706@gmail.com">chinishringi2706@gmail.com</a>.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PolicyModal;
