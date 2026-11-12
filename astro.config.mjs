import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import { quoteApi } from './src/server/quote-store.js';

// GitHub Pages serves the project site under /savannah-tech.
// Vercel serves the same files from the domain root.
const onVercel = process.env.VERCEL === '1';
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

// Set `site` to your real domain before deploying (used for canonical URLs / sitemap).
export default defineConfig({
  site: onVercel && vercelHost ? `https://${vercelHost}` : 'https://cto-kabera.github.io',
  base: onVercel ? '/' : '/savannah-tech',
  output: 'static',

  integrations: [preact()],
  vite: {
    plugins: [quoteApi()],
  },
});