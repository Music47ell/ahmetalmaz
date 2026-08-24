import { handle } from '../../../lib/api/handle'
import { getSteamAchievementsSummary } from '../../../lib/api/steam/achievementsSummary'

export const GET = handle(() => getSteamAchievementsSummary())

export const prerender = false
