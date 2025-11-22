import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    // 基础路径配置，对于 GitHub Pages 部署至关重要
    // 设置为 './' 允许在任何子目录中工作
    base: './',
    define: {
      // 注入 process.env.API_KEY 环境变量，使其在浏览器端可用
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});