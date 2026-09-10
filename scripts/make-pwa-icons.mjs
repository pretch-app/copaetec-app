// Generates PWA / Apple home-screen icons into public/ from the Copa ETec monogram.
// Run: node scripts/make-pwa-icons.mjs
import sharp from 'sharp'

const BG = '#0b0b10'
const GOLD_TOP = '#fbbf24'
const GOLD_BOTTOM = '#b45309'

const MARK = `
  <path d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" fill="url(#g)"/>
  <path d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" fill="url(#g)"/>
`
const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${GOLD_TOP}"/><stop offset="1" stop-color="${GOLD_BOTTOM}"/>
</linearGradient></defs>`

// size px, mark occupying `scale` of the canvas, on the brand background.
function iconPng(size, scale) {
  const art = size * scale
  const off = (size - art) / 2
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${BG}"/>
    ${grad}
    <g transform="translate(${off},${off}) scale(${art / 180})">${MARK}</g>
  </svg>`
  return sharp(Buffer.from(svg)).png()
}

const targets = [
  ['public/icon-192.png', 192, 0.62],
  ['public/icon-512.png', 512, 0.62],
  // Maskable: extra padding so Android's mask never clips the mark.
  ['public/icon-maskable-512.png', 512, 0.46],
  // Apple home-screen icon (no transparency, no rounding — iOS rounds it).
  ['public/apple-icon.png', 180, 0.6],
]

for (const [file, size, scale] of targets) {
  await iconPng(size, scale).toFile(file)
  console.log('wrote', file)
}
