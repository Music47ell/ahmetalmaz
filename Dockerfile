# syntax=docker/dockerfile:1.4
FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun install

# Use BuildKit secret to decrypt .env.ci without storing it in the image
RUN --mount=type=secret,id=private_key_ci \
    export DOTENV_PRIVATE_KEY_CI=$(cat /run/secrets/private_key_ci) && \
    bun run build

EXPOSE 4321
CMD ["bun", "run", "start"]
