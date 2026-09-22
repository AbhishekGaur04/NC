import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import { encode as encodeBlurhash } from 'blurhash';

const root = process.cwd();
const sourcePath = process.argv[2] || path.join(root, 'Info.docx');
const imageDir = path.join(root, 'public/images/products');
const catalogPath = path.join(root, 'src/data/catalog.json');
const sizes = [
  ['375w', 375, 500],
  ['768w', 768, 1024],
  ['1080w', 1080, 1440],
];

const groups = [
  { sku: 'NC-TISSUE-SAREE-850', name: 'Tissue Saree', price: 850, type: 'saree', fabric: 'silk', work: ['plain'], color: 'gold', colors: ['gold', 'beige', 'multi'], images: [1,2,3,4,5,6,7,8], tags: ['tissue saree', 'silk saree', 'lightweight', 'festive'] },
  { sku: 'NC-BANARSI-TISSUE-950', name: 'Banarsi Tissue Saree', price: 950, type: 'saree', fabric: 'silk', work: ['zari'], color: 'gold', colors: ['gold', 'red', 'multi'], images: [9,10,11,12,13,14,15], tags: ['banarsi saree', 'tissue saree', 'zari', 'festive'] },
  { sku: 'NC-KOTA-GOTTA-1250', name: 'Kota Doria Saree with Gotapatti Work', price: 1250, type: 'saree', fabric: 'cotton', work: ['gota'], color: 'multi', colors: ['multi', 'gold', 'pink'], images: [16,17,18,19,20,21], tags: ['kota doria', 'gotapatti', 'handwork', 'festive'] },
  { sku: 'NC-KOTA-SILK-1450', name: 'Kota Silk Saree', price: 1450, type: 'saree', fabric: 'silk', work: ['plain'], color: 'multi', colors: ['multi', 'gold', 'pink'], images: [22,23,24,25], tags: ['kota silk', 'silk saree', 'lightweight', 'festive'] },
  { sku: 'NC-TISSUE-SILK-SUIT-1450', name: 'Tissue Silk Suit Set', price: 1450, type: 'kurta', fabric: 'silk', work: ['plain'], color: 'multi', colors: ['multi', 'gold', 'pink'], images: [26,27,28], tags: ['tissue silk', 'suit set', 'silk', 'festive'] },
  { sku: 'NC-KOTA-PRINTED-SUIT-1100', name: 'Kota Doria Printed Suit Set', price: 1100, type: 'kurta', fabric: 'cotton', work: ['printed'], color: 'multi', colors: ['multi', 'pink', 'yellow'], images: [29,30,31,32,33], tags: ['kota doria', 'printed suit', 'unstitched', 'dress material'] },
  { sku: 'NC-SOFT-SILK-KOTA-1350-A', name: 'Soft Silk Kota Doria Suit Set Design 01', price: 1350, type: 'kurta', fabric: 'silk', work: ['plain'], color: 'multi', colors: ['multi', 'pink', 'gold'], images: [34,35,36], tags: ['soft silk', 'kota doria', 'unstitched', 'dress material', 'design 01'] },
  { sku: 'NC-SOFT-SILK-KOTA-1350-B', name: 'Soft Silk Kota Doria Suit Set Design 02', price: 1350, type: 'kurta', fabric: 'silk', work: ['plain'], color: 'multi', colors: ['multi', 'pink', 'gold'], images: [37,38,39,40], tags: ['soft silk', 'kota doria', 'unstitched', 'dress material', 'design 02'] },
];

const occasions = ['festive', 'casual'];
const bit = { type:{kurta:1,saree:4}, fabric:{silk:64,cotton:128}, work:{zari:16384,gotta:1048576,printed:2097152,plain:4194304}, occasion:{festive:33554432,casual:134217728}, color:{red:1, pink:4, gold:16, multi:32768}, price:{under2k:65536}, discount:{none:4194304} };

