import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const distRoot = join(projectRoot, 'dist');
const catalogPath = join(projectRoot, 'src', 'data', 'catalog.json');
const siteOrigin = 'https://www.nandinicollection.com';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const shell = await readFile(join(distRoot, 'index.html'), 'utf8');

const slugs = new Set();
for (const product of catalog) {
  if (!product.slug || !product.name || !product.description || !product.images?.[0]?.url) {
    throw new Error(`Product is missing SEO page data: ${product.sku ?? product.name ?? 'unknown product'}`);
  }
  if (slugs.has(product.slug)) throw new Error(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
}

const sitemapUrls = [
  { loc: `${siteOrigin}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${siteOrigin}/return-policy`, changefreq: 'monthly', priority: '0.5' },
  ...catalog.map((product) => ({
    loc: `${siteOrigin}/products/${product.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
  .map(({ loc, changefreq, priority }) => `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;
await writeFile(join(distRoot, 'sitemap.xml'), sitemap, 'utf8');

for (const product of catalog) {
  const canonicalUrl = `${siteOrigin}/products/${product.slug}`;
  const title = `${product.name} | Nandini Collection`;
  const imageUrl = `${siteOrigin}${product.images[0].url}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteOrigin}${image.url}`),
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Nandini Collection' },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price: product.salePrice,
      availability: 'https://schema.org/InStock',
    },
  };

  const productContent = `
    <main>
      <article>
        <p>Nandini Collection</p>
        <h1>${escapeHtml(product.name)}</h1>
        <img src="${escapeHtml(product.images[0].url)}" alt="${escapeHtml(product.images[0].alt)}" width="${product.images[0].width}" height="${product.images[0].height}">
        <p>${escapeHtml(product.description)}</p>
        <p>Price: ₹${escapeHtml(product.salePrice)}</p>
        <a href="/">Browse the full collection</a>
      </article>
      <nav aria-label="More products from Nandini Collection">
        <h2>Explore more from the collection</h2>
        <ul>${catalog
          .filter((item) => item.slug !== product.slug)
          .map((item) => `<li><a href="/products/${encodeURIComponent(item.slug)}">${escapeHtml(item.name)}</a></li>`)
          .join('')}</ul>
      </nav>
    </main>`;

  const page = shell
    .replace('<title>Nandini Collection | Modern Indian Occasionwear</title>', `<title>${escapeHtml(title)}</title>`)
    .replace('<meta name="description" content="Nandini Collection — contemporary Indian occasionwear, made for meaningful moments." />', `<meta name="description" content="${escapeHtml(product.description)}" />`)
    .replace('<link rel="canonical" href="https://www.nandinicollection.com/" />', `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace('<meta property="og:type" content="website" />', `<meta property="og:type" content="product" />\n    <meta property="og:url" content="${canonicalUrl}" />\n    <meta property="og:image" content="${imageUrl}" />`)
    .replace('<meta property="og:title" content="Nandini Collection | Modern Indian Occasionwear" />', `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace('<meta property="og:description" content="Contemporary Indian occasionwear, made for meaningful moments." />', `<meta property="og:description" content="${escapeHtml(product.description)}" />`)
    .replace('<meta name="twitter:title" content="Nandini Collection | Modern Indian Occasionwear" />', `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace('<meta name="twitter:description" content="Contemporary Indian occasionwear, made for meaningful moments." />', `<meta name="twitter:description" content="${escapeHtml(product.description)}" />`)
    .replace('<div id="root"></div>', `<div id="root">${productContent}</div>\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`);

  const outputDir = join(distRoot, 'products', product.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'index.html'), page, 'utf8');
}

console.log(`Generated ${catalog.length} crawlable product pages and a ${sitemapUrls.length}-URL sitemap in dist/.`);
