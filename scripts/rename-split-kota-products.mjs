import fs from 'node:fs/promises';

const catalogPath = new URL('../src/data/catalog.json', import.meta.url);
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
const splitProducts = catalog.filter((product) => product.sku?.startsWith('NC-KOTA-DESIGN-'));

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

for (const product of splitProducts) {
  const designNumber = product.sku.split('-').pop();
  if (!product.name.endsWith(`Design ${designNumber}`)) {
    product.name = `${product.name} Design ${designNumber}`;
    product.slug = slugify(product.name);
    product.images = product.images.map((image) => ({
      ...image,
      alt: `${product.name} - Main View`,
    }));
  }
}

await fs.writeFile(catalogPath, JSON.stringify(catalog, null, 2));
console.log(`Made ${splitProducts.length} separated design names unique.`);
