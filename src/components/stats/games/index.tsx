'use client'

import { useEffect, useState } from 'react'
import SteamProfile from './SteamProfile'
import SteamStats from './SteamStats'
import RecentGames from './RecentGames'
import TopGames from './TopGames'
import SteamLevel from './SteamLevel'
import SteamAchievements from './SteamAchievements'

const GamesStats = () => {
	const [profile, setProfile] = useState<{
		steamId: string
		username: string
		profileUrl: string
		avatarFull: string | null
		createdAt: string
		accountAgeYears: number
	}>({
		steamId: '',
		username: '',
		profileUrl: '',
		avatarFull: null,
		createdAt: '',
		accountAgeYears: 0,
	})
	const [steamStats, setSteamStats] = useState<{
		totalGames: number
		totalPlaytime: number
		totalHours: number
		totalDays: number
	}>({
		totalGames: 0,
		totalPlaytime: 0,
		totalHours: 0,
		totalDays: 0,
	})
	const [recentGames, setRecentGames] = useState<
		{
			appid: number
			name: string
			hours2weeks: number
			header: string | null
			storeUrl: string
		}[]
	>([])
	const [topGames, setTopGames] = useState<
		{
			appid: number
			name: string
			hours: number
			header: string | null
			storeUrl: string
		}[]
	>([])
	const [level, setLevel] = useState<{
		level: number
		xp: number
		xpNeededToLevelUp: number
		badgeCount: number
		badges: {
			badgeId: number
			level: number
			xp: number
			name: string | null
			description: string | null
			icon: string | null
			completionTime: string
		}[]
	}>({
		level: 0,
		xp: 0,
		xpNeededToLevelUp: 0,
		badgeCount: 0,
		badges: [],
	})
	const [achievements, setAchievements] = useState<{
		totalAvailable: number
		totalEarned: number
		percent: number
		rarest: {
			appid: number
			gameName: string
			name: string
			description: string | null
			icon: string
			percent: number
			unlockTime: string
			storeUrl: string
		}[]
	}>({
		totalAvailable: 0,
		totalEarned: 0,
		percent: 0,
		rarest: [],
	})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					steamProfileRes,
					steamStatsRes,
					steamRecentRes,
					steamLevelRes,
					steamAchievementsRes,
				] = await Promise.all([
					fetch('/api/steam/profile'),
					fetch('/api/steam/stats'),
					fetch('/api/steam/recently-played'),
					fetch('/api/steam/level'),
					fetch('/api/steam/achievements-summary'),
				])

				if (
					steamProfileRes.ok &&
					steamStatsRes.ok &&
					steamRecentRes.ok &&
					steamLevelRes.ok &&
					steamAchievementsRes.ok
				) {
					const steamProfileData = await steamProfileRes.json()
					const steamStatsData = await steamStatsRes.json()
					const steamRecentData = await steamRecentRes.json()
					const steamLevelData = await steamLevelRes.json()
					const steamAchievementsData = await steamAchievementsRes.json()

					setProfile(steamProfileData)
					setSteamStats(steamStatsData)
					setRecentGames(steamRecentData.games)
					setTopGames(steamStatsData.mostPlayed)
					setLevel(steamLevelData)
					setAchievements(steamAchievementsData)
				} else {
					console.error('One or more requests failed.')
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-3 flex items-center justify-between">
				<h2 className="uppercase font-semibold tracking-wide">Games</h2>

				<span className="text-xs text-yellow-400 tracking-wider whitespace-nowrap flex items-center gap-x-2">
					<svg
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
					>
						<title>Steam</title>
						<path
							fill="#FFFFFF"
							d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.807 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.525-.61c.262.543.714.999 1.314 1.25 1.297.575 2.793-.376 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.294-1.878-.03l1.523.61c.956.4 1.409 1.4 1.009 2.355-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.615-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"
						/>
					</svg>
				</span>
			</div>

			<SteamProfile profile={profile} />
			<SteamStats
				stats={steamStats}
				level={level}
				achievements={achievements}
			/>
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">Recently Played Games</h2>
			</div>
			<RecentGames games={recentGames} />
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">Most Played Games</h2>
			</div>
			<TopGames games={topGames} />
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">Steam Level & Badges</h2>
			</div>
			<SteamLevel level={level} />
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">Achievements</h2>
			</div>
			<SteamAchievements achievements={achievements} />
		</div>
	)
}

export default GamesStats
