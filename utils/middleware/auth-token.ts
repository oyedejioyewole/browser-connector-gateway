import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, selectSchema } from "#db/schema.ts";

import type { H3Event } from "nitro/h3";

export const getAuthToken = (event: H3Event) => {
  const authToken = event.req.headers.get("Authorization");

  return z
    .string()
    .regex(/^Bearer\s\S+$/, {
      error: "'Authorization' token has an invalid 'Bearer' format",
    })
    .transform((value) => value.replace("Bearer", "").trim())
    .pipe(
      z.hash("sha256", {
        enc: "base64",
        error: "'Authorization' token has an invalid format",
      }),
    )
    .safeParse(authToken);
};

export const validateAuthToken = async (authToken: string) => {
  const rows = await db
    .select()
    .from(allowedClients)
    .where(eq(allowedClients.clientSecret, authToken));

  return z
    .array(selectSchema)
    .nonempty({ error: "'Authorization' token wasn't found in allowlist" })
    .transform((value) => value[0])
    .safeParse(rows);
};
