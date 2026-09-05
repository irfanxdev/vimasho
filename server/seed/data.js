// Seed data used only to populate the database for demo/dev purposes.
// The frontend never hardcodes this — it always reads from the API.
//
// Product/category images below are relative paths served by this same Express
// server from /catalog (see server/seed/generateImages.js) and /uploads — so the
// storefront works fully offline, with no dependency on any third-party image host.

const categories = [
  {
    name: 'Sherwani',
    slug: 'sherwani',
    parent: 'Wedding',
    description: 'Regal sherwanis for the wedding season.',
    image: '/catalog/category-sherwani.svg'
  },
  {
    name: 'Bandhgala',
    slug: 'bandhgala',
    parent: 'Wedding',
    description: 'Tailored bandhgala suits for grooms and guests.',
    image: '/catalog/category-bandhgala.svg'
  },
  {
    name: 'Kurta Sets',
    slug: 'kurta-sets',
    parent: 'Clothing',
    description: 'Everyday and festive kurta-pyjama sets.',
    image: '/catalog/category-kurta.svg'
  },
  {
    name: 'Nehru Jackets',
    slug: 'nehru-jackets',
    parent: 'Clothing',
    description: 'Layer-ready Nehru and Modi jackets.',
    image: '/catalog/category-nehru.svg'
  },
  {
    name: 'Indo Western',
    slug: 'indo-western',
    parent: 'Clothing',
    description: 'Contemporary fusion silhouettes.',
    image: '/catalog/category-indowestern.svg'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    parent: 'Accessories',
    description: 'Stoles, pocket squares, and juttis.',
    image: '/catalog/category-accessories.svg'
  }
];

