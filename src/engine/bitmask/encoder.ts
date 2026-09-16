// ─── Product → Bitmask Encoder ────────────────────────────────────────────────
//
// Converts a Product object into an EncodedProduct with two 32-bit bitmask fields.
// This runs once at init time (either on main thread or in worker).

import type { Product } from '../../types/product';
import type { EncodedProduct } from '../../types/engine';
import { BITMASK_SCHEMA } from './schema';

/**
 * Encode a single product's attributes into a 2-field wide bitmask.
 * Work and Occasion are multi-value (array), so we OR all matching bits.
 */
export function encodeProduct(product: Product): EncodedProduct {
  let field0 = 0;
  let field1 = 0;

  // ── Field 0 ──────────────────────────────────────────

  // Product Type (single value)
  const typeVal = BITMASK_SCHEMA.productType.values[product.type];
  if (typeVal) field0 |= typeVal;

  // Fabric (single value)
  const fabricVal = BITMASK_SCHEMA.fabric.values[product.fabric];
  if (fabricVal) field0 |= fabricVal;

  // Work (multi-value array — OR all bits)
  for (const w of product.work) {
    const workVal = BITMASK_SCHEMA.work.values[w];
    if (workVal) field0 |= workVal;
  }

  // Occasion (multi-value array — OR all bits)
  for (const o of product.occasion) {
    const occVal = BITMASK_SCHEMA.occasion.values[o];
    if (occVal) field0 |= occVal;
  }

  // ── Field 1 ──────────────────────────────────────────

  // Color (single primary value)
  const colorVal = BITMASK_SCHEMA.color.values[product.color];
  if (colorVal) field1 |= colorVal;

  // Price Range
  const priceVal = BITMASK_SCHEMA.priceRange.values[product.priceRange];
  if (priceVal) field1 |= priceVal;

  // Discount Range
  const discVal = BITMASK_SCHEMA.discountRange.values[product.discountRange];
  if (discVal) field1 |= discVal;

  return {
    id: product.id,
    fields: [field0, field1],
    price: product.price,
    salePrice: product.salePrice,
    rating: product.rating,
    createdAt: new Date(product.createdAt).getTime(),
  };
}

/**
 * Batch-encode an entire product catalog.
 */
export function encodeCatalog(products: Product[]): EncodedProduct[] {
  return products.map(encodeProduct);
}
