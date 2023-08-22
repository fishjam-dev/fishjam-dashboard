import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
// import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  base: "jellyfish-dashboard",
  server: {
    // https://vitejs.dev/config/server-options.html#server-host
    // true - listen on all addresses, including LAN and public addresses
    host: true,
    // https: true,
    port: 3001,
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint --ext .ts,.tsx",
      },
    }),
    // mkcert(),
  ],
});
