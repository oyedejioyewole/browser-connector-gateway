import { z } from "zod";

import { getSecretPrefix } from "./secrets";

const authorizationTokenSchema = z.templateLiteral([
  getSecretPrefix(import.meta.env.NITRO_APP_SECRET!),
  z.hash("sha256", {
    error: "The token must use the required format.",
  }),
]);

export const authorizationSchemas = {
  header: z
    .string()
    .regex(/^Bearer\s\S+$/, {
      error: "The Authorization header must use the Bearer format.",
    })
    .transform((value) => value.replace("Bearer", "").trim())
    .pipe(authorizationTokenSchema),
  query: z.object({
    token: authorizationTokenSchema,
  }),
};

export const clientUuidSchema = z.uuidv7({
  error: "The client ID must be a valid UUIDv7.",
});

export const upstreamResponseSchemas = {
  "/next": z.union([
    z.object({
      status: z.literal(200),
      endpoint: z.url({ error: "The upstream endpoint must be a valid URL." }),
    }),
    z.object({
      status: z.literal(503),
      error: z.string().nonempty({
        error: "The upstream error message must not be empty.",
      }),
    }),
  ]),
};
