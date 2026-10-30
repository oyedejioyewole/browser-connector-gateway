import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { definePlugin } from "nitro";
import { join } from "path";

import { db } from "#db/index.ts";

export default definePlugin(() => {
  migrate(db, {
    migrationsFolder: join(
      Bun.fileURLToPath(import.meta.resolve("#db/index.ts")),
      "../migrations",
    ),
  });
});
