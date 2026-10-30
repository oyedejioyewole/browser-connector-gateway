import { definePlugin } from "nitro";
import { getEventContext } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

import { authorizationTokenSchema } from "#utils/schema.ts";

export default definePlugin((nitroApp) => {
  const { app } = useRuntimeConfig();
  const secretPrefix = authorizationTokenSchema
    .transform((token) => {
      const [_, secret] = token.split("_");

      return token.replace(secret, "");
    })
    .parse(app.secret);

  nitroApp.hooks.hook("request", (event) => {
    getEventContext(event).gateway = { secretPrefix };
  });
});
