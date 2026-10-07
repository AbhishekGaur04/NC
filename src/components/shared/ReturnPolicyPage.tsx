import React from 'react';

interface ReturnPolicyPageProps {
  onGoHome: () => void;
}

export const ReturnPolicyPage: React.FC<ReturnPolicyPageProps> = ({ onGoHome }) => {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="border-b border-stone-200 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Nandini Collection · Customer care</p>
        <h1 className="mt-3 font-serif text-4xl text-stone-900 sm:text-5xl">Return & exchange policy</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          We want every Nandini Collection purchase to reach you in excellent condition. Please read the policy below before placing an order.
        </p>
      </div>

      <div className="space-y-10 py-10 text-sm leading-7 text-stone-650">
        <section>
          <h2 className="font-serif text-2xl text-stone-900">Returns</h2>
          <p className="mt-3">All products are final sale. We do not accept returns or provide refunds for change of mind, colour preference or incorrect selection.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">Size exchanges</h2>
          <p className="mt-3">A size exchange may be requested within 2 days of delivery, subject to availability. The item must be unused, unwashed, unaltered and returned with its original tags and packaging. Return and replacement shipping costs are covered by the customer.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">Damaged, defective or incorrect items</h2>
          <p className="mt-3">If your order arrives damaged, defective or incorrect, contact us within 2 days of delivery. Please provide your order details, a description of the issue and clear photos or an unpacking video. Once approved, Nandini Collection will arrange a replacement and cover the replacement shipping cost.</p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-stone-900">How to request an exchange or replacement</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Contact us within the applicable 2-day period.</li>
            <li>Share your order details and photos or video showing the item and issue.</li>
            <li>Wait for our confirmation before sending anything back.</li>
            <li>Pack the item securely with the original tags and packaging.</li>
          </ol>
        </section>

        <section className="border-t border-stone-200 pt-8">
          <h2 className="font-serif text-2xl text-stone-900">Contact us</h2>
          <p className="mt-3">For return, exchange or replacement requests, contact Nandini Collection:</p>
          <p className="mt-3 text-stone-800">
            <a className="text-amber-700 hover:text-amber-900" href="tel:+919057955597">+91 90579 55597</a>
            <span className="mx-2 text-stone-400">·</span>
            <a className="text-amber-700 hover:text-amber-900" href="mailto:chinishringi2706@gmail.com">chinishringi2706@gmail.com</a>
            <span className="mx-2 text-stone-400">·</span>
            <a className="text-amber-700 hover:text-amber-900" href="https://www.instagram.com/nandinicollection_designer" target="_blank" rel="noreferrer">Instagram</a>
          </p>
          <p className="mt-4 text-xs text-stone-500">Last updated: 6 October 2026</p>
        </section>
      </div>

      <button
        type="button"
        onClick={onGoHome}
        className="rounded-full bg-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-amber-800"
      >
        Back to the collection
      </button>
    </main>
  );
};

export default ReturnPolicyPage;
