import { defineConfig } from "vite";
import copy from 'vite-plugin-cp';

export default defineConfig({
  build: {
    target: ["chrome110"],
    sourcemap: true,
    outDir: "dist",
    assetsInlineLimit: 0,
    lib: {
      entry: "./src/index.ts",
      name: "bundlejs"
    },
    rollupOptions: {
      output: [
        {
          format: "es",
          chunkFileNames: "[name]-[hash].mjs",
          entryFileNames: "[name].mjs",
        },
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name]-[hash].cjs",
        },
        {
          format: "umd",
          entryFileNames: "[name].js",
          inlineDynamicImports: true,
          name: "bundlejs"
        }
      ],
      plugins: [
        copy({
          targets: [
            // @ts-ignore
            { src: 'src/esbuild.wasm', dest: './dist' },
          ]
        })
      ],
      external: ["esbuild"]
    },
  },
});
