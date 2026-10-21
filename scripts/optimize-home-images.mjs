// Run with node scripts/optimize-home-images.mjs. Originals stay untouched.
import sharp from 'sharp';

const visionaryPortraits = [
  'ade-wede', 'brandi', 'chipo', 'elizabeth-carter', 'elizabeth',
  'kailyn', 'nikki', 'priscilla', 'rahel', 'sikola', 'tiffany',
];
for (const name of visionaryPortraits) {
  await sharp(`public/assets/${name}-studio-480.webp`).resize({ width: 320 }).webp({ quality: 82 })
    .toFile(`public/assets/${name}-studio-320.webp`);
}
for (const width of [480, 640]) {
  await sharp('public/assets/hero-shared-enterprise-960.webp').resize({ width }).webp({ quality: 82 })
    .toFile(`public/assets/hero-shared-enterprise-${width}.webp`);
}
await sharp('public/assets/Royal Purple and Gold Ornamental Textile.png')
  .resize({ width: 1000 }).webp({ quality: 78 })
  .toFile('public/assets/royal-purple-gold-textile.webp');
await sharp('public/assets/wisconnect-logo-approved.png').resize({ width: 320 }).webp({ quality: 88 })
  .toFile('public/assets/wisconnect-logo-approved-320.webp');
await sharp('public/assets/momentum-coffee-logo-trimmed.png').resize({ width: 640 }).webp({ quality: 86 })
  .toFile('public/assets/momentum-coffee-logo-640.webp');
for (const width of [640, 960]) {
  await sharp('public/assets/hero-visionary.webp').resize({ width }).webp({ quality: 84 })
    .toFile(`public/assets/hero-visionary-${width}.webp`);
}
for (const width of [640, 1080]) {
  await sharp('public/assets/Confident portrait in orange blazer.png').resize({ width }).webp({ quality: 84 })
    .toFile(`public/assets/belief-orange-${width}.webp`);
}
await sharp('public/assets/logo-horizontal.webp').resize({ width: 480 }).webp({ quality: 88 })
  .toFile('public/assets/logo-nav.webp');
