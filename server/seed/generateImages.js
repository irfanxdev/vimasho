/**
 * Generates original, offline product-catalog artwork for the VIMASHO seed data.
 *
 * These are stylised flat-illustration garment silhouettes (fashion-croquis style),
 * not photographs — drawn entirely as SVG shapes so the demo catalog works with zero
 * external network calls and zero copyright risk. Swap them for real photography any
 * time via the Admin product form's image upload.
 *
 * Run: node seed/generateImages.js
 * Output: server/public/catalog/*.svg
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'catalog');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 700;
const H = 900;
const GOLD = '#BF9B30';
const GOLD_DARK = '#8F7222';

// ---- color helpers ----
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
function rgbToHex({ r, g, b }) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
function shade(hex, amount) {
  // amount negative = darker, positive = lighter
  const { r, g, b } = hexToRgb(hex);
  const f = amount < 0 ? amount + 1 : amount;
  const blend = (channel, target) => channel + (target - channel) * Math.abs(amount);
  if (amount < 0) {
    return rgbToHex({ r: r * (1 + amount), g: g * (1 + amount), b: b * (1 + amount) });
  }
  return rgbToHex({ r: blend(r, 255), g: blend(g, 255), b: blend(b, 255) });
}
function readableIsLight(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// ---- shared backdrop: soft studio-style sand backdrop with a floor shadow ----
function backdrop(id) {
  return `
    <defs>
      <linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F1E9D8" />
        <stop offset="100%" stop-color="#E4D8BE" />
      </linearGradient>
      <radialGradient id="shadow-${id}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00000022" />
        <stop offset="100%" stop-color="#00000000" />
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg-${id})" />
    <ellipse cx="${W / 2}" cy="${H - 90}" rx="180" ry="34" fill="url(#shadow-${id})" />
  `;
}

function buttons(cx, yTop, yBottom, count, fill) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const y = yTop + ((yBottom - yTop) / (count - 1)) * i;
    out += `<circle cx="${cx}" cy="${y}" r="4.5" fill="${fill}" />`;
  }
  return out;
}

function motif(cx, cy, scale = 1) {
  return `
    <g transform="translate(${cx},${cy}) scale(${scale})">
      <line x1="-26" y1="0" x2="-10" y2="0" stroke="${GOLD}" stroke-width="1.4" />
      <line x1="10" y1="0" x2="26" y2="0" stroke="${GOLD}" stroke-width="1.4" />
      <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" stroke="${GOLD}" stroke-width="1.4" fill="none" />
      <rect x="-2.5" y="-2.5" width="5" height="5" transform="rotate(45)" fill="${GOLD}" />
    </g>
  `;
}

// ---------- Garment templates ----------
// Each returns inner SVG markup (garment only); id used for gradient uniqueness.

function sherwani(id, color, { detail = false } = {}) {
  const dark = shade(color, -0.35);
  const cx = W / 2;
  const shoulderY = 260;
  const hemY = 760;
  const shoulderHalf = 130;
  const hemHalf = 175;
  return `
    ${backdrop(id)}
    <g>
      <!-- sleeves -->
      <path d="M ${cx - shoulderHalf} ${shoulderY + 10}
               C ${cx - shoulderHalf - 60} ${shoulderY + 120}, ${cx - shoulderHalf - 70} ${shoulderY + 260}, ${cx - shoulderHalf - 40} ${shoulderY + 340}
               L ${cx - shoulderHalf + 10} ${shoulderY + 320}
               C ${cx - shoulderHalf - 10} ${shoulderY + 220}, ${cx - shoulderHalf + 10} ${shoulderY + 100}, ${cx - shoulderHalf + 40} ${shoulderY + 30} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />
      <path d="M ${cx + shoulderHalf} ${shoulderY + 10}
               C ${cx + shoulderHalf + 60} ${shoulderY + 120}, ${cx + shoulderHalf + 70} ${shoulderY + 260}, ${cx + shoulderHalf + 40} ${shoulderY + 340}
               L ${cx + shoulderHalf - 10} ${shoulderY + 320}
               C ${cx + shoulderHalf + 10} ${shoulderY + 220}, ${cx + shoulderHalf - 10} ${shoulderY + 100}, ${cx + shoulderHalf - 40} ${shoulderY + 30} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />

      <!-- body: long coat, tapering out to hem -->
      <path d="M ${cx - shoulderHalf} ${shoulderY}
               Q ${cx} ${shoulderY - 30} ${cx + shoulderHalf} ${shoulderY}
               L ${cx + hemHalf} ${hemY}
               Q ${cx} ${hemY + 22} ${cx - hemHalf} ${hemY}
               Z"
            fill="${color}" stroke="${dark}" stroke-width="2.5" />

      <!-- center placket -->
      <line x1="${cx}" y1="${shoulderY + 15}" x2="${cx}" y2="${hemY - 10}" stroke="${dark}" stroke-width="1.5" />
      ${buttons(cx, shoulderY + 40, hemY - 60, 6, GOLD)}

      <!-- mandarin collar -->
      <path d="M ${cx - 46} ${shoulderY + 4} Q ${cx} ${shoulderY - 34} ${cx + 46} ${shoulderY + 4} L ${cx + 40} ${shoulderY + 24} Q ${cx} ${shoulderY - 4} ${cx - 40} ${shoulderY + 24} Z"
            fill="${dark}" />

      ${
        detail
          ? // zardozi-style embroidery dots near the collar/yoke for a "detail" shot
            Array.from({ length: 24 })
              .map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const r = 70 + (i % 3) * 14;
                const x = cx + Math.cos(angle) * r;
                const y = shoulderY + 60 + Math.sin(angle) * 26;
                return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="${GOLD}" opacity="0.85" />`;
              })
              .join('')
          : ''
      }

      ${motif(cx, hemY + 55)}
    </g>
  `;
}

function bandhgala(id, color) {
  const dark = shade(color, -0.35);
  const cx = W / 2;
  const shoulderY = 250;
  const hemY = 620;
  const shoulderHalf = 140;
  const hemHalf = 150;
  return `
    ${backdrop(id)}
    <g>
      <path d="M ${cx - shoulderHalf} ${shoulderY + 10}
               C ${cx - shoulderHalf - 55} ${shoulderY + 110}, ${cx - shoulderHalf - 60} ${shoulderY + 230}, ${cx - shoulderHalf - 30} ${shoulderY + 300}
               L ${cx - shoulderHalf + 15} ${shoulderY + 280}
               C ${cx - shoulderHalf - 5} ${shoulderY + 190}, ${cx - shoulderHalf + 15} ${shoulderY + 90}, ${cx - shoulderHalf + 42} ${shoulderY + 25} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />
      <path d="M ${cx + shoulderHalf} ${shoulderY + 10}
               C ${cx + shoulderHalf + 55} ${shoulderY + 110}, ${cx + shoulderHalf + 60} ${shoulderY + 230}, ${cx + shoulderHalf + 30} ${shoulderY + 300}
               L ${cx + shoulderHalf - 15} ${shoulderY + 280}
               C ${cx + shoulderHalf + 5} ${shoulderY + 190}, ${cx + shoulderHalf - 15} ${shoulderY + 90}, ${cx + shoulderHalf - 42} ${shoulderY + 25} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />

      <path d="M ${cx - shoulderHalf} ${shoulderY}
               Q ${cx} ${shoulderY - 26} ${cx + shoulderHalf} ${shoulderY}
               L ${cx + hemHalf} ${hemY}
               L ${cx - hemHalf} ${hemY}
               Z"
            fill="${color}" stroke="${dark}" stroke-width="2.5" />

      <line x1="${cx}" y1="${shoulderY + 12}" x2="${cx}" y2="${hemY - 10}" stroke="${dark}" stroke-width="1.5" />
      ${buttons(cx, shoulderY + 34, hemY - 40, 5, GOLD)}

      <path d="M ${cx - 42} ${shoulderY + 2} Q ${cx} ${shoulderY - 30} ${cx + 42} ${shoulderY + 2} L ${cx + 36} ${shoulderY + 22} Q ${cx} ${shoulderY - 2} ${cx - 36} ${shoulderY + 22} Z"
            fill="${dark}" />

      <!-- trousers hint below the jacket hem -->
      <rect x="${cx - 70}" y="${hemY}" width="140" height="200" fill="${shade(color, -0.15)}" opacity="0.9" />

      ${motif(cx, hemY + 230)}
    </g>
  `;
}

function kurta(id, color) {
  const dark = shade(color, -0.3);
  const cx = W / 2;
  const shoulderY = 240;
  const hemY = 720;
  const shoulderHalf = 120;
  const hemHalf = 190;
  return `
    ${backdrop(id)}
    <g>
      <path d="M ${cx - shoulderHalf} ${shoulderY + 10}
               C ${cx - shoulderHalf - 50} ${shoulderY + 100}, ${cx - shoulderHalf - 55} ${shoulderY + 200}, ${cx - shoulderHalf - 25} ${shoulderY + 260}
               L ${cx - shoulderHalf + 15} ${shoulderY + 240}
               C ${cx - shoulderHalf - 5} ${shoulderY + 160}, ${cx - shoulderHalf + 10} ${shoulderY + 80}, ${cx - shoulderHalf + 35} ${shoulderY + 20} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />
      <path d="M ${cx + shoulderHalf} ${shoulderY + 10}
               C ${cx + shoulderHalf + 50} ${shoulderY + 100}, ${cx + shoulderHalf + 55} ${shoulderY + 200}, ${cx + shoulderHalf + 25} ${shoulderY + 260}
               L ${cx + shoulderHalf - 15} ${shoulderY + 240}
               C ${cx + shoulderHalf + 5} ${shoulderY + 160}, ${cx + shoulderHalf - 10} ${shoulderY + 80}, ${cx + shoulderHalf - 35} ${shoulderY + 20} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />

      <path d="M ${cx - shoulderHalf} ${shoulderY}
               Q ${cx} ${shoulderY - 20} ${cx + shoulderHalf} ${shoulderY}
               L ${cx + hemHalf} ${hemY}
               L ${cx + hemHalf - 26} ${hemY + 34}
               L ${cx + hemHalf - 40} ${hemY}
               L ${cx - hemHalf + 40} ${hemY}
               L ${cx - hemHalf + 26} ${hemY + 34}
               L ${cx - hemHalf} ${hemY}
               Z"
            fill="${color}" stroke="${dark}" stroke-width="2.5" />

      <path d="M ${cx - 30} ${shoulderY + 6} Q ${cx} ${shoulderY + 30} ${cx + 30} ${shoulderY + 6}"
            fill="none" stroke="${dark}" stroke-width="2" />
      <line x1="${cx}" y1="${shoulderY + 20}" x2="${cx}" y2="${shoulderY + 140}" stroke="${dark}" stroke-width="1.5" />
      ${buttons(cx, shoulderY + 34, shoulderY + 120, 4, GOLD)}

      ${motif(cx, hemY + 60)}
    </g>
  `;
}

function nehruJacket(id, color) {
  const dark = shade(color, -0.35);
  const cx = W / 2;
  const shoulderY = 300;
  const hemY = 620;
  const shoulderHalf = 130;
  const hemHalf = 145;
  return `
    ${backdrop(id)}
    <g>
      <path d="M ${cx - shoulderHalf} ${shoulderY}
               Q ${cx} ${shoulderY - 24} ${cx + shoulderHalf} ${shoulderY}
               L ${cx + hemHalf} ${hemY}
               L ${cx - hemHalf} ${hemY}
               Z"
            fill="${color}" stroke="${dark}" stroke-width="2.5" />

      <!-- armholes (sleeveless) -->
      <path d="M ${cx - shoulderHalf} ${shoulderY} Q ${cx - shoulderHalf + 34} ${shoulderY + 60} ${cx - shoulderHalf + 10} ${shoulderY + 150}"
            fill="none" stroke="${dark}" stroke-width="2" />
      <path d="M ${cx + shoulderHalf} ${shoulderY} Q ${cx + shoulderHalf - 34} ${shoulderY + 60} ${cx + shoulderHalf - 10} ${shoulderY + 150}"
            fill="none" stroke="${dark}" stroke-width="2" />

      <line x1="${cx}" y1="${shoulderY + 12}" x2="${cx}" y2="${hemY - 10}" stroke="${dark}" stroke-width="1.5" />
      ${buttons(cx, shoulderY + 30, hemY - 30, 5, GOLD)}

      <path d="M ${cx - 38} ${shoulderY + 2} Q ${cx} ${shoulderY - 28} ${cx + 38} ${shoulderY + 2} L ${cx + 32} ${shoulderY + 20} Q ${cx} ${shoulderY} ${cx - 32} ${shoulderY + 20} Z"
            fill="${dark}" />

      <!-- gold trim along collar and hem, referenced in the product name -->
      <path d="M ${cx - 38} ${shoulderY + 2} Q ${cx} ${shoulderY - 28} ${cx + 38} ${shoulderY + 2}" fill="none" stroke="${GOLD}" stroke-width="1.5" />
      <line x1="${cx - hemHalf + 6}" y1="${hemY - 4}" x2="${cx + hemHalf - 6}" y2="${hemY - 4}" stroke="${GOLD}" stroke-width="1.5" />

      ${motif(cx, hemY + 60)}
    </g>
  `;
}

function indoWestern(id, color) {
  const dark = shade(color, -0.3);
  const cx = W / 2;
  const shoulderY = 250;
  const hemY = 700;
  const shoulderHalf = 115;
  return `
    ${backdrop(id)}
    <g>
      <path d="M ${cx - shoulderHalf} ${shoulderY + 10}
               C ${cx - shoulderHalf - 45} ${shoulderY + 100}, ${cx - shoulderHalf - 50} ${shoulderY + 200}, ${cx - shoulderHalf - 20} ${shoulderY + 250}
               L ${cx - shoulderHalf + 15} ${shoulderY + 230}
               C ${cx - shoulderHalf - 5} ${shoulderY + 150}, ${cx - shoulderHalf + 10} ${shoulderY + 80}, ${cx - shoulderHalf + 32} ${shoulderY + 20} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />
      <path d="M ${cx + shoulderHalf} ${shoulderY + 10}
               C ${cx + shoulderHalf + 45} ${shoulderY + 100}, ${cx + shoulderHalf + 50} ${shoulderY + 200}, ${cx + shoulderHalf + 20} ${shoulderY + 250}
               L ${cx + shoulderHalf - 15} ${shoulderY + 230}
               C ${cx + shoulderHalf + 5} ${shoulderY + 150}, ${cx + shoulderHalf - 10} ${shoulderY + 80}, ${cx + shoulderHalf - 32} ${shoulderY + 20} Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />

      <!-- asymmetric hem body -->
      <path d="M ${cx - shoulderHalf} ${shoulderY}
               Q ${cx} ${shoulderY - 22} ${cx + shoulderHalf} ${shoulderY}
               L ${cx + 165} ${hemY - 60}
               L ${cx + 100} ${hemY - 40}
               L ${cx - 170} ${hemY}
               Z"
            fill="${color}" stroke="${dark}" stroke-width="2.5" />

      <!-- drape fold accent -->
      <path d="M ${cx + 20} ${shoulderY + 40} Q ${cx + 90} ${shoulderY + 220} ${cx + 60} ${hemY - 70}"
            fill="none" stroke="${dark}" stroke-width="1.6" opacity="0.7" />
      <path d="M ${cx - 10} ${shoulderY + 40} Q ${cx - 70} ${shoulderY + 220} ${cx - 40} ${hemY - 30}"
            fill="none" stroke="${dark}" stroke-width="1.6" opacity="0.5" />

      <line x1="${cx}" y1="${shoulderY + 16}" x2="${cx}" y2="${shoulderY + 200}" stroke="${GOLD}" stroke-width="1.6" />

      ${motif(cx, hemY + 40)}
    </g>
  `;
}

function stole(id, color) {
  const dark = shade(color, -0.25);
  const cx = W / 2;
  return `
    ${backdrop(id)}
    <g>
      <path d="M 140 300 C 260 260, 340 420, 460 380 S 620 300, 560 260
               L 560 300 C 600 340, 520 420, 440 420 S 280 320, 200 360 Z"
            fill="${color}" stroke="${dark}" stroke-width="2" />
      <path d="M 150 300 C 130 340, 120 380, 100 400" stroke="${dark}" stroke-width="1.4" fill="none" />
      <path d="M 165 320 C 145 355, 135 390, 118 410" stroke="${dark}" stroke-width="1.4" fill="none" />
      <path d="M 560 260 C 590 290, 610 320, 615 350" stroke="${dark}" stroke-width="1.4" fill="none" />
      <path d="M 545 245 C 575 270, 598 300, 605 330" stroke="${dark}" stroke-width="1.4" fill="none" />
      ${Array.from({ length: 10 })
        .map((_, i) => `<circle cx="${230 + i * 26}" cy="${330 + (i % 2 === 0 ? -6 : 6)}" r="2" fill="${GOLD}" opacity="0.8" />`)
        .join('')}
      ${motif(cx, 520)}
    </g>
  `;
}

function jutti(id, color) {
  const dark = shade(color, -0.3);
  const sole = shade(color, -0.45);
  const cx = W / 2;
  return `
    ${backdrop(id)}
    <g transform="translate(${cx - 180}, 480)">
      <!-- sole -->
      <path d="M -10 78 C -14 96, 30 112, 110 110 L 330 96 C 358 94, 366 82, 352 70
               C 300 76, 200 82, 110 84 C 50 85, 6 82, -10 78 Z"
            fill="${sole}" stroke="${dark}" stroke-width="1.5" />
      <!-- upper body of the jutti, curving up to a pointed, slightly upturned toe -->
      <path d="M -6 76 C -10 40, 20 6, 90 -4 C 160 -12, 230 -6, 280 8
               C 320 20, 348 8, 366 -18 C 372 -30, 366 -40, 352 -34
               C 330 -24, 300 4, 250 10 C 190 18, 120 14, 66 30
               C 24 42, 2 58, -6 76 Z"
            fill="${color}" stroke="${dark}" stroke-width="2.2" />
      <!-- vamp seam -->
      <path d="M 40 46 C 80 24, 150 12, 210 16" fill="none" stroke="${dark}" stroke-width="1.4" opacity="0.8" />
      <!-- embroidered motif on the toe -->
      <circle cx="86" cy="30" r="13" fill="none" stroke="${GOLD}" stroke-width="1.6" />
      <circle cx="86" cy="30" r="4.5" fill="${GOLD}" />
      ${Array.from({ length: 5 })
        .map((_, i) => `<circle cx="${112 + i * 15}" cy="${24 - i * 2}" r="2" fill="${GOLD}" opacity="0.85" />`)
        .join('')}
    </g>
    ${motif(cx, 700)}
  `;
}

// ---------- Product -> garment mapping ----------
const jobs = [
  // Sherwani
  { file: 'sherwani-emerald-1', type: 'sherwani', color: '#0F2A1D' },
  { file: 'sherwani-emerald-2', type: 'sherwani', color: '#0F2A1D', detail: true },
  { file: 'sherwani-ivory-gold-1', type: 'sherwani', color: '#EADFC0' },
  { file: 'sherwani-maroon-1', type: 'sherwani', color: '#5B1A22' },

  // Bandhgala
  { file: 'bandhgala-charcoal-1', type: 'bandhgala', color: '#2B2B2B' },
  { file: 'bandhgala-bottlegreen-1', type: 'bandhgala', color: '#0F2A1D' },
  { file: 'bandhgala-beige-1', type: 'bandhgala', color: '#D8C7A1' },

  // Kurta sets
  { file: 'kurta-sage-1', type: 'kurta', color: '#4C6B58' },
  { file: 'kurta-rust-1', type: 'kurta', color: '#A85D3B' },
  { file: 'kurta-wine-1', type: 'kurta', color: '#5B1A22' },

  // Nehru jackets
  { file: 'nehru-deepgreen-1', type: 'nehru', color: '#0F2A1D' },
  { file: 'nehru-black-1', type: 'nehru', color: '#161513' },

  // Indo-western
  { file: 'indowestern-midnightblue-1', type: 'indowestern', color: '#1B2A3D' },

  // Accessories
  { file: 'stole-gold-1', type: 'stole', color: '#BF9B30' },
  { file: 'jutti-maroon-1', type: 'jutti', color: '#5B1A22' },

  // Category card representatives (used on Home page)
  { file: 'category-sherwani', type: 'sherwani', color: '#0F2A1D' },
  { file: 'category-bandhgala', type: 'bandhgala', color: '#2B2B2B' },
  { file: 'category-kurta', type: 'kurta', color: '#4C6B58' },
  { file: 'category-nehru', type: 'nehru', color: '#5B1A22' },
  { file: 'category-indowestern', type: 'indowestern', color: '#1B2A3D' },
  { file: 'category-accessories', type: 'stole', color: '#BF9B30' },
];

function render(job) {
  const id = job.file;
  switch (job.type) {
    case 'sherwani':
      return sherwani(id, job.color, { detail: job.detail });
    case 'bandhgala':
      return bandhgala(id, job.color);
    case 'kurta':
      return kurta(id, job.color);
    case 'nehru':
      return nehruJacket(id, job.color);
    case 'indowestern':
      return indoWestern(id, job.color);
    case 'stole':
      return stole(id, job.color);
    case 'jutti':
      return jutti(id, job.color);
    default:
      throw new Error(`Unknown garment type: ${job.type}`);
  }
}

jobs.forEach((job) => {
  const inner = render(job);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${inner}</svg>`;
  fs.writeFileSync(path.join(OUT_DIR, `${job.file}.svg`), svg, 'utf-8');
  console.log(`  ✓ ${job.file}.svg`);
});

// Craft/story banner used on the Home page
const craftSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <linearGradient id="craft-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#173824" />
      <stop offset="100%" stop-color="#0B1B12" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#craft-bg)" />
  ${Array.from({ length: 7 })
    .map((_, row) =>
      Array.from({ length: 9 })
        .map((_, col) => {
          const x = 40 + col * 132 + (row % 2 === 0 ? 0 : 66);
          const y = 40 + row * 122;
          return `<circle cx="${x}" cy="${y}" r="2.4" fill="${GOLD}" opacity="0.35" />`;
        })
        .join('')
    )
    .join('')}
  <g transform="translate(600,450)">
    <line x1="-220" y1="0" x2="-40" y2="0" stroke="${GOLD}" stroke-width="1.6" />
    <line x1="40" y1="0" x2="220" y2="0" stroke="${GOLD}" stroke-width="1.6" />
    <rect x="-28" y="-28" width="56" height="56" transform="rotate(45)" stroke="${GOLD}" stroke-width="1.8" fill="none" />
    <rect x="-11" y="-11" width="22" height="22" transform="rotate(45)" fill="${GOLD}" />
  </g>
  <text x="600" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#F5F0E1" letter-spacing="2">HAND-FINISHED, STITCH BY STITCH</text>
</svg>`;
fs.writeFileSync(path.join(OUT_DIR, 'craft-banner.svg'), craftSvg, 'utf-8');
console.log('  ✓ craft-banner.svg');

console.log(`\nDone. ${jobs.length + 1} SVG assets written to ${OUT_DIR}`);
