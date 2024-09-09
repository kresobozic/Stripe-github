import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Set the base path if the app is served from a subdirectory like /payment
  build: {
    outDir: "dist", // Output directory for the build
    assetsDir: "assets", // Directory within outDir to place assets
  },
  server: {
    port: 5173, // Development server port
  },
});
