// src/libs/cache.ts
// Auto-fallback: Redis if available, else in-memory

type CacheClient = {
  get(key: string): Promise<string | null>;
  setex(key: string, ttlSeconds: number, value: string): Promise<void>;
  del(...keys: string[]): Promise<void>;
};

let client: CacheClient | null = null;

// In-memory store (for dev)
const memory = new Map<string, { value: string; expiry: number }>();

const MemoryClient: CacheClient = {
  async get(key) {
    const item = memory.get(key);
    if (item && Date.now() < item.expiry) return item.value;
    memory.delete(key);
    return null;
  },
  async setex(key, ttl, value) {
    memory.set(key, { value, expiry: Date.now() + ttl * 1000 });
  },
  async del(...keys) {
    keys.forEach(k => memory.delete(k));
  }
};

// Redis client (for prod)
let redisClient: any = null;
async function initRedis(url: string): Promise<CacheClient | null> {
  try {
    const { Redis } = await import('ioredis');
    const redis = new Redis(url, {
      retryStrategy: () => null,
      connectTimeout: 2000,
      lazyConnect: true,
    });
    await redis.connect();
    return {
      get: (key) => redis.get(key),
      setex: (key, ttl, val) => redis.setex(key, ttl, val),
      del: (...keys) => redis.del(...keys),
    };
  } catch (e) {
    console.warn('[Cache] Redis unavailable. Using memory fallback.');
    return null;
  }
}

export async function getCacheClient(): Promise<CacheClient> {
  if (client) return client;

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redis = await initRedis(redisUrl);
    if (redis) {
      client = redis;
      console.info('[Cache] Using Redis');
      return client;
    }
  }

  client = MemoryClient;
  console.info('[Cache] Using in-memory fallback');
  return client;
}