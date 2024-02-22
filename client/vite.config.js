import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import manifest from './manifest';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/eintraege': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5555,
    proxy: {
      '/eintraege': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    VitePWA({
      manifest,
      includeAssets: ['*/.{jjs,css,html,ico,woff,woff2,oet,ttf,svg,png,jpg,jpeg,json}'],
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
    }),

    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: '../server/public',
    emptyOutDir: false,
  },
});
