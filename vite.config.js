import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "drawdb",
      filename: "remoteEntry.js",
      exposes: {
        "./Editor": "./src/remoteEntry.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^17.0.2",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^17.0.2",
        },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
