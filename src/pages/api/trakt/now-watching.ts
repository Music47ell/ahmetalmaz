import { handle } from '../../../lib/api/handle'
import { getNowWatching } from '../../../lib/api/trakt/nowWatching'

export const GET = handle(() => getNowWatching())

export const prerender = false
