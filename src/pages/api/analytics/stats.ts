import { handle } from '../../../lib/api/handle'
import { getPageViewStats } from '../../../lib/api/analytics'

export const GET = handle(() => getPageViewStats())

export const prerender = false
