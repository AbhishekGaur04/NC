// ─── Hero Brand Banner Component ──────────────────────────────────────────────
import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200/80 bg-[#f3eee7] px-4 py-14 sm:px-6 md:py-20">
      <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full border border-amber-700/10" />
      <div className="absolute -right-16 -top-24 h-[26rem] w-[26rem] rounded-full border border-amber-700/10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-xl space-y-5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 border-b border-amber-700/30 pb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-800">
            The festive edit · 2026
          </div>

          <h1 className="font-serif text-4xl font-medium leading-[1.08] text-stone-950 sm:text-5xl md:text-6xl">
            Pieces with a <br />
            <span className="italic text-amber-800">sense of occasion.</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-550 leading-relaxed max-w-md mx-auto md:mx-0">
            Thoughtful Indian occasionwear with easy silhouettes, expressive colour, and the hand-finished details that make an outfit feel like yours.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-700">✦</span> Made for celebrations
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-700">✦</span> Small-batch craft
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-700">✦</span> Ships from Kota
            </div>
          </div>
        </div>

        {/* Visual Showcase collage */}
        <div className="flex w-full max-w-md select-none justify-center gap-3 sm:gap-4">
          <div className="h-48 w-32 rotate-[-5deg] overflow-hidden rounded-sm bg-stone-200 shadow-lg transition-transform duration-500 hover:rotate-0 sm:h-56 sm:w-36">
            <img src="/images/products/kota-doria-embroidered-suit-set-rose-pink-1-768w.jpg" alt="Rose pink embroidered suit set" width="288" height="448" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="z-10 h-56 w-36 translate-y-3 scale-105 overflow-hidden rounded-sm border border-white bg-stone-200 shadow-xl sm:h-64 sm:w-40">
            <img src="/images/products/nazakat-pure-chiffon-saree-with-exquisite-gota-patti-1-768w.jpg" alt="Nazakat chiffon saree with gota patti" width="320" height="512" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="h-48 w-32 rotate-[5deg] overflow-hidden rounded-sm bg-stone-200 shadow-lg transition-transform duration-500 hover:rotate-0 sm:h-56 sm:w-36">
            <img src="/images/products/gota-pure-chiffon-saree-with-gotapatti-handwork-1-768w.jpg" alt="Gota patti chiffon saree" width="288" height="448" loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroBanner;
