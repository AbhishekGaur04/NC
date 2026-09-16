// ─── Bitmask Schema: Bit Position Allocation ──────────────────────────────────
//
// We use TWO 32-bit integer fields per product to encode all facet attributes.
// This avoids BigInt overhead while supporting 60+ attribute values.
//
// FIELD 0 (bits 0–31):
//   [0..5]   Product Type  (6 values)
//   [6..13]  Fabric        (8 values)
//   [14..23] Work          (10 values)
//   [24..30] Occasion      (7 values)
//
// FIELD 1 (bits 0–31):
//   [0..15]  Color         (16 values)
//   [16..21] Price Range   (6 values)
//   [22..26] Discount      (5 values)
//   [27..31] reserved
//
// ──────────────────────────────────────────────────────────────────────────────

export const BITMASK_SCHEMA = {
  // ── Field 0 ──────────────────────────────────────────
  productType: {
    fieldIndex: 0 as const,
    offset: 0,
    values: {
      kurta:    1 << 0,
      gown:     1 << 1,
      saree:    1 << 2,
      lehenga:  1 << 3,
      'hoop-art': 1 << 4,
      blouse:   1 << 5,
    },
  },
  fabric: {
    fieldIndex: 0 as const,
    offset: 6,
    values: {
      silk:      1 << 6,
      cotton:    1 << 7,
      georgette: 1 << 8,
      chiffon:   1 << 9,
      velvet:    1 << 10,
      net:       1 << 11,
      organza:   1 << 12,
      crepe:     1 << 13,
    },
  },
  work: {
    fieldIndex: 0 as const,
    offset: 14,
    values: {
      zari:        1 << 14,
      thread:      1 << 15,
      mirror:      1 << 16,
      sequin:      1 << 17,
      stone:       1 << 18,
      resham:      1 << 19,
      gota:        1 << 20,
      printed:     1 << 21,
      plain:       1 << 22,
      handpainted: 1 << 23,
    },
  },
  occasion: {
    fieldIndex: 0 as const,
    offset: 24,
    values: {
      wedding:   1 << 24,
      festive:   1 << 25,
      party:     1 << 26,
      casual:    1 << 27,
      office:    1 << 28,
      mehendi:   1 << 29,
      reception: 1 << 30,
    },
  },

  // ── Field 1 ──────────────────────────────────────────
  color: {
    fieldIndex: 1 as const,
    offset: 0,
    values: {
      red:    1 << 0,
      maroon: 1 << 1,
      pink:   1 << 2,
      peach:  1 << 3,
      gold:   1 << 4,
      yellow: 1 << 5,
      green:  1 << 6,
      teal:   1 << 7,
      blue:   1 << 8,
      navy:   1 << 9,
      purple: 1 << 10,
      black:  1 << 11,
      white:  1 << 12,
      ivory:  1 << 13,
      beige:  1 << 14,
      multi:  1 << 15,
    },
  },
  priceRange: {
    fieldIndex: 1 as const,
    offset: 16,
    values: {
      'under2k':  1 << 16,
      '2k-5k':    1 << 17,
      '5k-10k':   1 << 18,
      '10k-25k':  1 << 19,
      '25k-50k':  1 << 20,
      'above50k': 1 << 21,
    },
  },
  discountRange: {
    fieldIndex: 1 as const,
    offset: 22,
    values: {
      none:    1 << 22,
      '10plus': 1 << 23,
      '20plus': 1 << 24,
      '30plus': 1 << 25,
      '50plus': 1 << 26,
    },
  },
} as const;

// Reverse lookup: facet id → field index
export const FACET_FIELD_INDEX: Record<string, 0 | 1> = {
  productType: 0,
  fabric: 0,
  work: 0,
  occasion: 0,
  color: 1,
  priceRange: 1,
  discountRange: 1,
};

// All facet IDs in schema order
export const FACET_IDS = [
  'productType', 'fabric', 'work', 'occasion',
  'color', 'priceRange', 'discountRange',
] as const;

export type FacetId = (typeof FACET_IDS)[number];

// Helper: get the combined mask for all bits in a facet
export function getFacetFullMask(facetId: FacetId): number {
  const schema = BITMASK_SCHEMA[facetId];
  const values = Object.values(schema.values) as number[];
  let mask = 0;
  for (const v of values) {
    mask |= v;
  }
  return mask;
}
