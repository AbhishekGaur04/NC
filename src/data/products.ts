// ─── NandiniCollection Product Catalog — 120 Premium Fashion Items ─────────────
// Kurtas (40) + Gowns (40) + Sarees (40) with rich attribute variance

import type { Product, ProductType, Fabric, Work, Occasion, Color, PriceRange, DiscountRange, SizeStock } from '../types/product';
import catalogData from './catalog.json';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priceToRange(price: number): PriceRange {
  if (price < 2000) return 'under2k';
  if (price < 5000) return '2k-5k';
  if (price < 10000) return '5k-10k';
  if (price < 25000) return '10k-25k';
  if (price < 50000) return '25k-50k';
  return 'above50k';
}

function discountToRange(discount: number): DiscountRange {
  if (discount >= 50) return '50plus';
  if (discount >= 30) return '30plus';
  if (discount >= 20) return '20plus';
  if (discount >= 10) return '10plus';
  return 'none';
}

function genSizes(type: ProductType): SizeStock[] {
  if (type === 'saree' || type === 'hoop-art') {
    return [
      { size: 'Custom', inStock: true, quantity: Math.floor(Math.random() * 15) + 3 },
    ];
  }
  const sizes: SizeStock[] = [
    { size: 'XS', inStock: Math.random() > 0.3, quantity: Math.floor(Math.random() * 8) },
    { size: 'S', inStock: Math.random() > 0.15, quantity: Math.floor(Math.random() * 12) + 1 },
    { size: 'M', inStock: Math.random() > 0.1, quantity: Math.floor(Math.random() * 15) + 2 },
    { size: 'L', inStock: Math.random() > 0.1, quantity: Math.floor(Math.random() * 15) + 2 },
    { size: 'XL', inStock: Math.random() > 0.2, quantity: Math.floor(Math.random() * 10) + 1 },
    { size: 'XXL', inStock: Math.random() > 0.4, quantity: Math.floor(Math.random() * 6) },
  ];
  sizes.forEach(s => { if (!s.inStock) s.quantity = 0; if (s.quantity <= 0 && s.inStock) s.quantity = 1; });
  return sizes;
}

// Blurhash placeholders (pre-computed representative hashes)
const BLURHASHES = [
  'L6PZfSi_.AyE_3t7t7R**0o#DgR4', 'LAHn2z9ao~WB.8WBt7ax~qj[ofj[',
  'LKO2?U%2Tw=w]~RBVZRi};RPxuwH', 'LGF5]+Yk^6#M@-5c,1J5@.6S%0HX',
  'L5H2EC=PM+yV0g-mR5R*.7RjayWB', 'LHB{$b9F~qIU-;ay%MRj4nM{IURj',
  'LAHn~M9Z~qIU-;j[%MRj4nIU%MRj', 'LKN]R$%2Tw=w]~RBayRi};RPxuWB',
];

function getBlurhash(i: number): string {
  return BLURHASHES[i % BLURHASHES.length];
}

function genImages(id: number, name: string): Product['images'] {
  // Use placeholder URLs keyed by product type + color for visual variety
  const baseUrl = `https://picsum.photos/seed/${id}`;
  return [
    { url: `${baseUrl}-1/600/800`, alt: `${name} - Front View`, blurhash: getBlurhash(id), width: 600, height: 800 },
    { url: `${baseUrl}-2/600/800`, alt: `${name} - Back View`, blurhash: getBlurhash(id + 1), width: 600, height: 800 },
    { url: `${baseUrl}-3/600/800`, alt: `${name} - Detail`, blurhash: getBlurhash(id + 2), width: 600, height: 800 },
  ];
}

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ─── Kurta Templates ──────────────────────────────────────────────────────────

interface ProductTemplate {
  name: string;
  fabric: Fabric;
  work: Work[];
  occasion: Occasion[];
  color: Color;
  colors: Color[];
  price: number;
  discount: number;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
}

