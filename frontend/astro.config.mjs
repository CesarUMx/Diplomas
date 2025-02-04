// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import auth from 'auth-astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), auth()],
  server: {
    port: 3001,
  },
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});