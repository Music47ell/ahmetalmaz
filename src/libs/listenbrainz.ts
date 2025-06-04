const USERNAME = import.meta.env.USERNAME

if (!USERNAME) {
	throw new Error('USERNAME environment variable is not defined.')
}

// Types for API responses
interface TrackMetadata {
	artist_name: string
	track_name: string
	mbid_mapping?: {
		caa_release_mbid: string
		artists?: { artist_credit_name: string }[]
	}
}

interface TrackInfo {
	artist: string
	title: string
	mbid: string | null
	image: string
	preview: string | null
	caa_id?: number | null
	caa_release_mbid?: string | null
	release_mbid?: string | null
}

interface AlbumInfo {
	artist: string
	title: string
	image: string
	release_mbid: string | null
	caa_id?: number | null
	caa_release_mbid?: string | null
	mbid?: string | null
}

interface ArtistInfo {
	name: string
	artist_mbid	: string
	image: string
}

// Utility function to normalize strings for comparison
const normalize = (str: string) =>
	str
		.toLowerCase()
		.replace(/\(.*?\)/g, '') // Remove text in parentheses
		.replace(/[^\w\s]/g, '') // Remove special characters
		.trim()

// Utility function for error handling
const logError = (message: string, error?: unknown) => {
	console.error(message, error ?? '')
}

const getListenBrainzStats = async () => {
	const LISTEN_ACTIVITY_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/listening-activity`
	const LISTEN_COUNT_ENDPOINT = `https://api.listenbrainz.org/1/user/${USERNAME}/listen-count`
	const ARTIST_COUNT_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/artists?count=0`
	const ALBUM_COUNT_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/releases?count=0`
	const TRACKS_COUNT_ENDPOINTS = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/recordings?count=0`

	const listenActivityResponse = await fetch(LISTEN_ACTIVITY_ENDPOINT)
	const listenCountResponse = await fetch(LISTEN_COUNT_ENDPOINT)
	const artistCountResponse = await fetch(ARTIST_COUNT_ENDPOINT)
	const albumCountResponse = await fetch(ALBUM_COUNT_ENDPOINT)
	const tracksCountResponse = await fetch(TRACKS_COUNT_ENDPOINTS)
	const listenActivity = (await listenActivityResponse.json()).payload
		.listening_activity
	const listensCount = (await listenCountResponse.json()).payload.count
	const artistsCount = (await artistCountResponse.json()).payload
		.total_artist_count
	const albumsCount = (await albumCountResponse.json()).payload
		.total_release_count
	const tracksCount = (await tracksCountResponse.json()).payload
		.total_recording_count
	let accountAge = Number.POSITIVE_INFINITY
	for (const entry of listenActivity) {
		if (entry.listen_count !== 0 && Number(entry.time_range) < accountAge) {
			accountAge = Number(entry.time_range)
			accountAge = new Date().getFullYear() - accountAge
		}
	}
	return {
		accountAge,
		listensCount,
		artistsCount,
		albumsCount,
		tracksCount,
	}
}

const getNowPlaying = async () => {
	const NOW_PLAYING_ENDPOINT = `https://api.listenbrainz.org/1/user/${USERNAME}/playing-now`
	try {
		const response = await fetch(NOW_PLAYING_ENDPOINT)
		const { payload } = await response.json()

		if (!payload.listens || payload.listens.length === 0) {
			return { isPlaying: false }
		}

		const trackInfo = {
			artist: payload.listens[0].track_metadata.artist_name,
			title: payload.listens[0].track_metadata.track_name,
			image: '',
			preview: '',
			isPlaying: true,
		}

		const trackData = await fetch(
			`https://api.deezer.com/search/track?q=${encodeURIComponent(trackInfo.title)}&artist=${encodeURIComponent(trackInfo.artist)}`,
		)

		const trackResponse = await trackData.json()
		if (trackResponse.data && trackResponse.data.length > 0) {
			const exactMatch = trackResponse.data.find(
				(track: { title: string; artist: { name: string } }) =>
					track.title.toLowerCase() === trackInfo.title.toLowerCase() &&
					track.artist.name.toLowerCase() === trackInfo.artist.toLowerCase(),
			)

			if (exactMatch) {
				trackInfo.image = exactMatch.album.cover_xl
				trackInfo.preview = exactMatch.preview
			}
		}

		return trackInfo
	} catch (error) {
		console.error(`Error fetching now playing track: ${error}`)
		throw error
	}
}

