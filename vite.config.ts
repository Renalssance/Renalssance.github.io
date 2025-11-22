import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // Base path is essential for GitHub Pages (usually /repo-name/)
    // Setting it to './' allows it to work in any subdirectory.
    base: './',
    define: {
      // Polyfill process.env.API_KEY so it works in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});