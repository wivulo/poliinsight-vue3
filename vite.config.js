import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    nodePolyfills({
      include: ['path', 'fs', 'url', 'source-map-js'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      path: 'path-browserify',
      url: 'url-polyfill',
      'source-map-js': 'source-map', // Substitui por 'source-map' (puro para navegador)
    }
  },
  optimizeDeps: {
    include: ['source-map-js'],
  },
})