// Fetch recent tracks
const getRecentTracks = async (): Promise<TrackInfo[]> => {
	const RECENT_TRACKS_ENDPOINT = `https://api.listenbrainz.org/1/user/${USERNAME}/listens?count=10`
	try {
		const response = await fetch(RECENT_TRACKS_ENDPOINT)
		const { payload } = await response.json()

		const recentTracks: TrackInfo[] = payload.listens.map(
			(record: { track_metadata: any }) => {
				const metadata = record.track_metadata
				const artist = metadata.mbid_mapping?.artists?.[0]?.artist_credit_name || metadata.artist_name
				const mbidMapping = metadata.mbid_mapping || {}

				return {
					artist,
					title: metadata.track_name,
					image: '',
					preview: '',
					mbid: mbidMapping.recording_mbid || '',
					release_mbid: mbidMapping.release_mbid || '',
					caa_id: mbidMapping.caa_id || null,
					caa_release_mbid: mbidMapping.caa_release_mbid || null
				}
			},
		)

		await Promise.all(
			recentTracks.map(async (track) => {
				// Try to get cover art from Cover Art Archive first
				if (track.caa_id && track.caa_release_mbid) {
					try {
						const coverUrl = `https://coverartarchive.org/release/${track.caa_release_mbid}/${track.caa_id}.jpg`
						const imageResponse = await fetch(coverUrl, { method: 'HEAD' })

						if (imageResponse.ok) {
							track.image = coverUrl
						} else {
							// Fallback to generic release cover
							track.image = `https://coverartarchive.org/release/${track.caa_release_mbid}/front`
						}
					} catch (error) {
						console.warn(`Error fetching cover art for ${track.artist} - ${track.title}:`, error)
					}
				} else if (track.release_mbid) {
					// Fallback to release MBID if we don't have caa_id
					track.image = `https://coverartarchive.org/release/${track.release_mbid}/front`
				}

				// If we still don't have an image, try Deezer (only for image)
				if (!track.image) {
					try {
						const trackResponse = await fetch(
							`https://api.deezer.com/search/track?q=${encodeURIComponent(`${track.title} ${track.artist}`)}`,
						)
						const trackData = await trackResponse.json()

						if (trackData.data && trackData.data.length > 0) {
							const matchedTrack = trackData.data.find(
								(t: { artist: { name: string }; title: string }) =>
									normalize(t.artist.name) === normalize(track.artist) &&
									normalize(t.title) === normalize(track.title),
							)

							if (matchedTrack) {
								track.image = matchedTrack.album.cover_xl
							}
						}
					} catch (error) {
						console.warn(`Deezer fallback failed for ${track.artist} - ${track.title}:`, error)
					}
				}

				// Always try to get preview from Deezer
				try {
					const previewResponse = await fetch(
						`https://api.deezer.com/search/track?q=${encodeURIComponent(`${track.title} ${track.artist}`)}&limit=1`,
					)
					const previewData = await previewResponse.json()

					if (previewData.data && previewData.data.length > 0) {
						const exactMatch = previewData.data.find(
							(t: { artist: { name: string }; title: string; preview: string }) =>
								normalize(t.artist.name) === normalize(track.artist) &&
								normalize(t.title) === normalize(track.title),
						)

						if (exactMatch) {
							track.preview = exactMatch.preview
						} else if (previewData.data[0].preview) {
							// Fallback to first result if exact match not found
							track.preview = previewData.data[0].preview
						}
					}
				} catch (error) {
					console.warn(`Error fetching preview for ${track.artist} - ${track.title}:`, error)
				}

				if (!track.image) {
					console.warn(`No image found for: ${track.artist} - ${track.title}`)
				}
			}),
		)

		return recentTracks
	} catch (error) {
		logError('Error fetching recent tracks:', error)
		return []
	}
}

