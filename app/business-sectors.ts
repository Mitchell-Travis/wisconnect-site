// Chicago sectors supplied by Elizabeth Carter on September 26, 2026.
export const sectors = ['Coffee shops','Day care','Shared kitchens','Food & Beverages','Wellness','Juice bars','Clothing stores','Screen printing'] as const;
export type Sector = (typeof sectors)[number];

// Only confirmed matches from the supplied Chicago business descriptions.
// Catering, apparel production and a Liberia juice business do not establish
// a Chicago restaurant, clothing store, screen printer or juice bar listing.
export const sectorBusinessIds: Partial<Record<Sector, string>> = {
  'Coffee shops': 'momentum',
  'Day care': 'bunnyland',
  'Shared kitchens': 'exquisite-kitchen',
  'Food & Beverages': 'momentum',
};
