import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://collaboratex.onrender.com/',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      // ...
      "simple-peer": "simple-peer/simplepeer.min.js",
    },
  },
})