import { handle } from '../../../lib/api/handle'
import { getListenBrainzStats } from '../../../lib/api/listenbrainz/stats'

export const GET = handle(() => getListenBrainzStats())

export const prerender = false
