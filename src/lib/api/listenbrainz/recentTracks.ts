import type { TrackInfo } from '../types'
import { getLastfmApiKey, getUsername } from '../env'
import { logError } from '../utils/helpers'

const PLACEHOLDER_IMAGE =
	'https://cdn-images.dzcdn.net/images/cover//250x250-000000-80-0-0.jpg'

export const getRecentTracks = async (): Promise<TrackInfo[]> => {
	try {
		const username = await getUsername()
		const lastfmApiKey = await getLastfmApiKey()

		const res = await fetch(
			`https://api.listenbrainz.org/1/user/${username}/listens?count=10`,
		)

		if (!res.ok) {
			logError(`Failed to fetch recent tracks: ${res.statusText}`)
			return []
		}

		const { payload } = await res.json()

		const tracks: TrackInfo[] = payload.listens.map((record: any) => {
			const meta = record.track_metadata
			const mbidMapping = meta.mbid_mapping || {}

			return {
				artist:
					mbidMapping.artists?.[0]?.artist_credit_name || meta.artist_name,
				title: meta.track_name,
				image: PLACEHOLDER_IMAGE,
				preview: '',
				mbid: mbidMapping.recording_mbid || '',
				release_mbid: mbidMapping.release_mbid || '',
				love: false,
			}
		})

		const mbids = tracks.map((t) => t.mbid).filter(Boolean)

		if (mbids.length > 0) {
			try {
				const feedbackUrl =
					`https://api.listenbrainz.org/1/feedback/user/${username}` +
					`/get-feedback-for-recordings?recording_mbids=${mbids.join(',')}`

				const feedbackRes = await fetch(feedbackUrl)

				if (feedbackRes.ok) {
					const feedbackData = await feedbackRes.json()
					const feedbackMap = new Map<string, boolean>(
						feedbackData.feedback.map((f: any) => [
							f.recording_mbid,
							f.score === 1,
						]),
					)

					tracks.forEach((track) => {
						const mbid = track.mbid
						if (mbid && feedbackMap.has(mbid)) {
							track.love = feedbackMap.get(mbid)!
						}
					})
				}
			} catch (err) {
				logError('Error fetching feedback data', err)
			}
		}

		await Promise.all(
			tracks.map(async (track) => {
				try {
					const query = encodeURIComponent(`${track.title} ${track.artist}`)
					const deezerUrl = `https://api.deezer.com/search/track?q=${query}&limit=1`
					const deezerRes = await fetch(deezerUrl)

					if (!deezerRes.ok) return

					const deezerData = await deezerRes.json()
					const first = deezerData.data?.[0]

					if (first) {
						track.image = first.album?.cover_medium || track.image
						track.preview = first.preview || ''
					}
				} catch (err) {
					logError(
						`Error fetching Deezer data for ${track.artist} - ${track.title}`,
						err,
					)
				}

				try {
					const lastfmUrl =
						`https://ws.audioscrobbler.com/2.0/?method=track.getInfo` +
						`&api_key=${lastfmApiKey}` +
						`&artist=${encodeURIComponent(track.artist)}` +
						`&track=${encodeURIComponent(track.title)}` +
						`&username=${username}&format=json`

					const lastfmRes = await fetch(lastfmUrl)

					if (lastfmRes.ok) {
						const lastfmData = await lastfmRes.json()
						const userPlaycount = lastfmData.track?.userplaycount
						if (userPlaycount != null) {
							track.lastfmPlaycount = Number(userPlaycount)
						}
					}
				} catch (err) {
					logError(
						`Error fetching Last.fm playcount for ${track.artist} - ${track.title}`,
						err,
					)
				}
			}),
		)

		return tracks
	} catch (err) {
		logError('Error fetching recent tracks', err)
		return []
	}
}
