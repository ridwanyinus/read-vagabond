// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: "cloudflare",
  }),

  // Enable SSR for all pages
  output: "server",

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize chunk size for better caching
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
