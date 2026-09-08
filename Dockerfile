FROM oven/bun:slim AS build

COPY --parents package.json bun.lock patches/ ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun --bun run build

FROM oven/bun:slim AS app

WORKDIR /app

COPY --from=build /home/bun/app/.output/ ./

# Defines a secret which is used in hashing allowed_clients secrets.
ENV NITRO_APP_SECRET=""
# Defines where to reach the browser-connector instance.
ENV NITRO_UPSTREAM_URL=""

EXPOSE 3000
VOLUME ["/app/.data/"]

CMD ["bun", "server/index.mjs"]