const KURTA_TEMPLATES: ProductTemplate[] = [
  { name: 'Royal Zari Silk Kurta', fabric: 'silk', work: ['zari', 'resham'], occasion: ['wedding', 'festive'], color: 'maroon', colors: ['maroon', 'navy', 'gold'], price: 18999, discount: 15, tags: ['bridal', 'premium', 'handcrafted', 'traditional'], rating: 4.8, reviewCount: 342, isNew: false, isBestseller: true },
  { name: 'Chanderi Cotton Chikankari Kurta', fabric: 'cotton', work: ['thread'], occasion: ['casual', 'office'], color: 'white', colors: ['white', 'ivory', 'peach'], price: 3499, discount: 20, tags: ['daily', 'comfort', 'lucknowi', 'breathable'], rating: 4.5, reviewCount: 567, isNew: false, isBestseller: true },
  { name: 'Velvet Gota Patti Anarkali Kurta', fabric: 'velvet', work: ['gota', 'stone'], occasion: ['wedding', 'reception'], color: 'navy', colors: ['navy', 'maroon', 'teal'], price: 24999, discount: 10, tags: ['anarkali', 'premium', 'rajasthani', 'heavy'], rating: 4.9, reviewCount: 189, isNew: true, isBestseller: false },
  { name: 'Georgette Mirror Work Kurta Set', fabric: 'georgette', work: ['mirror', 'sequin'], occasion: ['party', 'mehendi'], color: 'pink', colors: ['pink', 'yellow', 'green'], price: 7999, discount: 25, tags: ['set', 'festive', 'mirror', 'trendy'], rating: 4.3, reviewCount: 421, isNew: false, isBestseller: false },
  { name: 'Organza Handpainted Floral Kurta', fabric: 'organza', work: ['handpainted'], occasion: ['festive', 'party'], color: 'peach', colors: ['peach', 'ivory', 'pink'], price: 12999, discount: 0, tags: ['art', 'floral', 'exclusive', 'handmade'], rating: 4.7, reviewCount: 98, isNew: true, isBestseller: false },
  { name: 'Cotton Printed Everyday Kurta', fabric: 'cotton', work: ['printed'], occasion: ['casual', 'office'], color: 'blue', colors: ['blue', 'green', 'yellow'], price: 1499, discount: 30, tags: ['daily', 'comfort', 'printed', 'value'], rating: 4.2, reviewCount: 1023, isNew: false, isBestseller: true },
  { name: 'Crepe Sequin Cocktail Kurta', fabric: 'crepe', work: ['sequin', 'stone'], occasion: ['party', 'reception'], color: 'black', colors: ['black', 'navy', 'maroon'], price: 8999, discount: 20, tags: ['cocktail', 'glamorous', 'evening', 'sparkle'], rating: 4.4, reviewCount: 234, isNew: false, isBestseller: false },
  { name: 'Silk Resham Embroidered Kurta', fabric: 'silk', work: ['resham', 'zari'], occasion: ['wedding', 'festive'], color: 'red', colors: ['red', 'maroon', 'gold'], price: 15999, discount: 10, tags: ['bridal', 'traditional', 'embroidered', 'premium'], rating: 4.6, reviewCount: 276, isNew: false, isBestseller: false },
  { name: 'Chiffon Thread Work Kurta', fabric: 'chiffon', work: ['thread', 'sequin'], occasion: ['festive', 'mehendi'], color: 'yellow', colors: ['yellow', 'green', 'peach'], price: 5499, discount: 15, tags: ['light', 'flowy', 'embroidered', 'summer'], rating: 4.3, reviewCount: 445, isNew: false, isBestseller: false },
  { name: 'Net Heavy Embellished Kurta', fabric: 'net', work: ['stone', 'sequin', 'zari'], occasion: ['wedding', 'reception'], color: 'gold', colors: ['gold', 'ivory', 'pink'], price: 32999, discount: 5, tags: ['luxury', 'heavy', 'bridal', 'statement'], rating: 4.9, reviewCount: 67, isNew: true, isBestseller: false },
  { name: 'Cotton Silk Plain Kurta', fabric: 'cotton', work: ['plain'], occasion: ['casual', 'office'], color: 'beige', colors: ['beige', 'white', 'black'], price: 2299, discount: 0, tags: ['minimal', 'elegant', 'daily', 'versatile'], rating: 4.4, reviewCount: 789, isNew: false, isBestseller: true },
  { name: 'Georgette Gota Work Palazzo Kurta', fabric: 'georgette', work: ['gota', 'thread'], occasion: ['mehendi', 'festive'], color: 'green', colors: ['green', 'yellow', 'pink'], price: 6999, discount: 30, tags: ['palazzo', 'rajasthani', 'festive', 'trendy'], rating: 4.5, reviewCount: 356, isNew: false, isBestseller: false },
  { name: 'Velvet Zardozi Kurta Palazzo Set', fabric: 'velvet', work: ['zari', 'stone'], occasion: ['wedding', 'reception'], color: 'purple', colors: ['purple', 'maroon', 'navy'], price: 28999, discount: 0, tags: ['zardozi', 'bridal', 'luxury', 'winter'], rating: 4.8, reviewCount: 112, isNew: true, isBestseller: false },
  { name: 'Chiffon Printed Kaftan Kurta', fabric: 'chiffon', work: ['printed'], occasion: ['casual', 'party'], color: 'multi', colors: ['multi'], price: 3999, discount: 40, tags: ['kaftan', 'resort', 'beach', 'relaxed'], rating: 4.1, reviewCount: 534, isNew: false, isBestseller: false },
  { name: 'Organza Zari Border Kurta', fabric: 'organza', work: ['zari'], occasion: ['festive', 'party'], color: 'ivory', colors: ['ivory', 'peach', 'gold'], price: 9999, discount: 10, tags: ['border', 'elegant', 'sheer', 'formal'], rating: 4.6, reviewCount: 198, isNew: false, isBestseller: false },
  { name: 'Silk Mirror Work A-Line Kurta', fabric: 'silk', work: ['mirror', 'thread'], occasion: ['festive', 'mehendi'], color: 'teal', colors: ['teal', 'green', 'blue'], price: 11499, discount: 20, tags: ['aline', 'mirror', 'kutch', 'artisan'], rating: 4.5, reviewCount: 267, isNew: false, isBestseller: false },
  { name: 'Cotton Handblock Printed Kurta', fabric: 'cotton', work: ['printed'], occasion: ['casual'], color: 'blue', colors: ['blue', 'red', 'green'], price: 1999, discount: 0, tags: ['handblock', 'jaipur', 'artisan', 'sustainable'], rating: 4.3, reviewCount: 678, isNew: false, isBestseller: false },
  { name: 'Crepe Stone Work Angrakha Kurta', fabric: 'crepe', work: ['stone', 'sequin'], occasion: ['party', 'festive'], color: 'maroon', colors: ['maroon', 'black', 'navy'], price: 7499, discount: 15, tags: ['angrakha', 'fusion', 'statement', 'evening'], rating: 4.4, reviewCount: 312, isNew: true, isBestseller: false },
  { name: 'Net Pearl Embellished Kurta', fabric: 'net', work: ['stone', 'thread'], occasion: ['reception', 'party'], color: 'ivory', colors: ['ivory', 'pink', 'peach'], price: 14999, discount: 10, tags: ['pearl', 'elegant', 'sheer', 'formal'], rating: 4.7, reviewCount: 145, isNew: false, isBestseller: false },
  { name: 'Georgette Plain Flared Kurta', fabric: 'georgette', work: ['plain'], occasion: ['casual', 'office'], color: 'peach', colors: ['peach', 'beige', 'white'], price: 2799, discount: 25, tags: ['flared', 'daily', 'comfortable', 'simple'], rating: 4.2, reviewCount: 890, isNew: false, isBestseller: true },
  { name: 'Silk Banarasi Kurta Set', fabric: 'silk', work: ['zari', 'resham'], occasion: ['wedding', 'festive'], color: 'red', colors: ['red', 'gold', 'pink'], price: 22999, discount: 0, tags: ['banarasi', 'bridal', 'heritage', 'premium'], rating: 4.9, reviewCount: 201, isNew: false, isBestseller: true },
  { name: 'Chiffon Resham Thread Kurta', fabric: 'chiffon', work: ['resham', 'thread'], occasion: ['festive', 'party'], color: 'green', colors: ['green', 'teal', 'yellow'], price: 6499, discount: 20, tags: ['light', 'embroidered', 'summer', 'graceful'], rating: 4.4, reviewCount: 389, isNew: false, isBestseller: false },
  { name: 'Velvet Printed Winter Kurta', fabric: 'velvet', work: ['printed'], occasion: ['casual', 'festive'], color: 'navy', colors: ['navy', 'maroon', 'black'], price: 4999, discount: 35, tags: ['winter', 'warm', 'printed', 'cozy'], rating: 4.3, reviewCount: 445, isNew: false, isBestseller: false },
  { name: 'Cotton Gota Border Kurta', fabric: 'cotton', work: ['gota'], occasion: ['mehendi', 'festive'], color: 'yellow', colors: ['yellow', 'pink', 'green'], price: 3299, discount: 15, tags: ['gota', 'rajasthani', 'lightweight', 'festive'], rating: 4.5, reviewCount: 567, isNew: true, isBestseller: false },
  { name: 'Organza Sequin Party Kurta', fabric: 'organza', work: ['sequin', 'stone'], occasion: ['party', 'reception'], color: 'gold', colors: ['gold', 'black', 'navy'], price: 16999, discount: 10, tags: ['party', 'glamorous', 'sheer', 'sparkle'], rating: 4.6, reviewCount: 178, isNew: false, isBestseller: false },
  { name: 'Crepe Plain Office Kurta', fabric: 'crepe', work: ['plain'], occasion: ['office', 'casual'], color: 'black', colors: ['black', 'navy', 'beige'], price: 1799, discount: 0, tags: ['office', 'formal', 'minimal', 'versatile'], rating: 4.1, reviewCount: 934, isNew: false, isBestseller: true },
  { name: 'Net Zari Heavy Bridal Kurta', fabric: 'net', work: ['zari', 'stone', 'sequin'], occasion: ['wedding'], color: 'red', colors: ['red', 'maroon', 'gold'], price: 45999, discount: 5, tags: ['bridal', 'heavy', 'luxury', 'statement'], rating: 5.0, reviewCount: 42, isNew: false, isBestseller: false },
  { name: 'Georgette Handpainted Kurta', fabric: 'georgette', work: ['handpainted'], occasion: ['festive', 'party'], color: 'pink', colors: ['pink', 'peach', 'ivory'], price: 8499, discount: 0, tags: ['art', 'unique', 'handmade', 'exclusive'], rating: 4.7, reviewCount: 87, isNew: true, isBestseller: false },
  { name: 'Cotton Silk Resham Kurta', fabric: 'cotton', work: ['resham'], occasion: ['festive'], color: 'teal', colors: ['teal', 'green', 'blue'], price: 4499, discount: 20, tags: ['embroidered', 'festive', 'medium', 'elegant'], rating: 4.4, reviewCount: 423, isNew: false, isBestseller: false },
  { name: 'Silk Cutdana Work Kurta', fabric: 'silk', work: ['stone', 'sequin'], occasion: ['reception', 'party'], color: 'navy', colors: ['navy', 'black', 'purple'], price: 19999, discount: 15, tags: ['cutdana', 'premium', 'evening', 'luxe'], rating: 4.8, reviewCount: 156, isNew: false, isBestseller: false },
  { name: 'Chiffon Plain Everyday Kurta', fabric: 'chiffon', work: ['plain'], occasion: ['casual', 'office'], color: 'white', colors: ['white', 'peach', 'beige'], price: 1999, discount: 10, tags: ['daily', 'simple', 'light', 'comfortable'], rating: 4.0, reviewCount: 756, isNew: false, isBestseller: false },
  { name: 'Organza Thread Work Kurta', fabric: 'organza', work: ['thread', 'sequin'], occasion: ['party', 'festive'], color: 'purple', colors: ['purple', 'pink', 'peach'], price: 11999, discount: 0, tags: ['sheer', 'delicate', 'embroidered', 'evening'], rating: 4.6, reviewCount: 198, isNew: true, isBestseller: false },
  { name: 'Velvet Stone Work Kurta Set', fabric: 'velvet', work: ['stone', 'zari'], occasion: ['wedding', 'reception'], color: 'maroon', colors: ['maroon', 'navy', 'purple'], price: 21999, discount: 10, tags: ['set', 'bridal', 'heavy', 'winter'], rating: 4.7, reviewCount: 134, isNew: false, isBestseller: false },
  { name: 'Cotton Printed Summer Kurta', fabric: 'cotton', work: ['printed'], occasion: ['casual'], color: 'yellow', colors: ['yellow', 'blue', 'green'], price: 1299, discount: 50, tags: ['summer', 'printed', 'value', 'colorful'], rating: 4.1, reviewCount: 1234, isNew: false, isBestseller: true },
  { name: 'Georgette Sequin Cocktail Kurta', fabric: 'georgette', work: ['sequin'], occasion: ['party'], color: 'gold', colors: ['gold', 'black', 'navy'], price: 9499, discount: 20, tags: ['cocktail', 'sparkle', 'party', 'evening'], rating: 4.5, reviewCount: 267, isNew: false, isBestseller: false },
  { name: 'Crepe Mirror Work Festival Kurta', fabric: 'crepe', work: ['mirror', 'gota'], occasion: ['mehendi', 'festive'], color: 'green', colors: ['green', 'yellow', 'pink'], price: 5999, discount: 25, tags: ['festival', 'mirror', 'vibrant', 'trendy'], rating: 4.3, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Net Resham Embroidered Kurta', fabric: 'net', work: ['resham', 'sequin'], occasion: ['reception', 'festive'], color: 'pink', colors: ['pink', 'peach', 'ivory'], price: 13999, discount: 10, tags: ['embroidered', 'sheer', 'elegant', 'formal'], rating: 4.6, reviewCount: 178, isNew: false, isBestseller: false },
  { name: 'Silk Thread Work Peplum Kurta', fabric: 'silk', work: ['thread', 'mirror'], occasion: ['party', 'festive'], color: 'peach', colors: ['peach', 'pink', 'ivory'], price: 10999, discount: 15, tags: ['peplum', 'fusion', 'trendy', 'statement'], rating: 4.5, reviewCount: 234, isNew: true, isBestseller: false },
  { name: 'Cotton Plain Comfort Kurta', fabric: 'cotton', work: ['plain'], occasion: ['casual', 'office'], color: 'green', colors: ['green', 'blue', 'beige'], price: 1599, discount: 0, tags: ['plain', 'daily', 'comfort', 'basic'], rating: 4.0, reviewCount: 1567, isNew: false, isBestseller: true },
  { name: 'Chiffon Gota Patti Festive Kurta', fabric: 'chiffon', work: ['gota', 'thread'], occasion: ['festive', 'mehendi'], color: 'pink', colors: ['pink', 'yellow', 'peach'], price: 4999, discount: 20, tags: ['gota', 'festive', 'lightweight', 'graceful'], rating: 4.4, reviewCount: 456, isNew: false, isBestseller: false },
];

const GOWN_TEMPLATES: ProductTemplate[] = [
  { name: 'Silk Zari Embroidered Ball Gown', fabric: 'silk', work: ['zari', 'stone'], occasion: ['wedding', 'reception'], color: 'maroon', colors: ['maroon', 'navy', 'gold'], price: 35999, discount: 10, tags: ['ball', 'bridal', 'luxury', 'statement'], rating: 4.9, reviewCount: 98, isNew: true, isBestseller: false },
  { name: 'Georgette Sequin Evening Gown', fabric: 'georgette', work: ['sequin', 'stone'], occasion: ['party', 'reception'], color: 'black', colors: ['black', 'navy', 'maroon'], price: 12999, discount: 20, tags: ['evening', 'glamorous', 'sparkle', 'cocktail'], rating: 4.6, reviewCount: 345, isNew: false, isBestseller: true },
  { name: 'Net Heavy Embellished Bridal Gown', fabric: 'net', work: ['zari', 'stone', 'sequin'], occasion: ['wedding'], color: 'red', colors: ['red', 'gold', 'ivory'], price: 55999, discount: 0, tags: ['bridal', 'heavy', 'luxury', 'couture'], rating: 5.0, reviewCount: 34, isNew: false, isBestseller: false },
  { name: 'Velvet Resham Embroidered Gown', fabric: 'velvet', work: ['resham', 'zari'], occasion: ['wedding', 'reception'], color: 'navy', colors: ['navy', 'maroon', 'purple'], price: 28999, discount: 15, tags: ['winter', 'bridal', 'heavy', 'embroidered'], rating: 4.8, reviewCount: 123, isNew: false, isBestseller: false },
  { name: 'Chiffon Printed Maxi Gown', fabric: 'chiffon', work: ['printed'], occasion: ['party', 'casual'], color: 'multi', colors: ['multi'], price: 4999, discount: 35, tags: ['maxi', 'flowy', 'casual', 'resort'], rating: 4.2, reviewCount: 567, isNew: false, isBestseller: true },
  { name: 'Organza Floral Applique Gown', fabric: 'organza', work: ['handpainted', 'thread'], occasion: ['festive', 'reception'], color: 'peach', colors: ['peach', 'ivory', 'pink'], price: 18999, discount: 10, tags: ['floral', 'romantic', 'delicate', 'garden'], rating: 4.7, reviewCount: 167, isNew: true, isBestseller: false },
  { name: 'Crepe Plain Minimalist Gown', fabric: 'crepe', work: ['plain'], occasion: ['party', 'office'], color: 'beige', colors: ['beige', 'black', 'navy'], price: 5999, discount: 25, tags: ['minimal', 'modern', 'sleek', 'versatile'], rating: 4.3, reviewCount: 456, isNew: false, isBestseller: false },
  { name: 'Cotton Thread Work Anarkali Gown', fabric: 'cotton', work: ['thread', 'mirror'], occasion: ['festive', 'mehendi'], color: 'yellow', colors: ['yellow', 'green', 'pink'], price: 6999, discount: 20, tags: ['anarkali', 'cotton', 'festive', 'comfortable'], rating: 4.4, reviewCount: 389, isNew: false, isBestseller: false },
  { name: 'Silk Mirror Work Cocktail Gown', fabric: 'silk', work: ['mirror', 'sequin'], occasion: ['party', 'reception'], color: 'teal', colors: ['teal', 'navy', 'black'], price: 16999, discount: 15, tags: ['cocktail', 'mirror', 'statement', 'sparkle'], rating: 4.6, reviewCount: 212, isNew: false, isBestseller: false },
  { name: 'Georgette Gota Patti Festive Gown', fabric: 'georgette', work: ['gota', 'thread'], occasion: ['festive', 'mehendi'], color: 'pink', colors: ['pink', 'peach', 'yellow'], price: 8999, discount: 30, tags: ['gota', 'festive', 'rajasthani', 'trendy'], rating: 4.5, reviewCount: 298, isNew: false, isBestseller: false },
  { name: 'Net Stone Work Reception Gown', fabric: 'net', work: ['stone', 'sequin'], occasion: ['reception', 'party'], color: 'gold', colors: ['gold', 'ivory', 'pink'], price: 22999, discount: 10, tags: ['reception', 'glamorous', 'sheer', 'heavy'], rating: 4.7, reviewCount: 145, isNew: true, isBestseller: false },
  { name: 'Velvet Sequin Dinner Gown', fabric: 'velvet', work: ['sequin'], occasion: ['party', 'reception'], color: 'purple', colors: ['purple', 'navy', 'black'], price: 14999, discount: 20, tags: ['dinner', 'luxe', 'winter', 'sparkle'], rating: 4.5, reviewCount: 234, isNew: false, isBestseller: false },
  { name: 'Chiffon Resham Embroidered Gown', fabric: 'chiffon', work: ['resham', 'thread'], occasion: ['festive', 'party'], color: 'green', colors: ['green', 'teal', 'yellow'], price: 9499, discount: 15, tags: ['embroidered', 'light', 'flowing', 'graceful'], rating: 4.4, reviewCount: 312, isNew: false, isBestseller: false },
  { name: 'Organza Zari Border Floor Gown', fabric: 'organza', work: ['zari'], occasion: ['wedding', 'festive'], color: 'ivory', colors: ['ivory', 'gold', 'peach'], price: 19999, discount: 5, tags: ['floor', 'elegant', 'border', 'traditional'], rating: 4.8, reviewCount: 87, isNew: false, isBestseller: false },
  { name: 'Crepe Stone Work Party Gown', fabric: 'crepe', work: ['stone', 'sequin'], occasion: ['party'], color: 'maroon', colors: ['maroon', 'black', 'navy'], price: 7499, discount: 25, tags: ['party', 'statement', 'evening', 'glam'], rating: 4.3, reviewCount: 378, isNew: false, isBestseller: false },
  { name: 'Cotton Printed Casual Maxi Gown', fabric: 'cotton', work: ['printed'], occasion: ['casual'], color: 'blue', colors: ['blue', 'green', 'multi'], price: 2999, discount: 40, tags: ['casual', 'maxi', 'printed', 'comfort'], rating: 4.1, reviewCount: 678, isNew: false, isBestseller: true },
  { name: 'Silk Handpainted Art Gown', fabric: 'silk', work: ['handpainted'], occasion: ['festive', 'party'], color: 'peach', colors: ['peach', 'ivory', 'pink'], price: 24999, discount: 0, tags: ['art', 'handmade', 'exclusive', 'couture'], rating: 4.9, reviewCount: 56, isNew: true, isBestseller: false },
  { name: 'Georgette Plain A-Line Gown', fabric: 'georgette', work: ['plain'], occasion: ['casual', 'office'], color: 'navy', colors: ['navy', 'black', 'beige'], price: 3499, discount: 15, tags: ['aline', 'daily', 'simple', 'elegant'], rating: 4.2, reviewCount: 567, isNew: false, isBestseller: false },
  { name: 'Net Thread Work Fairy Gown', fabric: 'net', work: ['thread', 'sequin'], occasion: ['party', 'reception'], color: 'pink', colors: ['pink', 'peach', 'ivory'], price: 15999, discount: 10, tags: ['fairy', 'romantic', 'sheer', 'dreamy'], rating: 4.6, reviewCount: 198, isNew: false, isBestseller: false },
  { name: 'Velvet Plain Structured Gown', fabric: 'velvet', work: ['plain'], occasion: ['party', 'reception'], color: 'black', colors: ['black', 'maroon', 'navy'], price: 11999, discount: 20, tags: ['structured', 'modern', 'minimal', 'sleek'], rating: 4.5, reviewCount: 234, isNew: false, isBestseller: false },
  { name: 'Chiffon Gota Border Festive Gown', fabric: 'chiffon', work: ['gota'], occasion: ['festive', 'mehendi'], color: 'yellow', colors: ['yellow', 'green', 'pink'], price: 5999, discount: 30, tags: ['festive', 'gota', 'light', 'playful'], rating: 4.3, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Organza Sequin Fairy Tale Gown', fabric: 'organza', work: ['sequin', 'stone'], occasion: ['wedding', 'reception'], color: 'gold', colors: ['gold', 'ivory', 'peach'], price: 38999, discount: 5, tags: ['fairy', 'bridal', 'sparkle', 'luxury'], rating: 4.9, reviewCount: 67, isNew: true, isBestseller: false },
  { name: 'Crepe Printed Casual Gown', fabric: 'crepe', work: ['printed'], occasion: ['casual', 'party'], color: 'multi', colors: ['multi'], price: 3999, discount: 35, tags: ['casual', 'printed', 'fun', 'relaxed'], rating: 4.1, reviewCount: 567, isNew: false, isBestseller: false },
  { name: 'Cotton Resham Embroidered Gown', fabric: 'cotton', work: ['resham', 'thread'], occasion: ['festive'], color: 'teal', colors: ['teal', 'blue', 'green'], price: 7999, discount: 15, tags: ['embroidered', 'festive', 'comfortable', 'medium'], rating: 4.4, reviewCount: 278, isNew: false, isBestseller: false },
  { name: 'Silk Zardozi Bridal Trail Gown', fabric: 'silk', work: ['zari', 'stone', 'resham'], occasion: ['wedding'], color: 'red', colors: ['red', 'maroon', 'gold'], price: 65999, discount: 0, tags: ['trail', 'bridal', 'zardozi', 'couture'], rating: 5.0, reviewCount: 23, isNew: false, isBestseller: false },
  { name: 'Georgette Mirror Boho Gown', fabric: 'georgette', work: ['mirror', 'thread'], occasion: ['party', 'casual'], color: 'white', colors: ['white', 'ivory', 'peach'], price: 6499, discount: 25, tags: ['boho', 'mirror', 'free', 'artsy'], rating: 4.3, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Net Zari Heavy Wedding Gown', fabric: 'net', work: ['zari', 'stone'], occasion: ['wedding', 'reception'], color: 'maroon', colors: ['maroon', 'red', 'gold'], price: 42999, discount: 10, tags: ['wedding', 'heavy', 'luxury', 'bridal'], rating: 4.8, reviewCount: 89, isNew: false, isBestseller: false },
  { name: 'Velvet Thread Work Winter Gown', fabric: 'velvet', work: ['thread', 'resham'], occasion: ['festive', 'reception'], color: 'navy', colors: ['navy', 'purple', 'maroon'], price: 17999, discount: 15, tags: ['winter', 'embroidered', 'rich', 'warm'], rating: 4.6, reviewCount: 167, isNew: false, isBestseller: false },
  { name: 'Chiffon Plain Summer Gown', fabric: 'chiffon', work: ['plain'], occasion: ['casual'], color: 'peach', colors: ['peach', 'white', 'beige'], price: 2499, discount: 20, tags: ['summer', 'light', 'breezy', 'minimal'], rating: 4.0, reviewCount: 789, isNew: false, isBestseller: true },
  { name: 'Organza Handpainted Wedding Gown', fabric: 'organza', work: ['handpainted', 'stone'], occasion: ['wedding', 'reception'], color: 'ivory', colors: ['ivory', 'peach', 'gold'], price: 48999, discount: 0, tags: ['handpainted', 'bridal', 'art', 'exclusive'], rating: 5.0, reviewCount: 18, isNew: true, isBestseller: false },
  { name: 'Crepe Sequin Modern Gown', fabric: 'crepe', work: ['sequin'], occasion: ['party', 'reception'], color: 'navy', colors: ['navy', 'black', 'maroon'], price: 8999, discount: 20, tags: ['modern', 'sparkle', 'evening', 'chic'], rating: 4.4, reviewCount: 278, isNew: false, isBestseller: false },
  { name: 'Cotton Gota Festive Gown', fabric: 'cotton', work: ['gota', 'thread'], occasion: ['festive', 'mehendi'], color: 'green', colors: ['green', 'yellow', 'pink'], price: 5499, discount: 25, tags: ['gota', 'festive', 'comfortable', 'vibrant'], rating: 4.3, reviewCount: 412, isNew: false, isBestseller: false },
  { name: 'Silk Stone Work Glamour Gown', fabric: 'silk', work: ['stone', 'sequin'], occasion: ['party', 'reception'], color: 'gold', colors: ['gold', 'black', 'navy'], price: 21999, discount: 10, tags: ['glamour', 'sparkle', 'premium', 'statement'], rating: 4.7, reviewCount: 156, isNew: false, isBestseller: false },
  { name: 'Georgette Resham Midi Gown', fabric: 'georgette', work: ['resham'], occasion: ['festive', 'party'], color: 'pink', colors: ['pink', 'peach', 'ivory'], price: 7999, discount: 15, tags: ['midi', 'embroidered', 'feminine', 'graceful'], rating: 4.4, reviewCount: 289, isNew: false, isBestseller: false },
  { name: 'Net Plain Sheer Gown', fabric: 'net', work: ['plain'], occasion: ['party'], color: 'black', colors: ['black', 'white', 'navy'], price: 4999, discount: 30, tags: ['sheer', 'bold', 'modern', 'daring'], rating: 4.2, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Velvet Gota Rajasthani Gown', fabric: 'velvet', work: ['gota', 'mirror'], occasion: ['festive', 'mehendi'], color: 'red', colors: ['red', 'maroon', 'green'], price: 13999, discount: 20, tags: ['rajasthani', 'gota', 'traditional', 'festive'], rating: 4.5, reviewCount: 234, isNew: true, isBestseller: false },
  { name: 'Chiffon Stone Work Dinner Gown', fabric: 'chiffon', work: ['stone', 'sequin'], occasion: ['party', 'reception'], color: 'purple', colors: ['purple', 'navy', 'black'], price: 10999, discount: 15, tags: ['dinner', 'elegant', 'sparkle', 'evening'], rating: 4.5, reviewCount: 198, isNew: false, isBestseller: false },
  { name: 'Organza Plain Ethereal Gown', fabric: 'organza', work: ['plain'], occasion: ['party', 'reception'], color: 'white', colors: ['white', 'ivory', 'peach'], price: 8499, discount: 10, tags: ['ethereal', 'sheer', 'minimal', 'dreamy'], rating: 4.6, reviewCount: 145, isNew: false, isBestseller: false },
  { name: 'Crepe Thread Work Fusion Gown', fabric: 'crepe', work: ['thread', 'mirror'], occasion: ['party', 'festive'], color: 'blue', colors: ['blue', 'teal', 'navy'], price: 6999, discount: 25, tags: ['fusion', 'modern', 'embroidered', 'trendy'], rating: 4.3, reviewCount: 312, isNew: false, isBestseller: false },
  { name: 'Cotton Handpainted Art Maxi Gown', fabric: 'cotton', work: ['handpainted'], occasion: ['casual', 'festive'], color: 'multi', colors: ['multi'], price: 9999, discount: 0, tags: ['art', 'handpainted', 'unique', 'sustainable'], rating: 4.7, reviewCount: 78, isNew: true, isBestseller: false },
];

const SAREE_TEMPLATES: ProductTemplate[] = [
  { name: 'Banarasi Silk Zari Saree', fabric: 'silk', work: ['zari', 'resham'], occasion: ['wedding', 'festive'], color: 'red', colors: ['red', 'maroon', 'gold'], price: 24999, discount: 10, tags: ['banarasi', 'bridal', 'heritage', 'handloom'], rating: 4.9, reviewCount: 456, isNew: false, isBestseller: true },
  { name: 'Georgette Sequin Party Saree', fabric: 'georgette', work: ['sequin', 'stone'], occasion: ['party', 'reception'], color: 'black', colors: ['black', 'navy', 'maroon'], price: 8999, discount: 25, tags: ['party', 'sparkle', 'glamorous', 'modern'], rating: 4.5, reviewCount: 567, isNew: false, isBestseller: true },
  { name: 'Organza Floral Handpainted Saree', fabric: 'organza', work: ['handpainted'], occasion: ['festive', 'party'], color: 'peach', colors: ['peach', 'ivory', 'pink'], price: 15999, discount: 0, tags: ['floral', 'art', 'handmade', 'exclusive'], rating: 4.8, reviewCount: 134, isNew: true, isBestseller: false },
  { name: 'Chiffon Printed Casual Saree', fabric: 'chiffon', work: ['printed'], occasion: ['casual', 'office'], color: 'blue', colors: ['blue', 'green', 'multi'], price: 2499, discount: 35, tags: ['daily', 'lightweight', 'printed', 'value'], rating: 4.2, reviewCount: 890, isNew: false, isBestseller: true },
  { name: 'Net Heavy Bridal Saree', fabric: 'net', work: ['zari', 'stone', 'sequin'], occasion: ['wedding'], color: 'red', colors: ['red', 'gold', 'maroon'], price: 45999, discount: 5, tags: ['bridal', 'heavy', 'luxury', 'couture'], rating: 5.0, reviewCount: 67, isNew: false, isBestseller: false },
  { name: 'Velvet Gota Patti Winter Saree', fabric: 'velvet', work: ['gota', 'stone'], occasion: ['wedding', 'festive'], color: 'maroon', colors: ['maroon', 'navy', 'purple'], price: 18999, discount: 15, tags: ['winter', 'gota', 'rajasthani', 'heavy'], rating: 4.7, reviewCount: 198, isNew: false, isBestseller: false },
  { name: 'Cotton Handloom Plain Saree', fabric: 'cotton', work: ['plain'], occasion: ['casual', 'office'], color: 'white', colors: ['white', 'beige', 'ivory'], price: 1999, discount: 0, tags: ['handloom', 'daily', 'sustainable', 'comfort'], rating: 4.3, reviewCount: 1234, isNew: false, isBestseller: true },
  { name: 'Crepe Mirror Work Saree', fabric: 'crepe', work: ['mirror', 'thread'], occasion: ['mehendi', 'festive'], color: 'green', colors: ['green', 'yellow', 'pink'], price: 6999, discount: 20, tags: ['mirror', 'kutch', 'artisan', 'vibrant'], rating: 4.5, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Silk Kanjivaram Temple Saree', fabric: 'silk', work: ['zari'], occasion: ['wedding', 'festive'], color: 'gold', colors: ['gold', 'red', 'maroon'], price: 32999, discount: 0, tags: ['kanjivaram', 'temple', 'south', 'heritage'], rating: 4.9, reviewCount: 278, isNew: false, isBestseller: true },
  { name: 'Georgette Resham Embroidered Saree', fabric: 'georgette', work: ['resham', 'thread'], occasion: ['festive', 'reception'], color: 'navy', colors: ['navy', 'maroon', 'teal'], price: 9999, discount: 15, tags: ['embroidered', 'elegant', 'formal', 'graceful'], rating: 4.6, reviewCount: 312, isNew: false, isBestseller: false },
  { name: 'Organza Zari Border Saree', fabric: 'organza', work: ['zari'], occasion: ['festive', 'party'], color: 'ivory', colors: ['ivory', 'gold', 'peach'], price: 12999, discount: 10, tags: ['border', 'sheer', 'delicate', 'elegant'], rating: 4.7, reviewCount: 189, isNew: true, isBestseller: false },
  { name: 'Chiffon Thread Work Saree', fabric: 'chiffon', work: ['thread', 'sequin'], occasion: ['party', 'festive'], color: 'pink', colors: ['pink', 'peach', 'purple'], price: 5999, discount: 25, tags: ['embroidered', 'light', 'graceful', 'feminine'], rating: 4.4, reviewCount: 456, isNew: false, isBestseller: false },
  { name: 'Net Sequin Designer Saree', fabric: 'net', work: ['sequin', 'stone'], occasion: ['party', 'reception'], color: 'gold', colors: ['gold', 'black', 'navy'], price: 16999, discount: 20, tags: ['designer', 'sparkle', 'glamorous', 'sheer'], rating: 4.6, reviewCount: 234, isNew: false, isBestseller: false },
  { name: 'Velvet Resham Embroidered Saree', fabric: 'velvet', work: ['resham', 'zari'], occasion: ['wedding', 'reception'], color: 'navy', colors: ['navy', 'maroon', 'purple'], price: 22999, discount: 10, tags: ['winter', 'heavy', 'bridal', 'embroidered'], rating: 4.8, reviewCount: 123, isNew: false, isBestseller: false },
  { name: 'Cotton Printed Block Saree', fabric: 'cotton', work: ['printed'], occasion: ['casual'], color: 'yellow', colors: ['yellow', 'blue', 'green'], price: 1499, discount: 30, tags: ['block', 'jaipur', 'handprinted', 'eco'], rating: 4.1, reviewCount: 789, isNew: false, isBestseller: false },
  { name: 'Crepe Sequin Cocktail Saree', fabric: 'crepe', work: ['sequin'], occasion: ['party', 'reception'], color: 'black', colors: ['black', 'navy', 'maroon'], price: 7999, discount: 20, tags: ['cocktail', 'modern', 'sparkle', 'chic'], rating: 4.4, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Silk Patola Double Ikat Saree', fabric: 'silk', work: ['printed'], occasion: ['festive', 'wedding'], color: 'red', colors: ['red', 'green', 'multi'], price: 28999, discount: 0, tags: ['patola', 'gujarat', 'ikat', 'heritage'], rating: 4.9, reviewCount: 167, isNew: true, isBestseller: false },
  { name: 'Georgette Gota Border Saree', fabric: 'georgette', work: ['gota', 'thread'], occasion: ['mehendi', 'festive'], color: 'yellow', colors: ['yellow', 'pink', 'green'], price: 5499, discount: 25, tags: ['gota', 'rajasthani', 'festive', 'light'], rating: 4.3, reviewCount: 423, isNew: false, isBestseller: false },
  { name: 'Organza Stone Work Saree', fabric: 'organza', work: ['stone', 'sequin'], occasion: ['reception', 'party'], color: 'purple', colors: ['purple', 'pink', 'navy'], price: 14999, discount: 15, tags: ['stone', 'sparkle', 'sheer', 'glamorous'], rating: 4.6, reviewCount: 198, isNew: false, isBestseller: false },
  { name: 'Chiffon Plain Everyday Saree', fabric: 'chiffon', work: ['plain'], occasion: ['casual', 'office'], color: 'beige', colors: ['beige', 'white', 'peach'], price: 1799, discount: 10, tags: ['daily', 'simple', 'light', 'versatile'], rating: 4.0, reviewCount: 934, isNew: false, isBestseller: true },
  { name: 'Net Zari Bridal Lehenga Saree', fabric: 'net', work: ['zari', 'stone'], occasion: ['wedding'], color: 'maroon', colors: ['maroon', 'red', 'gold'], price: 38999, discount: 5, tags: ['lehenga', 'bridal', 'heavy', 'luxury'], rating: 4.8, reviewCount: 89, isNew: false, isBestseller: false },
  { name: 'Velvet Stone Work Party Saree', fabric: 'velvet', work: ['stone', 'sequin'], occasion: ['party', 'reception'], color: 'purple', colors: ['purple', 'black', 'navy'], price: 13999, discount: 20, tags: ['party', 'luxe', 'winter', 'sparkle'], rating: 4.5, reviewCount: 256, isNew: true, isBestseller: false },
  { name: 'Cotton Silk Temple Border Saree', fabric: 'cotton', work: ['zari'], occasion: ['festive', 'wedding'], color: 'gold', colors: ['gold', 'red', 'green'], price: 4999, discount: 15, tags: ['temple', 'border', 'south', 'traditional'], rating: 4.4, reviewCount: 567, isNew: false, isBestseller: false },
  { name: 'Crepe Handpainted Art Saree', fabric: 'crepe', work: ['handpainted'], occasion: ['festive', 'party'], color: 'ivory', colors: ['ivory', 'peach', 'pink'], price: 11999, discount: 0, tags: ['art', 'handmade', 'exclusive', 'unique'], rating: 4.7, reviewCount: 78, isNew: false, isBestseller: false },
  { name: 'Silk Bandhani Tie-Dye Saree', fabric: 'silk', work: ['printed'], occasion: ['festive', 'mehendi'], color: 'red', colors: ['red', 'yellow', 'green'], price: 8999, discount: 20, tags: ['bandhani', 'rajasthan', 'tiedye', 'traditional'], rating: 4.5, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Georgette Plain Ruffle Saree', fabric: 'georgette', work: ['plain'], occasion: ['party', 'casual'], color: 'peach', colors: ['peach', 'pink', 'white'], price: 3499, discount: 30, tags: ['ruffle', 'modern', 'trendy', 'fun'], rating: 4.2, reviewCount: 567, isNew: false, isBestseller: false },
  { name: 'Organza Resham Thread Saree', fabric: 'organza', work: ['resham', 'thread'], occasion: ['reception', 'festive'], color: 'teal', colors: ['teal', 'green', 'navy'], price: 16999, discount: 10, tags: ['embroidered', 'sheer', 'elegant', 'formal'], rating: 4.6, reviewCount: 167, isNew: false, isBestseller: false },
  { name: 'Chiffon Mirror Kutch Saree', fabric: 'chiffon', work: ['mirror', 'thread'], occasion: ['mehendi', 'casual'], color: 'green', colors: ['green', 'yellow', 'multi'], price: 4499, discount: 25, tags: ['kutch', 'mirror', 'artisan', 'bohemian'], rating: 4.3, reviewCount: 389, isNew: true, isBestseller: false },
  { name: 'Net Gota Festive Saree', fabric: 'net', work: ['gota', 'sequin'], occasion: ['festive', 'mehendi'], color: 'pink', colors: ['pink', 'yellow', 'peach'], price: 9999, discount: 15, tags: ['festive', 'gota', 'light', 'sparkle'], rating: 4.5, reviewCount: 234, isNew: false, isBestseller: false },
  { name: 'Velvet Zari Bridal Saree', fabric: 'velvet', work: ['zari', 'stone', 'resham'], occasion: ['wedding', 'reception'], color: 'red', colors: ['red', 'maroon', 'gold'], price: 35999, discount: 0, tags: ['bridal', 'heavy', 'winter', 'luxury'], rating: 4.9, reviewCount: 56, isNew: false, isBestseller: false },
  { name: 'Cotton Tant Bengali Saree', fabric: 'cotton', work: ['thread'], occasion: ['casual', 'festive'], color: 'white', colors: ['white', 'red', 'yellow'], price: 2999, discount: 10, tags: ['tant', 'bengali', 'handloom', 'traditional'], rating: 4.4, reviewCount: 678, isNew: false, isBestseller: false },
  { name: 'Crepe Thread Work Office Saree', fabric: 'crepe', work: ['thread'], occasion: ['office', 'casual'], color: 'navy', colors: ['navy', 'beige', 'black'], price: 3999, discount: 20, tags: ['office', 'formal', 'minimal', 'daily'], rating: 4.1, reviewCount: 456, isNew: false, isBestseller: false },
  { name: 'Silk Pochampally Ikat Saree', fabric: 'silk', work: ['printed'], occasion: ['festive', 'casual'], color: 'blue', colors: ['blue', 'red', 'multi'], price: 12999, discount: 0, tags: ['pochampally', 'ikat', 'telangana', 'handloom'], rating: 4.7, reviewCount: 234, isNew: true, isBestseller: false },
  { name: 'Georgette Stone Work Saree', fabric: 'georgette', work: ['stone', 'sequin'], occasion: ['party', 'reception'], color: 'maroon', colors: ['maroon', 'black', 'gold'], price: 10999, discount: 15, tags: ['stone', 'party', 'glamorous', 'evening'], rating: 4.5, reviewCount: 289, isNew: false, isBestseller: false },
  { name: 'Organza Plain Minimalist Saree', fabric: 'organza', work: ['plain'], occasion: ['party', 'casual'], color: 'white', colors: ['white', 'ivory', 'peach'], price: 5999, discount: 20, tags: ['minimal', 'modern', 'sheer', 'chic'], rating: 4.3, reviewCount: 412, isNew: false, isBestseller: false },
  { name: 'Chiffon Gota Patti Haldi Saree', fabric: 'chiffon', work: ['gota', 'thread'], occasion: ['mehendi', 'festive'], color: 'yellow', colors: ['yellow', 'green', 'pink'], price: 4999, discount: 30, tags: ['haldi', 'gota', 'festive', 'bright'], rating: 4.4, reviewCount: 345, isNew: false, isBestseller: false },
  { name: 'Net Resham Heavy Saree', fabric: 'net', work: ['resham', 'zari', 'stone'], occasion: ['wedding', 'reception'], color: 'gold', colors: ['gold', 'red', 'maroon'], price: 42999, discount: 5, tags: ['heavy', 'bridal', 'luxury', 'embroidered'], rating: 4.8, reviewCount: 67, isNew: false, isBestseller: false },
  { name: 'Velvet Printed Casual Saree', fabric: 'velvet', work: ['printed'], occasion: ['casual', 'festive'], color: 'navy', colors: ['navy', 'maroon', 'black'], price: 5499, discount: 35, tags: ['casual', 'printed', 'winter', 'cozy'], rating: 4.2, reviewCount: 456, isNew: false, isBestseller: false },
  { name: 'Cotton Silk Maheshwari Saree', fabric: 'cotton', work: ['zari', 'printed'], occasion: ['festive'], color: 'green', colors: ['green', 'red', 'yellow'], price: 6499, discount: 15, tags: ['maheshwari', 'mp', 'handloom', 'heritage'], rating: 4.5, reviewCount: 312, isNew: false, isBestseller: false },
  { name: 'Crepe Stone Embellished Saree', fabric: 'crepe', work: ['stone'], occasion: ['party'], color: 'teal', colors: ['teal', 'navy', 'black'], price: 7499, discount: 25, tags: ['embellished', 'party', 'modern', 'sparkle'], rating: 4.3, reviewCount: 289, isNew: true, isBestseller: false },
];

// ─── Build Full Catalog ───────────────────────────────────────────────────────

function buildProduct(
  id: number,
  template: ProductTemplate,
  type: ProductType,
  dateOffset: number
): Product {
  const salePrice = Math.round(template.price * (1 - template.discount / 100));
  return {
    id,
    name: template.name,
    slug: slug(template.name),
    brand: 'NandiniCollection',
    description: `Exquisite ${template.fabric} ${type} featuring ${template.work.join(' and ')} work. Perfect for ${template.occasion.join(', ')} occasions. Available in ${template.colors.join(', ')}.`,
    type,
    fabric: template.fabric,
    work: template.work,
    occasion: template.occasion,
    color: template.color,
    colors: template.colors,
    price: template.price,
    salePrice,
    discount: template.discount,
    priceRange: priceToRange(salePrice),
    discountRange: discountToRange(template.discount),
    sizes: genSizes(type),
    images: genImages(id, template.name),
    tags: template.tags,
    rating: template.rating,
    reviewCount: template.reviewCount,
    isNew: template.isNew,
    isBestseller: template.isBestseller,
    createdAt: new Date(Date.now() - dateOffset * 86400000).toISOString(),
  };
}

export const syntheticProducts: Product[] = [
  ...KURTA_TEMPLATES.map((t, i) => buildProduct(i + 1, t, 'kurta', i * 3 + 1)),
  ...GOWN_TEMPLATES.map((t, i) => buildProduct(i + 41, t, 'gown', i * 3 + 2)),
  ...SAREE_TEMPLATES.map((t, i) => buildProduct(i + 81, t, 'saree', i * 3 + 3)),
];

// Ingested boutique products with genuine photography and optimized multi-format variants
export const products: Product[] = catalogData as unknown as Product[];

// ─── Color Hex Map (for swatches) ─────────────────────────────────────────────

export const COLOR_HEX: Record<string, string> = {
  red: '#DC2626', maroon: '#7B2D3F', pink: '#EC4899', peach: '#FBBF7E',
  gold: '#C9A84C', yellow: '#EAB308', green: '#16A34A', teal: '#0D9488',
  blue: '#3B82F6', navy: '#1E3A5F', purple: '#9333EA', black: '#1A1A2E',
  white: '#FAFAFA', ivory: '#FAF6F0', beige: '#D4C5A9', multi: 'conic-gradient(red, yellow, green, blue, purple, red)',
};

// ─── Facet Display Labels ─────────────────────────────────────────────────────

export const FACET_LABELS: Record<string, Record<string, string>> = {
  productType: {
    kurta: 'Kurta', gown: 'Gown', saree: 'Saree',
    lehenga: 'Lehenga', 'hoop-art': 'Hoop Art', blouse: 'Blouse',
  },
  fabric: {
    silk: 'Silk', cotton: 'Cotton', georgette: 'Georgette',
    chiffon: 'Chiffon', velvet: 'Velvet', net: 'Net',
    organza: 'Organza', crepe: 'Crepe',
  },
  work: {
    zari: 'Zari/Zardozi', thread: 'Thread Work', mirror: 'Mirror Work',
    sequin: 'Sequin', stone: 'Stone/Kundan', resham: 'Resham',
    gota: 'Gota Patti', printed: 'Printed', plain: 'Plain', handpainted: 'Handpainted',
  },
  occasion: {
    wedding: 'Wedding', festive: 'Festive', party: 'Party',
    casual: 'Casual', office: 'Office', mehendi: 'Mehendi/Haldi', reception: 'Reception',
  },
  color: {
    red: 'Red', maroon: 'Maroon', pink: 'Pink', peach: 'Peach',
    gold: 'Gold', yellow: 'Yellow', green: 'Green', teal: 'Teal',
    blue: 'Blue', navy: 'Navy', purple: 'Purple', black: 'Black',
    white: 'White', ivory: 'Ivory', beige: 'Beige', multi: 'Multi',
  },
  priceRange: {
    'under2k': 'Under ₹2,000', '2k-5k': '₹2,000 - ₹5,000', '5k-10k': '₹5,000 - ₹10,000',
    '10k-25k': '₹10,000 - ₹25,000', '25k-50k': '₹25,000 - ₹50,000', 'above50k': 'Above ₹50,000',
  },
  discountRange: {
    none: 'No Discount', '10plus': '10% & above', '20plus': '20% & above',
    '30plus': '30% & above', '50plus': '50% & above',
  },
};
