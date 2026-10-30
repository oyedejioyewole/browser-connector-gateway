declare module "nitro/types" {
  interface ServerRequestContext {
    gateway: {
      secretPrefix: string;
    };
  }
}

export {};
