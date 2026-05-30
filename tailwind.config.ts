import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7ef',
          100: '#dff1dd',
          200: '#bfe2b7',
          300: '#96d187',
          400: '#69b959',
          500: '#5d9f45',
          600: '#4a7b36',
          700: '#39602b',
          800: '#314d23',
          900: '#223919',
          950: '#152410',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
