import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";

import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "react-router" {
  interface Future {
    v3_singleFetch: true;
    v3_fetcherPersist: true;
    v3_lazyRouteDiscovery: true;
    v3_relativeSplatPath: true;
    v3_throwAbortReason: true;
  }
}

export default defineConfig({
  build: {
    cssMinify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV === "development",
    commonjsOptions: {
      include: [/web/, /server/, /node_modules/],
    },
    rollupOptions: {
      external: ["buffer"],
    },
  },
  plugins: [
    envOnlyMacros(),
    tailwindcss(),
    tsconfigPaths({}),
    reactRouterDevTools(),
    reactRouter(),
    nodePolyfills({ include: ["buffer"] }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer"],
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      Buffer: "buffer",
      buffer: "buffer",
      process: "process/browser",
      events: "events",
      stream: "stream-browserify",
      util: "util",
    },
  },
  define: {
    "process.env.NODE_DEBUG": "false",
    global: {},
  },
});
