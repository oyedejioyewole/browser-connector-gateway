import { defineMiddleware, fetch, HTTPError } from "nitro";
import { getRouterParam } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

import errors from "#utils/errors.ts";
import {
  getAuthToken,
  validateAuthToken,
} from "#utils/middleware/auth-token.ts";

const UPSTREAM_RESPONSE_SCHEMA = z.union([
  z.object({
    status: z.literal(200),
    endpoint: z.url(),
  }),
  z.object({ status: z.literal(503), error: z.string().nonempty() }),
]);

export default defineMiddleware(async (event) => {
  if (!event.url.pathname.startsWith("/client")) return;

  const parsedAuthToken = getAuthToken(event);
  if (!parsedAuthToken.success)
    throw errors.INVALID_AUTH_TOKEN(z.treeifyError(parsedAuthToken.error));

  const { app } = useRuntimeConfig();
  if (app.secret === parsedAuthToken.data)
    throw errors.INVALID_TOKEN_PERMISSIONS();

  const parsedRows = await validateAuthToken(parsedAuthToken.data);
  if (!parsedRows.success)
    throw errors.INVALID_TOKEN_PERMISSIONS(z.treeifyError(parsedRows.error));

  const clientUuid = getRouterParam(event, "client-uuid");

  const parsedClientUuid = z.uuidv7().safeParse(clientUuid);
  if (!parsedClientUuid.success)
    throw errors.ROUTE_NOT_FOUND(event.url.pathname);

  if (parsedRows.data.id !== parsedClientUuid.data)
    throw new HTTPError(
      `The client isn't permitted to access /${parsedClientUuid.data}`,
      {
        status: 403,
      },
    );

  const { upstream } = useRuntimeConfig();
  const upstreamResponse = await fetch(`${upstream.url}/next`);
  const upstreamResponseJSON = await upstreamResponse.json();

  const parsedUpstreamResponseJson = z.parse(UPSTREAM_RESPONSE_SCHEMA, {
    status: upstreamResponse.status,
    ...upstreamResponseJSON,
  });

  if (parsedUpstreamResponseJson.status === 503)
    throw new HTTPError(parsedUpstreamResponseJson.error, {
      status: parsedUpstreamResponseJson.status,
    });

  // const websocketUrl = new URL(parsedUpstreamResponseJson.endpoint);
  // websocketUrl.hostname = new URL(upstream.url).hostname;

  // console.log(websocketUrl.href);

  event.context.websocketEndpoint = parsedUpstreamResponseJson.endpoint;
});
