import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://delicate-meringue-65cf1f.netlify.app',
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
