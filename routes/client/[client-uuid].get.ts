import { createWebSocketProxy } from "crossws";
import { defineWebSocketHandler } from "nitro";

export default defineWebSocketHandler((event) =>
  createWebSocketProxy(event.context.websocketEndpoint as string),
);
