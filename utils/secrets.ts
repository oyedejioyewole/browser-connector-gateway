export const getSecretPrefix = (secret: string) =>
  secret.replace(secret.split("_").at(1)!, "");
