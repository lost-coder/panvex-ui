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
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
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
