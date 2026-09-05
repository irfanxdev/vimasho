/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0F2A1D',
          dark: '#081B12',
          light: '#173824',
        },
        gold: {
          DEFAULT: '#BF9B30',
          light: '#D9C27E',
          dark: '#8F7222',
        },
        ivory: '#F5F0E1',
        sage: '#4C6B58',
        charcoal: '#211F1C',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};
