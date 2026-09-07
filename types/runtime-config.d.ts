declare module "nitro/types" {
  interface NitroRuntimeConfig {
    app: { secret: string };
    upstream: { url: string };
  }
}

export {};
