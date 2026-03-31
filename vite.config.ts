import { defineConfig } from 'vite';

export default defineConfig({
  base: '/kidult_art/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
