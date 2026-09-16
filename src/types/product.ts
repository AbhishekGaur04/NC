// ─── Product Domain Types ─────────────────────────────────────────────────────

export type ProductType = 'kurta' | 'gown' | 'saree' | 'lehenga' | 'hoop-art' | 'blouse';

export type Fabric =
  | 'silk' | 'cotton' | 'georgette' | 'chiffon'
  | 'velvet' | 'net' | 'organza' | 'crepe';

export type Work =
  | 'zari' | 'thread' | 'mirror' | 'sequin' | 'stone'
  | 'resham' | 'gota' | 'printed' | 'plain' | 'handpainted';

export type Occasion =
  | 'wedding' | 'festive' | 'party' | 'casual'
  | 'office' | 'mehendi' | 'reception';

export type Color =
  | 'red' | 'maroon' | 'pink' | 'peach' | 'gold' | 'yellow'
  | 'green' | 'teal' | 'blue' | 'navy' | 'purple'
  | 'black' | 'white' | 'ivory' | 'beige' | 'multi';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom';

export type PriceRange =
  | 'under2k' | '2k-5k' | '5k-10k'
  | '10k-25k' | '25k-50k' | 'above50k';

export type DiscountRange =
  | 'none' | '10plus' | '20plus' | '30plus' | '50plus';

export interface ProductImageSources {
  avif?: {
    '375w': string;
    '768w': string;
    '1080w': string;
  };
  webp?: {
    '375w': string;
    '768w': string;
    '1080w': string;
  };
  jpeg?: {
    '375w': string;
    '768w': string;
    '1080w': string;
  };
}

export interface ProductImage {
  url: string;
  alt: string;
  blurhash: string;
  width: number;
  height: number;
  sources?: ProductImageSources;
}

export interface SizeStock {
  size: Size;
  inStock: boolean;
  quantity: number;
}

export interface Product {
  id: number;
  sku?: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  type: ProductType;
  fabric: Fabric;
  work: Work[];
  occasion: Occasion[];
  color: Color;
  colors: Color[];        // All available color variants
  price: number;          // Original price in INR
  salePrice: number;      // Current sale price
  discount: number;       // Discount percentage
  priceRange: PriceRange;
  discountRange: DiscountRange;
  sizes: SizeStock[];
  images: ProductImage[];
  tags: string[];          // For recommendation embeddings
  rating: number;          // 0-5
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: string;
  bitmask?: [number, number];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  count: number;
  image: string;
}
