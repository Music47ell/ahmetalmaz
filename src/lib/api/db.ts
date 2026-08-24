import { createClient, type Client } from '@libsql/client'
import { getTursoAuthToken, getTursoDatabaseUrl } from './env'

let clientPromise: Promise<Client> | null = null

export const getDb = (): Promise<Client> => {
	if (!clientPromise) {
		clientPromise = (async () => {
			const url = await getTursoDatabaseUrl()
			if (!url) throw new Error('TURSO_DATABASE_URL is required')

			const authToken = await getTursoAuthToken()
			return createClient(authToken ? { url, authToken } : { url })
		})()
		clientPromise.catch(() => {
			clientPromise = null
		})
	}
	return clientPromise
}
