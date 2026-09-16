import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import { encode as encodeBlurhash } from 'blurhash';

sharp.concurrency(2);
sharp.cache({ files: 0, items: 0, memory: 50 });

const root = process.cwd();
const docxPath = path.join(root, 'pro.docx');
const imageDir = path.join(root, 'public', 'images', 'products');
const catalogPath = path.join(root, 'src', 'data', 'catalog.json');

const prices = [7900, 5800, 5900, 9200, 6400, 9800, 9800, 6800, 5800, 6200];
const imageCounts = [5, 4, 4, 3, 1, 4, 8, 5, 1, 1];
const productNames = [
  'Pure Diamond Chiffon Saree - 13 Motif Sequence & Zari Work',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 02',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 03',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 04',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 05',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 06',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 07',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 08',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 09',
  'Pure Diamond Chiffon Saree - Sequence & Zari Work 10',
];

const colors = ['multi', 'gold', 'maroon'];
const occasions = ['wedding', 'festive', 'party', 'reception'];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function priceRange(price) {
  if (price < 2000) return 'under2k';
  if (price < 5000) return '2k-5k';
  if (price < 10000) return '5k-10k';
  if (price < 25000) return '10k-25k';
  if (price < 50000) return '25k-50k';
  return 'above50k';
}

function bitmask(product) {
  const values = {
    type: 1 << 2,
    fabric: 1 << 9,
    sequin: 1 << 17,
    zari: 1 << 14,
    wedding: 1 << 24,
    festive: 1 << 25,
    party: 1 << 26,
    reception: 1 << 30,
    multi: 1 << 15,
    gold: 1 << 4,
    maroon: 1 << 1,
    price: 1 << 18,
    discount: 1 << 22,
  };
  let field0 = values.type | values.fabric | values.sequin | values.zari;
  for (const occasion of product.occasion) field0 |= values[occasion];
  const field1 = values[product.color] | values.price | values.discount;
  return [field0, field1];
}

async function processImage(raw, prefix, index, alt) {
  const variants = {};
  const sizes = [
    ['375w', 375],
    ['768w', 768],
    ['1080w', 1080],
  ];

  const thumb = await sharp(raw)
    .resize(32, 42, { fit: 'cover', position: 'attention' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const blurhash = encodeBlurhash(new Uint8ClampedArray(thumb.data), thumb.info.width, thumb.info.height, 4, 3);

  for (const [label, width] of sizes) {
    const height = Math.round(width * 4 / 3);
    const base = sharp(raw).resize(width, height, {
      fit: 'contain',
      background: { r: 247, g: 244, b: 239, alpha: 1 },
      withoutEnlargement: false,
    });
    const webp = `${prefix}-${label}.webp`;
    const avif = `${prefix}-${label}.avif`;
    const jpeg = `${prefix}-${label}.jpg`;
    await base.clone().webp({ quality: 84, effort: 4 }).toFile(path.join(imageDir, webp));
    await base.clone().avif({ quality: 78, effort: 2 }).toFile(path.join(imageDir, avif));
    await base.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(imageDir, jpeg));
    variants[label] = { webp: `/images/products/${webp}`, avif: `/images/products/${avif}`, jpeg: `/images/products/${jpeg}` };
  }

  return {
    url: variants['1080w'].webp,
    alt,
    blurhash,
    width: 1080,
    height: 1440,
    sources: {
      avif: Object.fromEntries(Object.entries(variants).map(([label, item]) => [label, item.avif])),
      webp: Object.fromEntries(Object.entries(variants).map(([label, item]) => [label, item.webp])),
      jpeg: Object.fromEntries(Object.entries(variants).map(([label, item]) => [label, item.jpeg])),
    },
  };
}

await fs.mkdir(imageDir, { recursive: true });
const zip = new AdmZip(docxPath);
const mediaEntries = zip.getEntries()
  .filter((entry) => /^word\/media\/image\d+\.jpeg$/i.test(entry.entryName))
  .sort((a, b) => Number(a.entryName.match(/image(\d+)/i)[1]) - Number(b.entryName.match(/image(\d+)/i)[1]));

if (mediaEntries.length !== imageCounts.reduce((sum, count) => sum + count, 0)) {
  throw new Error(`Expected 36 product photos in pro.docx, found ${mediaEntries.length}.`);
}

const existing = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
const maxId = existing.reduce((max, product) => Math.max(max, product.id || 0), 0);
const bySku = new Map(existing.map((product) => [product.sku || product.slug, product]));
let cursor = 0;

for (let index = 0; index < prices.length; index += 1) {
  const name = productNames[index];
  const slug = slugify(name);
  const sku = `NC-DIAMOND-CHIFFON-${String(index + 1).padStart(2, '0')}`;
  const productImages = [];
  for (let imageIndex = 0; imageIndex < imageCounts[index]; imageIndex += 1) {
    const prefix = `${slug}-${imageIndex + 1}`;
    productImages.push(await processImage(
      mediaEntries[cursor++].getData(),
      prefix,
      imageIndex,
      `${name} - View ${imageIndex + 1}`,
    ));
  }
  const product = {
    id: bySku.get(sku)?.id || maxId + index + 1,
    sku,
    name,
    slug,
    brand: 'NandiniCollection',
    description: 'Pure Diamond Chiffon saree with beautiful sequence and zari embroidery work in Viscos Double Diamond fabric. A lightweight, graceful drape for weddings, festive celebrations, parties and receptions.',
    type: 'saree',
    fabric: 'chiffon',
    work: ['sequin', 'zari'],
    occasion: occasions,
    color: colors[index % colors.length],
    colors,
    price: prices[index],
    salePrice: prices[index],
    discount: 0,
    priceRange: priceRange(prices[index]),
    discountRange: 'none',
    sizes: [{ size: 'Custom', inStock: true, quantity: 1 }],
    images: productImages,
    tags: ['diamond chiffon', 'sequence work', 'zari embroidery', 'viscos double diamond', 'wedding saree', 'festive saree'],
    rating: +(4.8 + (index % 2) * 0.1).toFixed(1),
    reviewCount: 0,
    isNew: true,
    isBestseller: prices[index] >= 7900,
    createdAt: new Date(Date.now() + index).toISOString(),
    bitmask: bitmask({ occasion: occasions, color: colors[index % colors.length] }),
  };
  bySku.set(sku, product);
}

await fs.writeFile(catalogPath, JSON.stringify([...bySku.values()], null, 2));
console.log(`Added or updated ${prices.length} pro.docx products and optimized ${mediaEntries.length} source photos.`);
