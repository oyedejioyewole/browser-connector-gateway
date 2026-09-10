import { HTTPError } from "nitro";

export default {
  INVALID_CLIENT_SECRET: (payload: unknown) =>
    new HTTPError("The client sent an invalid secret.", {
      status: 401,
      data: payload,
    }),
  INVALID_SECRET_PERMISSIONS: (payload?: unknown) =>
    new HTTPError("This secret cannot access this resource.", {
      status: 401,
      data: payload,
    }),
  ROUTE_NOT_FOUND: (route: string) =>
    new HTTPError(`The resource ${route} does not exist.`, {
      status: 404,
    }),
};
