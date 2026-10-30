import { defineConfig } from "nitro";

export default defineConfig({
  database: {
    default: { connector: "bun-sqlite", options: { name: "store" } },
  },
  experimental: { database: true },
  features: { websocket: true },
  runtimeConfig: { app: { secret: "" }, upstream: { url: "" } },
  serverDir: "./",
});
