import { handle } from '../../../lib/api/handle'
import { getTopLanguages } from '../../../lib/api/codestats/topLanguages'

export const GET = handle(() => getTopLanguages())

export const prerender = false
