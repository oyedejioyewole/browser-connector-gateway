import { cpSync } from "fs";
import { defineConfig } from "nitro";
import { join } from "path";

export default defineConfig({
  database: {
    default: { connector: "bun-sqlite", options: { name: "store" } },
  },
  experimental: { database: true },
  features: { websocket: true },
  hooks: {
    "build:before"(nitro) {
      const migrationFolders = {
        source: join(
          Bun.fileURLToPath(import.meta.resolve("#db/index.ts")),
          "../migrations",
        ),
        output: join(nitro.options.output.serverDir, "./_db/migrations"),
      };

      cpSync(migrationFolders.source, migrationFolders.output, {
        recursive: true,
      });
    },
  },
  runtimeConfig: { app: { secret: "" }, upstream: { url: "" } },
  serverDir: "./",
});
