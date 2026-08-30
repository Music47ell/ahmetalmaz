import { handle } from '../../../lib/api/handle'
import { getCityViews } from '../../../lib/api/analytics'

export const GET = handle(() => getCityViews())

export const prerender = false
