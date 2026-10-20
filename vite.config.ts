import { defineConfig } from "vite";
import pkg from "./package.json";

// Dev: `npm run dev` serves dev/index.html with a mock Home Assistant.
// Build: a tiny entry (smartnest-pro-panel.js) plus hashed chunks and fonts, served by the integration.
export default defineConfig(({ command }) => ({
  root: ".",
  // Fonts are referenced by URL, so the build needs the path HA serves the frontend folder from.
  base: command === "build" ? "/smartnest_pro_static/" : "/",
  define: { __SN_VERSION__: JSON.stringify(pkg.version) },
  publicDir: "custom_components/smartnest_pro/frontend",
  server: { port: 5175 },
  build: {
    outDir: "custom_components/smartnest_pro/frontend",
    emptyOutDir: false,
    copyPublicDir: false,
    modulePreload: false,
    target: "es2021",
    minify: "terser",
    terserOptions: { format: { comments: false } },
    assetsInlineLimit: 0,
    rollupOptions: {
      input: "src/main.ts",
      output: {
        format: "es",
        entryFileNames: "smartnest-pro-panel.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: (id) => (id.includes("preload-helper") ? "loader" : undefined),
      },
    },
  },
}));
