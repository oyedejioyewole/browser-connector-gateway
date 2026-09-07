import { HTTPError } from "nitro";

export default {
  INVALID_AUTH_TOKEN: (payload: unknown) =>
    new HTTPError("The client provided an invalid 'Authorization' token", {
      status: 401,
      data: payload,
    }),
  INVALID_TOKEN_PERMISSIONS: (payload?: unknown) =>
    new HTTPError(
      "This client's token is not allowed to access this resource",
      {
        status: 401,
        data: payload,
      },
    ),
  ROUTE_NOT_FOUND: (route: string) =>
    new HTTPError(`The resource ${route} doesn't exist`, {
      status: 404,
    }),
};
