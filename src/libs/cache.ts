type CacheClient = {
  get(key: string): Promise<string | null>;
  setex(key: string, ttlSeconds: number, value: string): Promise<void>;
  del(...keys: string[]): Promise<void>;
  incr(key: string): Promise<number>;
};

let client: CacheClient | null = null;

// ————— Memory fallback —————
const memory = new Map<string, { value: string; expiry?: number }>();

const MemoryClient: CacheClient = {
  async get(key) {
    const item = memory.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      memory.delete(key);
      return null;
    }
    return item.value as string;
  },
  async setex(key, ttl, value) {
    memory.set(key, { value, expiry: Date.now() + ttl * 1000 });
  },
  async del(...keys) {
    keys.forEach(k => memory.delete(k));
  },
  async incr(key) {
    const current = Number(await this.get(key) || 0) + 1;
    memory.set(key, { value: String(current) });
    return current;
  }
};

// ————— Redis client —————
async function initRedis(url: string): Promise<CacheClient | null> {
  try {
    const { Redis } = await import('ioredis');
    const redis = new Redis(url, { lazyConnect: true });
    await redis.connect();

    return {
      get: (k) => redis.get(k),
      setex: (k, t, v) => redis.setex(k, t, v),
      del: (...keys) => (keys.length ? redis.del(...keys) : Promise.resolve()),
      incr: (k) => redis.incr(k)
    };
  } catch {
    console.warn('[Cache] Redis unavailable, using memory fallback');
    return null;
  }
}

// ————— Public accessor —————
export async function getCacheClient(): Promise<CacheClient> {
  if (client) return client;

  if (process.env.REDIS_URL) {
    const redis = await initRedis(process.env.REDIS_URL);
    if (redis) return (client = redis);
  }

  return (client = MemoryClient);
}