function slugify(text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function mask(group) {
  let a = (bit.type[group.type] || 0) | (bit.fabric[group.fabric] || 0);
  for (const w of group.work) a |= bit.work[w] || 0;
  for (const o of occasions) a |= bit.occasion[o] || 0;
  return [a, (bit.color[group.color] || 0) | bit.price.under2k | bit.discount.none];
}
function stock(type) {
  if (type === 'saree') return [{ size:'Custom', inStock:true, quantity:1 }, ...['XS','S','M','L','XL','XXL'].map(size => ({ size, inStock:false, quantity:0 }))];
  return ['XS','S','M','L','XL','XXL','Custom'].map((size, i) => ({ size, inStock:true, quantity:[4,8,12,10,6,3,5][i] }));
}
async function optimize(raw, slug, index, alt) {
  const thumb = await sharp(raw).resize(32,42,{fit:'cover',position:'center'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const blurhash = encodeBlurhash(new Uint8ClampedArray(thumb.data), thumb.info.width, thumb.info.height, 4, 3);
  const sources = { avif:{}, webp:{}, jpeg:{} };
  for (const [label,width,height] of sizes) {
    const prefix = `${slug}-${index+1}-${label}`;
    await fs.writeFile(path.join(imageDir, `${prefix}.webp`), await sharp(raw).resize(width,height,{fit:'cover',position:'center'}).webp({quality:82,effort:6,smartSubsample:true}).toBuffer());
    await fs.writeFile(path.join(imageDir, `${prefix}.avif`), await sharp(raw).resize(width,height,{fit:'cover',position:'center'}).avif({quality:80,effort:5}).toBuffer());
    await fs.writeFile(path.join(imageDir, `${prefix}.jpg`), await sharp(raw).resize(width,height,{fit:'cover',position:'center'}).jpeg({quality:84,mozjpeg:true}).toBuffer());
    sources.webp[label] = `/images/products/${prefix}.webp`;
    sources.avif[label] = `/images/products/${prefix}.avif`;
    sources.jpeg[label] = `/images/products/${prefix}.jpg`;
  }
  return { url:sources.webp['1080w'], alt, blurhash, width:1080, height:1440, sources };
}

await fs.mkdir(imageDir, { recursive:true });
const zip = new AdmZip(sourcePath);
const existing = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
const bySku = new Map(existing.map(item => [item.sku || item.slug, item]));
let nextId = Math.max(0, ...existing.map(item => item.id || 0)) + 1;

for (const group of groups) {
  const slug = slugify(group.name);
  const images = [];
  for (let i = 0; i < group.images.length; i++) {
    const imageNo = group.images[i];
    const raw = zip.readFile(`word/media/image${imageNo}.jpeg`);
    if (!raw) throw new Error(`Missing image${imageNo}.jpeg in ${sourcePath}`);
    images.push(await optimize(raw, slug, i, `${group.name} - View ${i+1}`));
  }
  const product = {
    id: bySku.get(group.sku)?.id ?? nextId++, sku:group.sku, name:group.name, slug, brand:'NandiniCollection',
    description: `${group.name}. Lightweight, comfortable and suitable for festive celebrations, parties and everyday elegance. Product details: ${group.type === 'saree' ? 'saree' : 'unstitched suit set'} with a graceful drape and premium finish.`,
    type:group.type, fabric:group.fabric, work:group.work, occasion:occasions, color:group.color, colors:group.colors,
    price:group.price, salePrice:group.price, discount:0, priceRange:'under2k', discountRange:'none', sizes:stock(group.type), images,
    tags:group.tags, rating:4.8, reviewCount:0, isNew:true, isBestseller:false, createdAt:new Date().toISOString(), bitmask:mask(group),
  };
  bySku.set(group.sku, product);
  console.log(`${group.name}: ${images.length} optimized images at ₹${group.price}`);
}

await fs.writeFile(catalogPath, JSON.stringify([...bySku.values()], null, 2) + '\n');
console.log(`Catalog now contains ${bySku.size} products.`);
