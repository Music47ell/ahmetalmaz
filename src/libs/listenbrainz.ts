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
}

interface AlbumInfo {
	artist: string
	title: string
	image: string
	mbid: string
}

interface ArtistInfo {
	name: string
	mbid: string
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
				trackInfo.image = exactMatch.album.cover_xl || ''
				trackInfo.preview = exactMatch.preview || ''
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
			(record: { track_metadata: TrackMetadata }) => {
				const metadata = record.track_metadata
				const artist =
					metadata.mbid_mapping?.artists?.[0]?.artist_credit_name ||
					metadata.artist_name

				return {
					artist,
					title: metadata.track_name,
					image: '',
					preview: '',
				}
			},
		)

		await Promise.all(
			recentTracks.map(async (track) => {
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
						track.image = matchedTrack.album.cover_xl || ''
						track.preview = matchedTrack.preview || ''
					}
				}

				if (!track.image) {
					const albumResponse = await fetch(
						`https://api.deezer.com/search/album?q=${encodeURIComponent(track.title)}`,
					)
					const albumData = await albumResponse.json()

					if (albumData.data && albumData.data.length > 0) {
						const matchedAlbum = albumData.data.find(
							(album: {
								artist: { name: string }
								title: string
								cover_xl?: string
							}) =>
								normalize(album.artist.name) === normalize(track.artist) &&
								normalize(album.title) === normalize(track.title),
						)

						if (matchedAlbum) {
							track.image = matchedAlbum.cover_xl || ''
						}
					}
				}

				if (!track.image) {
					const artistResponse = await fetch(
						`https://api.deezer.com/search/artist?q=${encodeURIComponent(track.artist)}`,
					)
					const artistData = await artistResponse.json()

					if (artistData.data && artistData.data.length > 0) {
						const matchedArtist = artistData.data.find(
							(artist: { name: string; picture_xl?: string }) =>
								normalize(artist.name) === normalize(track.artist),
						)

						if (matchedArtist) {
							track.image = matchedArtist.picture_xl || ''
						}
					}
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
			payload.recordings.map(async (record: TrackMetadata) => {
				const trackInfo: TrackInfo = {
					artist: record.artist_name,
					title: record.track_name,
					mbid: record.mbid_mapping?.caa_release_mbid ?? null,
					image: '',
					preview: '',
				}

				// Try to fetch track cover
				if (!trackInfo.image) {
					const trackResponse = await fetch(
						`https://api.deezer.com/search/track?q=${encodeURIComponent(`${trackInfo.title} ${trackInfo.artist}`)}`,
					)
					const trackData = await trackResponse.json()

					if (trackData.data && trackData.data.length > 0) {
						const matchedTrack = trackData.data.find(
							(t: {
								artist: { name: string }
								title: string
								album: { cover_xl?: string }
								preview?: string
							}) =>
								normalize(t.artist.name) === normalize(trackInfo.artist) &&
								normalize(t.title) === normalize(trackInfo.title),
						)

						if (matchedTrack) {
							trackInfo.image = matchedTrack.album.cover_xl || ''
							trackInfo.preview = matchedTrack.preview || ''
						}
					}
				}

				// If track cover doesn't exist, try album cover
				if (!trackInfo.image) {
					const albumResponse = await fetch(
						`https://api.deezer.com/search/album?q=${encodeURIComponent(trackInfo.title)}`,
					)
					const albumData = await albumResponse.json()

					if (albumData.data && albumData.data.length > 0) {
						const matchedAlbum = albumData.data.find(
							(album: {
								artist: { name: string }
								title: string
								cover_xl?: string
							}) =>
								normalize(album.artist.name) === normalize(trackInfo.artist) &&
								normalize(album.title) === normalize(trackInfo.title),
						)

						if (matchedAlbum) {
							trackInfo.image = matchedAlbum.cover_xl || ''
						}
					}
				}

				// If both track and album covers are missing, use artist's image
				if (!trackInfo.image) {
					const artistResponse = await fetch(
						`https://api.deezer.com/search/artist?q=${encodeURIComponent(trackInfo.artist)}`,
					)
					const artistData = await artistResponse.json()

					if (artistData.data && artistData.data.length > 0) {
						const matchedArtist = artistData.data.find(
							(artist: { name: string; picture_xl?: string }) =>
								normalize(artist.name) === normalize(trackInfo.artist),
						)

						if (matchedArtist) {
							trackInfo.image = matchedArtist.picture_xl || ''
						}
					}
				}

				// If no image is found, log a warning
				if (!trackInfo.image) {
					console.warn(
						`No image found for: ${trackInfo.artist} - ${trackInfo.title}`,
					)
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
				async (release: { artist_name: string; release_name: string }) => {
					const albumInfo: AlbumInfo = {
						artist: release.artist_name,
						title: release.release_name,
						image: '',
						mbid: '', // Provide a default or fetch the MBID if available
					}

					// Fetch track cover from Deezer first
					const trackResponse = await fetch(
						`https://api.deezer.com/search/track?q=${encodeURIComponent(`${albumInfo.title} ${albumInfo.artist}`)}`,
					)
					const trackData = await trackResponse.json()

					if (trackData.data && trackData.data.length > 0) {
						const matchedTrack = trackData.data.find(
							(track: {
								artist: { name: string }
								title: string
								album: { cover_xl?: string }
							}) =>
								normalize(track.artist.name) === normalize(albumInfo.artist) &&
								normalize(track.title) === normalize(albumInfo.title),
						)

						if (matchedTrack) {
							albumInfo.image = matchedTrack.album.cover_xl || ''
						}
					}

					// If track cover doesn't exist, try album cover
					if (!albumInfo.image) {
						const albumResponse = await fetch(
							`https://api.deezer.com/search/album?q=${encodeURIComponent(albumInfo.title)}`,
						)
						const albumData = await albumResponse.json()

						if (albumData.data && albumData.data.length > 0) {
							const matchedAlbum = albumData.data.find(
								(album: {
									artist: { name: string }
									title: string
									cover_xl?: string
								}) =>
									normalize(album.artist.name) ===
										normalize(albumInfo.artist) &&
									normalize(album.title) === normalize(albumInfo.title),
							)

							if (matchedAlbum) {
								albumInfo.image = matchedAlbum.cover_xl || ''
							}
						}
					}

					// If both track and album covers are missing, use artist's image
					if (!albumInfo.image) {
						const artistResponse = await fetch(
							`https://api.deezer.com/search/artist?q=${encodeURIComponent(albumInfo.artist)}`,
						)
						const artistData = await artistResponse.json()

						if (artistData.data && artistData.data.length > 0) {
							const matchedArtist = artistData.data.find(
								(artist: { name: string; picture_xl?: string }) =>
									normalize(artist.name) === normalize(albumInfo.artist),
							)

							if (matchedArtist) {
								albumInfo.image = matchedArtist.picture_xl || ''
							}
						}
					}

					if (!albumInfo.image) {
						console.warn(
							`No image found for: ${albumInfo.artist} - ${albumInfo.title}`,
						)
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
			payload.artists.map(async (artist: { artist_name: string }) => {
				const artistInfo: ArtistInfo = {
					name: artist.artist_name,
					mbid: '', // Provide a default or fetch the MBID if available
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
							artistInfo.image = matchedArtist.picture_xl || ''
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
							artistInfo.image = matchedAlbum.cover_xl || ''
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
