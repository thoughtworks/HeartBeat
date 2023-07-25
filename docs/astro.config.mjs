import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import remarkPlantUML from '@akebifiky/remark-simple-plantuml';
import { remarkDiagram } from './remark-plugins/remark-diagram.mjs';
// https://astro.build/config
export default defineConfig({
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
  ],
  site: `https://thoughtworks.github.io/Heartbeat`,
  base: '/Heartbeat',
  publicDir: '/Heartbeat',
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remarkPlantUML, remarkDiagram],
  },
});
