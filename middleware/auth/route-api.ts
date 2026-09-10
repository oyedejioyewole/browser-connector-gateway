import { defineHandler } from "nitro";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import errors from "#utils/errors.ts";
import { getClientSecret } from "#utils/middleware/client-secret.ts";

export default defineHandler((event) => {
  if (!event.url.pathname.startsWith("/api")) return;

  const parsedClientSecret = getClientSecret(event);
  if (!parsedClientSecret.success)
    throw errors.INVALID_CLIENT_SECRET(
      z.treeifyError(parsedClientSecret.error),
    );

  const { app } = useRuntimeConfig();
  if (app.secret !== parsedClientSecret.data)
    throw errors.INVALID_SECRET_PERMISSIONS();
});
