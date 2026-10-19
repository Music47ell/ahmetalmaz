# syntax=docker/dockerfile:1

# ---- build ----
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# build the standalone Node server
RUN npm run build

# ---- runtime ----
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=4321

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
	&& npm cache clean --force

COPY --from=build /app/dist ./dist

USER node
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:4321/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
