import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('/src/views/')) {
            return `views/${id.split('src/views/')[1].split('.')[0]}`;
          }
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vendor-vue';
            }
            if (
              id.includes('reka-ui') ||
              id.includes('vaul-vue') ||
              id.includes('lucide-vue-next') ||
              id.includes('@iconify/vue')
            ) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
          return 'app';
        },
      },
    },
  },
});
