// Generates source images for @capacitor/assets from the Copa ETec monogram.
// Run: node scripts/make-app-icons.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const OUT = 'assets'
mkdirSync(OUT, { recursive: true })

const BG = '#0b0b10'
const GOLD_TOP = '#fbbf24'
const GOLD_BOTTOM = '#b45309'

// The two foreground paths from public/icon.svg, authored in a 180x180 space.
const MARK = `
  <path d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" fill="url(#g)"/>
  <path d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" fill="url(#g)"/>
`

const grad = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GOLD_TOP}"/>
      <stop offset="1" stop-color="${GOLD_BOTTOM}"/>
    </linearGradient>
  </defs>`

// Mark on a transparent canvas of `size`, art occupying `scale` of the canvas, centered.
function markSvg(size, scale) {
  const art = size * scale
  const off = (size - art) / 2
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${grad}
    <g transform="translate(${off},${off}) scale(${art / 180})">${MARK}</g>
  </svg>`
}

function solid(size, color) {
  return sharp({ create: { width: size, height: size, channels: 4, background: color } }).png()
}

async function main() {
  // Adaptive icon background (full bleed) and foreground (art within the ~66% safe zone).
  await solid(1024, BG).toFile(`${OUT}/icon-background.png`)
  await sharp(Buffer.from(markSvg(1024, 0.52))).png().toFile(`${OUT}/icon-foreground.png`)

  // Legacy / web / round icon: background + mark composited.
  await solid(1024, BG)
    .composite([{ input: Buffer.from(markSvg(1024, 0.6)) }])
    .toFile(`${OUT}/icon.png`)

  // Splash screens (light + dark both use the dark brand background).
  for (const name of ['splash.png', 'splash-dark.png']) {
    await solid(2732, '#09090b')
      .composite([{ input: Buffer.from(markSvg(2732, 0.22)) }])
      .toFile(`${OUT}/${name}`)
  }

  console.log('Wrote icon + splash sources to', OUT + '/')
}

main()
