import { getDb } from '../db'
import { logError } from './helpers'

export const withCache = async <T>(
	key: string,
	ttl: number,
	fn: () => Promise<T>,
): Promise<T> => {
	const now = Math.floor(Date.now() / 1000)

	try {
		const db = await getDb()
		const result = await db.execute({
			sql: 'SELECT value FROM cache WHERE key = ? AND expires_at > ?',
			args: [key, now],
		})
		const row = result.rows[0]
		if (row) return JSON.parse(row.value as string) as T
	} catch (err) {
		logError(`withCache: failed to read key "${key}"`, err)
	}

	const data = await fn()

	if (data !== null && data !== undefined) {
		try {
			const db = await getDb()
			await db.execute({
				sql: 'INSERT OR REPLACE INTO cache (key, value, expires_at) VALUES (?, ?, ?)',
				args: [key, JSON.stringify(data), now + ttl],
			})
			await db.execute({
				sql: 'DELETE FROM cache WHERE expires_at < ?',
				args: [now],
			})
		} catch (err) {
			logError(`withCache: failed to write key "${key}"`, err)
		}
	}

	return data
}
