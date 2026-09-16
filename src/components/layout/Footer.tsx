// ─── Footer Layout Component ──────────────────────────────────────────────────
import React from 'react';
import type { PolicySection } from '../shared/PolicyModal';

interface FooterProps {
  onOpenPolicy: (section: PolicySection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  return (
    <footer className="mt-20 border-t border-stone-800 bg-stone-950 px-4 py-14 text-stone-400 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg font-bold tracking-widest text-white uppercase">
              Nandini
            </span>
            <span className="font-sans text-[8px] tracking-[0.25em] font-bold text-amber-500 uppercase mt-0.5">
              Collection
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Occasionwear with a point of view — designed in Kota and finished with the details that make getting dressed feel special.
          </p>
        </div>

        {/* Collections Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">
            Collections
          </h4>
          <ul className="text-xs space-y-2">
            <li><a href="#collection" className="hover:text-amber-400 transition-colors">Sarees</a></li>
            <li><a href="#collection" className="hover:text-amber-400 transition-colors">Suit sets</a></li>
            <li><a href="#hoop-art-heading" className="hover:text-amber-400 transition-colors">Hoop Art</a></li>
            <li><a href="#collection" className="hover:text-amber-400 transition-colors">Festive edit</a></li>
          </ul>
        </div>

        {/* Service Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">
            Customer Atelier
          </h4>
          <ul className="text-xs space-y-2">
            <li><button type="button" onClick={() => onOpenPolicy('about')} className="hover:text-amber-400 transition-colors">About the atelier</button></li>
            <li><button type="button" onClick={() => onOpenPolicy('shipping')} className="hover:text-amber-400 transition-colors">Shipping & exchanges</button></li>
            <li><a href="https://www.instagram.com/nandinicollection_designer" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Instagram atelier</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider">
            Flagship Store
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Kota, Rajasthan, India<br />
            Monday – Saturday, 11:00 – 19:00
          </p>
          <p className="text-xs text-stone-500 font-semibold mt-1">
            <a href="mailto:chinishringi2706@gmail.com" className="hover:text-amber-400">chinishringi2706@gmail.com</a><br />
            <a href="tel:+919057955597" className="hover:text-amber-400">+91 90579 55597</a>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-600">
        <p>© 2026 Nandini Collection. All rights reserved.</p>
        <div className="flex gap-4">
          <button type="button" onClick={() => onOpenPolicy('terms')} className="hover:text-stone-400">Terms of Use</button>
          <button type="button" onClick={() => onOpenPolicy('privacy')} className="hover:text-stone-400">Privacy Policy</button>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
