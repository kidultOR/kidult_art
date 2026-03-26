import { defineConfig } from 'vite';

export default defineConfig({
  base: '/kidult-art/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