// Fetch top tracks
const getTopTracks = async (): Promise<TrackInfo[]> => {
	const TOP_TRACKS_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/recordings?range=this_month&count=10`
	try {
		const response = await fetch(TOP_TRACKS_ENDPOINT)
		if (!response.ok) {
			logError(`Failed to fetch top tracks: ${response.statusText}`)
			return []
		}

		const { payload } = await response.json()
		const topTracks: TrackInfo[] = await Promise.all(
			payload.recordings.map(async (record: any) => {
				const trackInfo: TrackInfo = {
					artist: record.artist_name,
					title: record.track_name,
					mbid: record.recording_mbid || null,
					release_mbid: record.release_mbid || null,
					caa_id: record.caa_id || null,
					caa_release_mbid: record.caa_release_mbid || null,
					image: '',
					preview: '',
				}

				// Try to get cover art from Cover Art Archive first
				if (trackInfo.caa_id && trackInfo.caa_release_mbid) {
					try {
						const coverUrl = `https://coverartarchive.org/release/${trackInfo.caa_release_mbid}/${trackInfo.caa_id}.jpg`
						const imageResponse = await fetch(coverUrl, { method: 'HEAD' })

						if (imageResponse.ok) {
							trackInfo.image = coverUrl
						} else {
							// Fallback to generic release cover
							trackInfo.image = `https://coverartarchive.org/release/${trackInfo.caa_release_mbid}/front`
						}
					} catch (error) {
						console.warn(`Error fetching cover art for ${trackInfo.artist} - ${trackInfo.title}:`, error)
					}
				} else if (trackInfo.release_mbid) {
					// Fallback to release MBID if we don't have caa_id
					trackInfo.image = `https://coverartarchive.org/release/${trackInfo.release_mbid}/front`
				}

				// If we still don't have an image, try Deezer (only for image)
				if (!trackInfo.image) {
					try {
						const trackResponse = await fetch(
							`https://api.deezer.com/search/track?q=${encodeURIComponent(`${trackInfo.title} ${trackInfo.artist}`)}`,
						)
						const trackData = await trackResponse.json()

						if (trackData.data && trackData.data.length > 0) {
							const matchedTrack = trackData.data.find(
								(t: { artist: { name: string }; title: string; album: { cover_xl?: string } }) =>
									normalize(t.artist.name) === normalize(trackInfo.artist) &&
									normalize(t.title) === normalize(trackInfo.title),
							)

							if (matchedTrack) {
								trackInfo.image = matchedTrack.album.cover_xl
							}
						}
					} catch (error) {
						console.warn(`Deezer fallback failed for ${trackInfo.artist} - ${trackInfo.title}:`, error)
					}
				}

				// Always try to get preview from Deezer
				try {
					const previewResponse = await fetch(
						`https://api.deezer.com/search/track?q=${encodeURIComponent(`${trackInfo.title} ${trackInfo.artist}`)}&limit=1`,
					)
					const previewData = await previewResponse.json()

					if (previewData.data && previewData.data.length > 0) {
						const exactMatch = previewData.data.find(
							(t: { artist: { name: string }; title: string; preview: string }) =>
								normalize(t.artist.name) === normalize(trackInfo.artist) &&
								normalize(t.title) === normalize(trackInfo.title),
						)

						if (exactMatch) {
							trackInfo.preview = exactMatch.preview
						} else if (previewData.data[0].preview) {
							// Fallback to first result if exact match not found
							trackInfo.preview = previewData.data[0].preview
						}
					}
				} catch (error) {
					console.warn(`Error fetching preview for ${trackInfo.artist} - ${trackInfo.title}:`, error)
				}

				if (!trackInfo.image) {
					console.warn(`No image found for: ${trackInfo.artist} - ${trackInfo.title}`)
				}

				return trackInfo
			}),
		)

		return topTracks
	} catch (error) {
		logError('Error fetching top tracks:', error)
		return []
	}
}

