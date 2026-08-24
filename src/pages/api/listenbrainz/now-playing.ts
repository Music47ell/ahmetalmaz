import { handle } from '../../../lib/api/handle'
import { getNowPlaying } from '../../../lib/api/listenbrainz/nowPlaying'

export const GET = handle(() => getNowPlaying())

export const prerender = false
