CREATE TABLE IF NOT EXISTS analytics (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	timestamp NUMERIC NOT NULL,
	title TEXT NOT NULL DEFAULT '',
	slug TEXT NOT NULL DEFAULT '',
	referrer TEXT NOT NULL DEFAULT '',
	flag TEXT NOT NULL DEFAULT 'Unknown',
	country TEXT NOT NULL DEFAULT 'Unknown',
	city TEXT NOT NULL DEFAULT 'Unknown',
	latitude NUMERIC,
	longitude NUMERIC
);

CREATE INDEX IF NOT EXISTS idx_analytics_slug ON analytics(slug);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_city ON analytics(city);

CREATE TABLE IF NOT EXISTS cache (
	key TEXT PRIMARY KEY,
	value TEXT NOT NULL,
	expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at);
