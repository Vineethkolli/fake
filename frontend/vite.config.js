import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';

  return {
    server: {
      host: true, // Allow access from all network interfaces
      port: 3000, // Set default port
      open: true, // Automatically open the app in the browser
      proxy: {
        // Proxy API requests during development
        '/api': {
          target: 'https://fake-red.vercel.app', // Replace with your backend URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '') // Optional: rewrite paths
        }
      }
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
          enabled: isDevelopment, // Enable PWA dev tools in development mode
          type: 'module',
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [
            /^\/api\//, // Exclude API routes from fallback
            /^\/admin\// // Exclude admin routes from fallback
          ]
        }
      })
    ],
    build: {
      outDir: 'dist', // Output directory for the build
      sourcemap: isDevelopment, // Enable source maps only in development
      rollupOptions: {
        // Additional optimizations or overrides
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
    envPrefix: ['VITE_'], // Prefix for environment variables
    define: {
      // Define global constants for the app
      __APP_ENV__: JSON.stringify(mode)
    }
  };
});
