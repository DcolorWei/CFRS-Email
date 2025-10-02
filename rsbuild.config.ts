import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'Email System',
  },
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './client/index.tsx',
    },
  },
  server: {
    proxy: {
      '/api': {
        // 目标服务器地址
        target: 'http://127.0.0.1:61206',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://127.0.0.1:61207',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