// price in INR
const productsByCategory = {
  Sherwani: [
    {
      name: 'Emerald Zardozi Sherwani',
      fabric: 'Raw Silk',
      price: 24999,
      discountPrice: 21999,
      fit: 'Classic',
      occasion: ['Wedding', 'Reception'],
      description:
        'A deep emerald sherwani finished with hand-embroidered zardozi work along the collar and placket, paired with a matching churidar. Cut for a classic, structured silhouette suited to sangeet and reception functions.',
      shortDescription: 'Hand-embroidered emerald sherwani with churidar.',
      variants: [
        {
          color: 'Emerald Green',
          colorHex: '#0F2A1D',
          images: [
            '/catalog/sherwani-emerald-1.svg',
            '/catalog/sherwani-emerald-2.svg',
          ],
          sizes: [
            { size: 'S', stock: 4 },
            { size: 'M', stock: 8 },
            { size: 'L', stock: 6 },
            { size: 'XL', stock: 3 },
          ],
        },
        {
          color: 'Ivory Gold',
          colorHex: '#EADFC0',
          images: ['/catalog/sherwani-ivory-gold-1.svg'],
          sizes: [
            { size: 'M', stock: 5 },
            { size: 'L', stock: 5 },
            { size: 'XL', stock: 2 },
          ],
        },
      ],
      tags: ['sherwani', 'wedding', 'groom'],
      isFeatured: true,
    },
    {
      name: 'Maroon Silk Wedding Sherwani',
      fabric: 'Banarasi Silk',
      price: 27999,
      fit: 'Slim',
      occasion: ['Wedding'],
      description:
        'Woven Banarasi silk sherwani in a deep maroon, with self-tone jacquard detailing and gold buttons. A slim silhouette designed for the baraat and wedding ceremony.',
      shortDescription: 'Banarasi silk sherwani with jacquard weave.',
      variants: [
        {
          color: 'Maroon',
          colorHex: '#5B1A22',
          images: ['/catalog/sherwani-maroon-1.svg'],
          sizes: [
            { size: 'S', stock: 3 },
            { size: 'M', stock: 6 },
            { size: 'L', stock: 4 },
          ],
        },
      ],
      tags: ['sherwani', 'wedding', 'silk'],
      isFeatured: true,
    },
  ],
  Bandhgala: [
    {
      name: 'Charcoal Crepe Bandhgala',
      fabric: 'Crepe',
      price: 18999,
      discountPrice: 15999,
      fit: 'Slim',
      occasion: ['Reception', 'Formal'],
      description:
        'A tailored charcoal bandhgala in fine crepe with a mandarin collar and concealed placket. Comes with matching trousers for a sharp, formal profile.',
      shortDescription: 'Slim-fit charcoal bandhgala with matching trousers.',
      variants: [
        {
          color: 'Charcoal',
          colorHex: '#2B2B2B',
          images: ['/catalog/bandhgala-charcoal-1.svg'],
          sizes: [
            { size: 'M', stock: 7 },
            { size: 'L', stock: 7 },
            { size: 'XL', stock: 4 },
          ],
        },
        {
          color: 'Bottle Green',
          colorHex: '#0F2A1D',
          images: ['/catalog/bandhgala-bottlegreen-1.svg'],
          sizes: [
            { size: 'S', stock: 4 },
            { size: 'M', stock: 5 },
            { size: 'L', stock: 3 },
          ],
        },
      ],
      tags: ['bandhgala', 'formal'],
      isNewArrival: true,
    },
    {
      name: 'Beige Textured Bandhgala Set',
      fabric: 'Linen Blend',
      price: 16999,
      fit: 'Regular',
      occasion: ['Festive', 'Formal'],
      description:
        'A breathable linen-blend bandhgala in warm beige, finished with horn buttons and a textured weave. Built for day functions and festive gatherings.',
      shortDescription: 'Breathable linen-blend bandhgala in beige.',
      variants: [
        {
          color: 'Beige',
          colorHex: '#D8C7A1',
          images: ['/catalog/bandhgala-beige-1.svg'],
          sizes: [
            { size: 'M', stock: 6 },
            { size: 'L', stock: 6 },
          ],
        },
      ],
      tags: ['bandhgala', 'festive'],
      isNewArrival: true,
    },
  ],
  'Kurta Sets': [
    {
      name: 'Sage Green Cotton Kurta Set',
      fabric: 'Cotton',
      price: 3499,
      fit: 'Regular',
      occasion: ['Casual', 'Festive'],
      description:
        'An easy, breathable cotton kurta-pyjama set in sage green with subtle thread embroidery at the yoke. Everyday festive wear that stays comfortable through long functions.',
      shortDescription: 'Breathable cotton kurta set with thread embroidery.',
      variants: [
        {
          color: 'Sage Green',
          colorHex: '#4C6B58',
          images: ['/catalog/kurta-sage-1.svg'],
          sizes: [
            { size: 'S', stock: 10 },
            { size: 'M', stock: 14 },
            { size: 'L', stock: 12 },
            { size: 'XL', stock: 8 },
          ],
        },
        {
          color: 'Rust',
          colorHex: '#A85D3B',
          images: ['/catalog/kurta-rust-1.svg'],
          sizes: [
            { size: 'M', stock: 9 },
            { size: 'L', stock: 9 },
          ],
        },
      ],
      tags: ['kurta', 'cotton', 'casual'],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: 'Gold Thread-Work Festive Kurta',
      fabric: 'Silk Blend',
      price: 5999,
      fit: 'Classic',
      occasion: ['Festive', 'Sangeet'],
      description:
        'A silk-blend kurta set with gold thread-work along the placket and hemline, designed for Diwali, sangeet and other festive evenings.',
      shortDescription: 'Silk-blend kurta with gold thread-work.',
      variants: [
        {
          color: 'Wine',
          colorHex: '#5B1A22',
          images: ['/catalog/kurta-wine-1.svg'],
          sizes: [
            { size: 'S', stock: 6 },
            { size: 'M', stock: 10 },
            { size: 'L', stock: 8 },
          ],
        },
      ],
      tags: ['kurta', 'festive', 'sangeet'],
    },
  ],
  'Nehru Jackets': [
    {
      name: 'Gold-Trim Velvet Nehru Jacket',
      fabric: 'Velvet',
      price: 7499,
      fit: 'Slim',
      occasion: ['Festive', 'Reception'],
      description:
        'A rich velvet Nehru jacket with a fine gold trim along the collar, meant to be layered over a kurta for an instant festive lift.',
      shortDescription: 'Velvet Nehru jacket with gold trim.',
      variants: [
        {
          color: 'Deep Green',
          colorHex: '#0F2A1D',
          images: ['/catalog/nehru-deepgreen-1.svg'],
          sizes: [
            { size: 'M', stock: 8 },
            { size: 'L', stock: 8 },
            { size: 'XL', stock: 5 },
          ],
        },
        {
          color: 'Black',
          colorHex: '#161513',
          images: ['/catalog/nehru-black-1.svg'],
          sizes: [
            { size: 'S', stock: 5 },
            { size: 'M', stock: 7 },
          ],
        },
      ],
      tags: ['jacket', 'nehru', 'layering'],
      isFeatured: true,
    },
  ],
  'Indo Western': [
    {
      name: 'Asymmetric Drape Indo-Western Set',
      fabric: 'Georgette Blend',
      price: 12999,
      fit: 'Slim',
      occasion: ['Sangeet', 'Reception'],
      description:
        'A contemporary asymmetric-hem tunic with draped detailing, paired with slim trousers, for a fusion silhouette suited to sangeet and cocktail functions.',
      shortDescription: 'Fusion tunic with asymmetric drape detailing.',
      variants: [
        {
          color: 'Midnight Blue',
          colorHex: '#1B2A3D',
          images: ['/catalog/indowestern-midnightblue-1.svg'],
          sizes: [
            { size: 'S', stock: 4 },
            { size: 'M', stock: 6 },
            { size: 'L', stock: 5 },
          ],
        },
      ],
      tags: ['indo-western', 'fusion', 'sangeet'],
      isNewArrival: true,
    },
  ],
  Accessories: [
    {
      name: 'Hand-Woven Gold Stole',
      fabric: 'Silk',
      price: 2499,
      fit: 'Regular',
      occasion: ['Wedding', 'Festive'],
      description:
        'A hand-woven silk stole in gold, finished with a fine border, meant to be draped over a sherwani or bandhgala for ceremony functions.',
      shortDescription: 'Hand-woven silk stole with gold border.',
      variants: [
        {
          color: 'Gold',
          colorHex: '#BF9B30',
          images: ['/catalog/stole-gold-1.svg'],
          sizes: [{ size: 'S', stock: 20 }],
        },
      ],
      tags: ['stole', 'accessory'],
    },
    {
      name: 'Embroidered Nehru Jutti',
      fabric: 'Leather & Thread',
      price: 1999,
      fit: 'Regular',
      occasion: ['Wedding', 'Festive'],
      description:
        'Handcrafted juttis with gold thread embroidery over a cushioned leather sole, built for full-day wear through ceremony functions.',
      shortDescription: 'Handcrafted embroidered juttis, cushioned sole.',
      variants: [
        {
          color: 'Maroon',
          colorHex: '#5B1A22',
          images: ['/catalog/jutti-maroon-1.svg'],
          sizes: [
            { size: 'S', stock: 12 },
            { size: 'M', stock: 15 },
            { size: 'L', stock: 10 },
          ],
        },
      ],
      tags: ['jutti', 'footwear', 'accessory'],
    },
  ],
};

module.exports = { categories, productsByCategory };
