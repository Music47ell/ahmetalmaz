import { handle } from '@/lib/api/handle'
import { getGoatcounterSlugStats } from '@/lib/api/goatcounter'

export const GET = handle(({ params }) =>
	getGoatcounterSlugStats(params.slug ?? ''),
)

export const prerender = false
