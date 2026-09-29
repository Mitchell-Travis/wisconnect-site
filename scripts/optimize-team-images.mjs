// Regenerate the supplied/revised square team portraits without touching originals.
// Run from the repository root: node scripts/optimize-team-images.mjs
import sharp from 'sharp';

const portraits = [
  ['Elizabeth L. Carter.png', 'elizabeth-carter'],
  ['nikki-studio-source.png', 'nikki'],
  ['tiffany-studio-source.png', 'tiffany'],
  ['brandi-studio-source.png', 'brandi'],
];

for (const [source, name] of portraits) {
  for (const width of [480, 800]) {
    await sharp(`public/assets/${source}`).rotate()
      .resize({ width, height: width, fit: 'contain' })
      .webp({ quality: 84 })
      .toFile(`public/assets/${name}-studio-${width}.webp`);
  }
}
