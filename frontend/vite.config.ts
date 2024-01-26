import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path/posix';
import { defineConfig } from 'vite';

const pwdConfig = VitePWA({
  manifest: {
    name: 'Heartbeat',
    short_name: 'Heartbeat',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  },
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
    runtimeCaching: [
      {
        urlPattern: /(.*?)\.(js|css|ts)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'js-css-cache',
        },
      },
      {
        urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
        },
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
});

const basicConfig = {
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
    },
  },
};

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      ...basicConfig,
      plugins: [react()],
      server: {
        port: 4321,
        proxy: {
          '/api/v1': 'http://localhost:4322',
        },
      },
    };
  }

  return {
    ...basicConfig,
    plugins: [react(), pwdConfig],
  };
});
