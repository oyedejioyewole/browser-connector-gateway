import { eq } from "drizzle-orm";
import { getQuery } from "nitro/h3";
import { z } from "zod";

import { db } from "#db/index.ts";
import { allowedClients, selectSchema } from "#db/schema.ts";
import { authorizationSchemas } from "../schema.ts";

import type { H3Event } from "nitro/h3";

export function getClientSecret(
  event: H3Event,
  extractFrom: "query",
): ReturnType<typeof authorizationSchemas.query.safeParse>;
export function getClientSecret(
  event: H3Event,
  extractFrom?: "headers",
): ReturnType<typeof authorizationSchemas.header.safeParse>;
export function getClientSecret(
  event: H3Event,
  extractFrom: "headers" | "query" = "headers",
) {
  switch (extractFrom) {
    case "query":
      const queryParameters = getQuery(event);
      return authorizationSchemas.query.safeParse(queryParameters);
    case "headers":
      const authorizationHeader = event.req.headers.get("Authorization");
      return authorizationSchemas.header.safeParse(authorizationHeader);
    default:
      throw "extractFrom must either be 'headers' or 'query'";
  }
}

export const validateClientSecret = async (clientSecret: string) => {
  const rows = await db
    .select()
    .from(allowedClients)
    .where(eq(allowedClients.clientSecret, clientSecret));

  return z
    .array(selectSchema)
    .nonempty({ error: "This secret was not found in the client list." })
    .transform((value) => value[0])
    .safeParse(rows);
};
