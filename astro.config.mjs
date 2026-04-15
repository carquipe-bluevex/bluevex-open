import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",
  site: "https://bluevex.tech",
  compressHTML: true,
  vite: {
    build: {
      sourcemap: false,
      minify: "esbuild",
    },
  },
  adapter: vercel(),
  integrations: [],
});
