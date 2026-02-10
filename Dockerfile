FROM oven/bun:latest

WORKDIR /app

COPY . .

ARG DOTENV_PRIVATE_KEY_CI
ENV DOTENV_PRIVATE_KEY_CI=$DOTENV_PRIVATE_KEY_CI

RUN bun install
RUN bun run build

EXPOSE 4321

# Start the server on all interfaces
CMD ["bun", "run", "start"]