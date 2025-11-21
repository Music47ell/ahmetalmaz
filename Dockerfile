FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

EXPOSE 4321

# Start the server on all interfaces
CMD ["bun", "run", "start"]