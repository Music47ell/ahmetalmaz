# syntax=docker/dockerfile:1.4

FROM oven/bun:slim AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN bun run build

FROM oven/bun:slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --production

COPY --from=builder /app/dist ./dist

EXPOSE 4321

CMD ["bun","run","start"]