import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
// `vitest/config`, so vitest shares the app's alias and plugins.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Absolute imports from src/.
    alias: { src: '/src' },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      // One origin in dev: no CORS, and no API URL in the bundle.
      '/api': {
        changeOrigin: true,
        target: process.env.BACKEND_ORIGIN ?? 'http://localhost:8002',
      },
    },
    watch: {
      // Docker on macOS drops file events across the bind mount; without polling,
      // HMR silently stops.
      usePolling: true,
    },
  },
  test: {
    // Node, not jsdom: the tests cover pure functions, not rendering.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
