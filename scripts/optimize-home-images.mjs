// Run with node scripts/optimize-home-images.mjs. Originals stay untouched.
import sharp from 'sharp';

const portraits = [
  ['Ade-Wede-photo-option-2-soft-studio.png', 'ade-wede'],
  ['Smiling shaved-head portrait with colorful jewelry.png', 'chipo'],
  ['Red-bloused portrait on a warm ivory backdrop.png', 'elizabeth'],
  ['Yellow headwrap portrait with gold neck rings.png', 'priscilla'],
];

for (const [source, name] of portraits) {
  for (const width of [480, 800]) {
    await sharp(`public/assets/${source}`).resize({ width }).webp({ quality: 82 })
      .toFile(`public/assets/${name}-${width}.webp`);
  }
}
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
