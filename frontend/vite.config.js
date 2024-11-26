import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host: true, // Enable access from all network interfaces
    port: 3000, // Optional: specify a port
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // Prompt user to install PWA
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MERN Authentication App',
        short_name: 'MERN Auth',
        description: 'MERN Stack Authentication Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Ensure this file exists in the public folder
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // Ensure this file exists in the public folder
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html', // Ensure SPA routes fallback to index.html
      },
    }),
  ],
});
