import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    server: {
      host: true, // Enable access from all network interfaces
      port: 3000, // Set a default port
      open: true // Automatically open the app in the browser
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate', // Automatically update the service worker
        includeAssets: [
          'favicon.ico', 
          'apple-touch-icon.png', 
          'masked-icon.svg'
        ],
        manifest: {
          name: process.env.VITE_APP_NAME || 'MERN Authentication App',
          short_name: process.env.VITE_APP_SHORT_NAME || 'MERN Auth',
          description: process.env.VITE_APP_DESCRIPTION || 'MERN Stack Authentication Application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        devOptions: {
          enabled: isDevelopment,
          type: 'module',
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [
            /^\/api\//, // Prevent fallback for API routes
            /^\/admin\// // Prevent fallback for admin routes
          ]
        }
      })
    ],
    build: {
      outDir: 'dist', // Build output directory
      sourcemap: isDevelopment // Generate source maps in development
    }
  };
});
