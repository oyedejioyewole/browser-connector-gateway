import { defineHandler } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";

import errors from "#utils/errors.ts";
import { getAuthToken } from "#utils/middleware/auth-token.ts";

export default defineHandler((event) => {
  if (!event.url.pathname.startsWith("/api")) return;

  const parsedAuthToken = getAuthToken(event);
  if (!parsedAuthToken.success)
    throw errors.INVALID_AUTH_TOKEN(parsedAuthToken.error);

  const { app } = useRuntimeConfig();
  if (app.secret !== parsedAuthToken.data)
    throw errors.INVALID_TOKEN_PERMISSIONS();
});
