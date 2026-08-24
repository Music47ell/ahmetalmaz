import { handle } from '../../../lib/api/handle'
import { getRecentTracks } from '../../../lib/api/listenbrainz/recentTracks'

export const GET = handle(() => getRecentTracks())

export const prerender = false
