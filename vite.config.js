import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    // open: true,
    strictPort: true,
    hmr: true,
    proxy: {
      "/api": {
        target: "https://api.goktech.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/vod": {
        target: "https://vod.goktech.cn",
        changeOrigin: true,
        headers: {
          referer: "https://edu.goktech.cn/",
          origin: "https://edu.goktech.cn/",
        },
        rewrite: (path) => path.replace(/^\/vod/, ""),
      },
      "/obs": {
        target: "https://obs.goktech.cn",
        changeOrigin: true,
        headers: {
          referer: "https://edu.goktech.cn/",
          origin: "https://edu.goktech.cn/",
        },
        rewrite: (path) => path.replace(/^\/obs/, ""),
      },
    },
  },
});
