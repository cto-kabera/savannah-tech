import { defineConfig } from 'astro/config';;

import preact from '@astrojs/preact';

// Set `site` to your real domain before deploying (used for canonical URLs / sitemap).
export default defineConfig({
  // base: 'savannah-tech',
  site: 'https://cto-kabera.github.io',

  integrations: [preact()],
});