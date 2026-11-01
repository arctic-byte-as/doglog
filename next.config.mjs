import { fileURLToPath } from 'node:url';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfkit'],
  outputFileTracingIncludes: { '/api/consultations/*/pdf': ['./assets/fonts/pdf/*.ttf'] },
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};

export default nextConfig;
