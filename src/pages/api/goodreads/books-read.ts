import { handle } from '../../../lib/api/handle'
import { getGoodreadsReadBooks } from '../../../lib/api/goodreads/readBooks'

export const GET = handle(() => getGoodreadsReadBooks())

export const prerender = false
