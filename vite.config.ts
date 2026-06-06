import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/gamebanana-today/' : '/',
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom)[\\/]/ },
            { name: 'ui-vendor', test: /node_modules[\\/](web-toolkit|lucide-react)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}));
