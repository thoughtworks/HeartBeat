import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path/posix'

export default defineConfig({
  server: {
    port: 4321,
    proxy: {
      '/api/v1': 'http://localhost:4322',
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
    },
  },
})
