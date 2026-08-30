import { handle } from '@/lib/api/handle'
import { getSlugViews } from '@/lib/api/analytics'

export const GET = handle((context) => getSlugViews(context.params.slug ?? ''))

export const prerender = false
