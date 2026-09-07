import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { definePlugin } from "nitro";
import { join } from "path";

import { db } from "#db/index.ts";

export default definePlugin(() => {
  migrate(db, {
    migrationsFolder: import.meta.dev
      ? join(
          Bun.fileURLToPath(import.meta.resolve("#db/index.ts")),
          "../migrations",
        )
      : join(import.meta.dir, "./_db/migrations"),
  });
});
