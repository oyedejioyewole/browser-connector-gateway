FROM oven/bun:slim AS build

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Defines a secret which is used in hashing secrets in the `allowed_clients` table.
ENV NITRO_APP_SECRET=
# Defines where to reach the `browser-connector` instance.
ENV NITRO_UPSTREAM_URL=

EXPOSE 3000
VOLUME ["/app/.data/"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["bun", "docker/scripts/browser-connector-gateway.ts"]

CMD ["bun", "--bun", "serve"]