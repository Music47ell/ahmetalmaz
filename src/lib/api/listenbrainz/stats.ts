import { getUsername } from '../env'
import { withCache } from '../utils/cache'

export const getListenBrainzStats = async () =>
	withCache('listenbrainz:stats', 3600, async () => {
		const username = await getUsername()

		const endpoints = {
			listenActivity: `https://api.listenbrainz.org/1/stats/user/${username}/listening-activity`,
			listenCount: `https://api.listenbrainz.org/1/user/${username}/listen-count`,
			artistCount: `https://api.listenbrainz.org/1/stats/user/${username}/artists?count=0`,
			albumCount: `https://api.listenbrainz.org/1/stats/user/${username}/releases?count=0`,
			tracksCount: `https://api.listenbrainz.org/1/stats/user/${username}/recordings?count=0`,
		}

		const [activityJson, listenJson, artistJson, albumJson, trackJson] =
			await Promise.all(
				Object.values(endpoints).map(async (url) => (await fetch(url)).json()),
			)

		const listenActivity = activityJson.payload.listening_activity
		let accountAge = Number.POSITIVE_INFINITY
		for (const entry of listenActivity) {
			if (entry.listen_count !== 0 && Number(entry.time_range) < accountAge) {
				accountAge = new Date().getFullYear() - Number(entry.time_range)
			}
		}

		return {
			accountAge,
			listensCount: listenJson.payload.count,
			artistsCount: artistJson.payload.total_artist_count,
			albumsCount: albumJson.payload.total_release_count,
			tracksCount: trackJson.payload.total_recording_count,
		}
	})
