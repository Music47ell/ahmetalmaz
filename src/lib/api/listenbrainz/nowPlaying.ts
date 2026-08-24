import { getUsername } from '../env'
import { withCache } from '../utils/cache'
import { logError } from '../utils/helpers'

export const getNowPlaying = async () =>
	withCache('listenbrainz:now-playing', 30, async () => {
		const username = await getUsername()
		const endpoint = `https://api.listenbrainz.org/1/user/${username}/playing-now`

		try {
			const res = await fetch(endpoint)
			const { payload } = await res.json()

			if (!payload.listens?.length) return { isPlaying: false }

			const track = payload.listens[0].track_metadata
			const mbid = track.additional_info?.recording_mbid || ''

			const trackInfo = {
				artist: track.artist_name,
				title: track.track_name,
				image: '',
				preview: '',
				isPlaying: true,
				love: false,
				mbid,
			}

			if (mbid) {
				try {
					const feedbackRes = await fetch(
						`https://api.listenbrainz.org/1/feedback/user/${username}/get-feedback-for-recordings?recording_mbids=${mbid}`,
					)
					if (feedbackRes.ok) {
						const feedbackData = await feedbackRes.json()
						if (feedbackData.feedback?.length) {
							trackInfo.love = feedbackData.feedback[0].score === 1
						}
					}
				} catch (err) {
					logError('Error fetching track feedback:', err)
				}
			}

			try {
				const deezerRes = await fetch(
					`https://api.deezer.com/search/track?q=${encodeURIComponent(trackInfo.title)} ${encodeURIComponent(trackInfo.artist)}&limit=1`,
				)
				const deezerData = await deezerRes.json()

				const first = deezerData.data?.[0]
				if (first) {
					trackInfo.image = first.album?.cover_medium || ''
					trackInfo.preview = first.preview || ''
				}
			} catch (err) {
				logError('Error fetching Deezer data for now playing track:', err)
			}

			return trackInfo
		} catch (err) {
			logError('Error fetching now playing track:', err)
			return { isPlaying: false }
		}
	})
