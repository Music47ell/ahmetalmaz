# syntax=docker/dockerfile:1.4

### Build stage
FROM oven/bun:slim AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN --mount=type=secret,id=private_key_ci \
    export DOTENV_PRIVATE_KEY_CI=$(cat /run/secrets/private_key_ci) && \
    bun run build


### Runtime stage
FROM oven/bun:slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 4321

CMD ["bun", "run", "start"]