import fs from 'node:fs/promises';

const catalogPath = new URL('../src/data/catalog.json', import.meta.url);
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));

const sourceSkus = new Set([
  'NC-KOTA-YEL-1300',
  'NC-KOTA-PNK-1350',
  'NC-KOTA-GRN-1350',
  'NC-KOTA-PCH-1300',
  'NC-KOTA-RED-1400',
]);

const designLabels = [
  ['Rose Pink', 'pink'], ['Mustard Gold', 'yellow'], ['Sky Blue', 'blue'], ['Black', 'black'],
  ['Rose Pink', 'pink'], ['Meadow Green', 'green'], ['Ivory White', 'ivory'], ['Sunshine Yellow', 'yellow'], ['Sunset Orange', 'peach'],
  ['Blush Pink', 'pink'], ['Ivory White', 'ivory'],
  ['Rose Pink', 'pink'], ['Mint Green', 'green'],
  ['Ivory Floral', 'ivory'], ['Red Floral', 'red'], ['Blush Pink', 'pink'], ['Black Floral', 'black'],
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const sourceProducts = catalog.filter((product) => sourceSkus.has(product.sku));
const replacementProducts = [];
let labelIndex = 0;
let nextId = Math.max(...catalog.map((product) => product.id), 0) + 1;

for (const source of sourceProducts) {
  for (let imageIndex = 0; imageIndex < source.images.length; imageIndex += 1) {
    const [label, color] = designLabels[labelIndex] || [`Design ${String(labelIndex + 1).padStart(2, '0')}`, 'multi'];
    labelIndex += 1;
    const name = `Kota Doria Embroidered Suit Set - ${label} Design ${String(labelIndex).padStart(2, '0')}`;
    const image = {
      ...source.images[imageIndex],
      alt: `${name} - Main View`,
    };
    replacementProducts.push({
      ...source,
      id: nextId++,
      sku: `NC-KOTA-DESIGN-${String(labelIndex).padStart(2, '0')}`,
      name,
      slug: slugify(name),
      color,
      colors: [color],
      images: [image],
      tags: [...new Set([...source.tags, 'separate design', label.toLowerCase()])],
      description: `${source.description} This listing represents one distinct design from the Kota Doria collection.`,
    });
  }
}

const remaining = catalog.filter((product) => !sourceSkus.has(product.sku));
await fs.writeFile(catalogPath, JSON.stringify([...replacementProducts, ...remaining], null, 2));
console.log(`Split ${sourceProducts.length} grouped Kota products into ${replacementProducts.length} individual design listings.`);
