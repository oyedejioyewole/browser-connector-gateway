import { z } from "zod";

export const authorizationTokenSchema = z.templateLiteral([
  z.string().regex(/^[a-z]+/),
  "_",
  z.hash("sha256", {
    error: "The token must use the required format.",
  }),
]);

export const authorizationSchemas = {
  header: z
    .templateLiteral(["Bearer ", authorizationTokenSchema])
    .transform((value) => value.replace("Bearer", "").trim()),
  query: z.object({
    token: authorizationTokenSchema,
  }),
};

export const clientUuidSchema = z.uuidv7({
  error: "The client ID must be a valid UUIDv7.",
});

export const upstreamResponseSchemas = {
  "/next": {
    success: z.object({
      endpoint: z.url({ error: "The upstream endpoint must be a valid URL." }),
    }),
    error: z.object({
      error: z.string().nonempty({
        error: "The upstream error message must not be empty.",
      }),
    }),
  },
};
