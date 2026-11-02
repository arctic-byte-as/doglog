import { fileURLToPath } from 'node:url';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfkit'],
  outputFileTracingIncludes: {
    '/api/consultations/*/pdf': ['./assets/fonts/pdf/*.ttf', './public/norsepaw-logo.png'],
    '/api/consultations/*/publish': ['./assets/fonts/pdf/*.ttf', './public/norsepaw-logo.png'],
  },
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
