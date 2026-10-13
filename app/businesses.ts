import catalog from './business-catalog.json';

export type BusinessVisual = { name: string; sub: string; tone: string; poster: string; group: string; image: string; alt: string };
export type PublicBusiness = { id: string; name: string; person: string | null; country: string; location: string; sector: string; description: string; profile: string | null; visual: BusinessVisual; public_email: string; public_phone: string; website: string };
// Approved static snapshot for the public Pages export. Local previews read published API records.
export const businesses: PublicBusiness[] = [...catalog].sort((a,b)=>a.name.localeCompare(b.name));
