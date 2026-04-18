import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    // P2-STYLE-01: Tailwind CSS v4 via the first-party Vite plugin.
    // Replaces the old PostCSS-based pipeline (postcss.config.js +
    // tailwindcss@3) and aligns with core/web which is already on v4.
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      // P3-FE-09: rollupTypes was causing dist/index.d.ts to contain only one
      // entry's rolled types when we added the pages/ sub-entry. Emitting the
      // raw per-file declarations keeps both entries correctly typed at the
      // cost of a slightly larger .d.ts footprint.
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      // P3-FE-09: multi-entry so consumers can import pages via a deep path
      // (@lost-coder/panvex-ui/pages) as a transitional bridge until core/web
      // recomposes page containers from primitives + compositions (P3-FE-01).
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "pages/index": resolve(__dirname, "src/pages/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: (id) =>
        id === "react" ||
        id === "react-dom" ||
        id === "react/jsx-runtime" ||
        id === "framer-motion" ||
        id.startsWith("framer-motion/") ||
        id === "motion" ||
        id.startsWith("motion/"),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (info) => {
          if (info.name?.endsWith(".css")) return "styles.css";
          return info.name!;
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
