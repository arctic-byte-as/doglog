import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fafcf7',
          100: '#eef6e4',
          200: '#d9eac7',
          300: '#b9d99a',
          400: '#8bc83f',
          500: '#72bd1f',
          600: '#3f982e',
          700: '#187735',
          800: '#12622d',
          900: '#545454',
          950: '#303030',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(48, 48, 48, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