// Fetch top albums
const getTopAlbums = async (): Promise<AlbumInfo[]> => {
	const TOP_ALBUMS_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/releases?range=this_month&count=10`
	try {
		const response = await fetch(TOP_ALBUMS_ENDPOINT)
		if (!response.ok) {
			logError(`Failed to fetch top albums: ${response.statusText}`)
			return []
		}

		const { payload } = await response.json()

		const topAlbums: AlbumInfo[] = await Promise.all(
			payload.releases.map(
				async (release: {
					artist_name: string;
					release_name: string;
					release_mbid: string;
					caa_id: number | null;
					caa_release_mbid: string | null;
				}) => {
					const albumInfo: AlbumInfo = {
						artist: release.artist_name,
						title: release.release_name,
						release_mbid: release.release_mbid || null,
						caa_id: release.caa_id || null,
						caa_release_mbid: release.caa_release_mbid || null,
						image: '',
					}

					// Try to get cover art from Cover Art Archive
					if (release.caa_id && release.caa_release_mbid) {
						// Construct Cover Art Archive URL
						albumInfo.image = `https://coverartarchive.org/release/${release.caa_release_mbid}/${release.caa_id}.jpg`

						// Verify the image exists
						try {
							const imageResponse = await fetch(albumInfo.image, { method: 'HEAD' })
							if (!imageResponse.ok) {
								// If the specific image doesn't exist, try the generic release endpoint
								albumInfo.image = `https://coverartarchive.org/release/${release.caa_release_mbid}/front`
							}
						} catch (error) {
							console.warn(`Error checking cover art for ${release.release_name}:`, error)
							albumInfo.image = `https://coverartarchive.org/release/${release.caa_release_mbid}/front`
						}
					} else if (release.release_mbid) {
						// Fallback to generic release endpoint if we don't have caa_id but have release_mbid
						albumInfo.image = `https://coverartarchive.org/release/${release.release_mbid}/front`
					}

					// If we still don't have an image, fall back to Deezer (optional)
					if (!albumInfo.image) {
						console.warn(`No cover art found in Cover Art Archive for: ${albumInfo.artist} - ${albumInfo.title}`)
						// You could optionally keep the Deezer fallback here if desired
					}

					return albumInfo
				},
			),
		)

		return topAlbums
	} catch (error) {
		logError('Error fetching top albums:', error)
		return []
	}
}

// Fetch top artists
const getTopArtists = async (): Promise<ArtistInfo[]> => {
	const TOP_ARTISTS_ENDPOINT = `https://api.listenbrainz.org/1/stats/user/${USERNAME}/artists?range=this_month&count=10`
	try {
		const response = await fetch(TOP_ARTISTS_ENDPOINT)
		if (!response.ok) {
			logError(`Failed to fetch top artists: ${response.statusText}`)
			return []
		}

		const { payload } = await response.json()

		const topArtists: ArtistInfo[] = await Promise.all(
			payload.artists.map(async (artist: { artist_name: string; artist_mbid: string }) => {
				const artistInfo: ArtistInfo = {
					name: artist.artist_name,
					artist_mbid: artist.artist_mbid || '',
					image: '',
				}

				// Try to fetch artist image from Deezer
				if (!artistInfo.image) {
					const deezerResponse = await fetch(
						`https://api.deezer.com/search/artist?q=${encodeURIComponent(artistInfo.name)}`,
					)
					const deezerData = await deezerResponse.json()

					if (deezerData.data && deezerData.data.length > 0) {
						const normalize = (str: string) =>
							str
								.toLowerCase()
								.replace(/[^\w\s]/g, '') // Remove special characters
								.trim()

						const normalizedArtist = normalize(artistInfo.name)

						const matchedArtist = deezerData.data.find(
							(a: { name: string; picture_xl?: string }) =>
								normalize(a.name) === normalizedArtist,
						)

						if (matchedArtist) {
							artistInfo.image = matchedArtist.picture_xl
						}
					}
				}

				// If no image is found, try fetching album image
				if (!artistInfo.image) {
					const albumResponse = await fetch(
						`https://api.deezer.com/search/album?q=${encodeURIComponent(artistInfo.name)}`,
					)
					const albumData = await albumResponse.json()

					if (albumData.data && albumData.data.length > 0) {
						const matchedAlbum = albumData.data.find(
							(album: { artist: { name: string }; cover_xl?: string }) =>
								normalize(album.artist.name) === normalize(artistInfo.name),
						)

						if (matchedAlbum) {
							artistInfo.image = matchedAlbum.cover_xl
						}
					}
				}

				// If no image is found, log a warning
				if (!artistInfo.image) {
					console.warn(`No image found for artist: ${artistInfo.name}`)
				}

				return artistInfo
			}),
		)

		return topArtists
	} catch (error) {
		logError('Error fetching top artists:', error)
		return []
	}
}

export {
	getListenBrainzStats,
	getNowPlaying,
	getRecentTracks,
	getTopTracks,
	getTopAlbums,
	getTopArtists,
}
