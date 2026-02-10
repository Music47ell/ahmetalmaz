import type React from 'react'
import { useState, useRef } from 'react'

interface Track {
	artist: string
	image?: string
	title: string
	preview?: string
	love: boolean
}

interface RecentTracksProps {
	tracks: Track[]
}

const RecentTracks: React.FC<RecentTracksProps> = ({ tracks }) => {
	const [playingIndex, setPlayingIndex] = useState<number | null>(null)
	const [currentTime, setCurrentTime] = useState<{ [key: number]: number }>({})
	const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

	const togglePlay = (index: number) => {
		const audio = audioRefs.current[index]
		if (!audio) return

		if (playingIndex === index) {
			if (audio.paused) {
				audio.play()
				setPlayingIndex(index)
			} else {
				audio.pause()
				setPlayingIndex(null)
			}
		} else {
			if (playingIndex !== null && audioRefs.current[playingIndex]) {
				audioRefs.current[playingIndex]?.pause()
			}
			audio.play()
			setPlayingIndex(index)
		}
	}

	const handleEnded = (index: number) => {
		setPlayingIndex(null)
		setCurrentTime((prev) => ({ ...prev, [index]: 0 }))
	}

	const handleTimeUpdate = (index: number) => {
		const audio = audioRefs.current[index]
		if (audio) {
			setCurrentTime((prev) => ({
				...prev,
				[index]: Math.min(audio.currentTime, 30),
			}))
		}
	}

	const handleSeek = (index: number, value: number) => {
		const audio = audioRefs.current[index]
		if (audio) {
			audio.currentTime = value
			setCurrentTime((prev) => ({ ...prev, [index]: value }))
		}
	}

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	if (!tracks || tracks.length === 0) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col border border-dracula-dracula shadow-lg">
			{tracks.map((track, index) => (
  <div
    key={`${track.title}-${index}`}
    className="relative flex items-center gap-4 p-4 border-b border-dracula-dracula"
  >
    {/* LOVE ICON */}
    {track.love && (
				<div className="absolute top-3 right-3 select-none cursor-default">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="red"
						className="w-6 h-6"
					>
						<title>Loved track</title>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42
							4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3
							19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				</div>
			)}

    <img
      src={track.image}
      alt={track.title}
      className="h-28 w-28 object-cover flex-shrink-0"
      width="112"
      height="112"
      loading="lazy"
    />

    <div className="flex flex-col w-full pr-8">
      <p className="text-lg font-semibold text-dracula-cullen">{track.title}</p>
      <p className="text-base font-semibold text-dracula-cullen">{track.artist}</p>

      {track.preview && (
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => togglePlay(index)}
            className="bg-yellow-500 text-black px-3 py-1 rounded shadow-md hover:bg-yellow-400 transition"
          >
            {playingIndex === index &&
            audioRefs.current[index]?.paused === false
              ? 'Pause'
              : 'Play'}
          </button>

          <audio
            ref={(el) => {
              audioRefs.current[index] = el
            }}
            src={track.preview}
            onEnded={() => handleEnded(index)}
            onTimeUpdate={() => handleTimeUpdate(index)}
          />

          <div className="flex items-center gap-2 text-dracula-cullen text-sm">
            <span>{formatTime(currentTime[index] || 0)}</span>
            <input
              type="range"
              min="0"
              max="30"
              value={currentTime[index] || 0}
              onChange={(e) =>
                handleSeek(index, Number(e.target.value))
              }
              className="w-full cursor-pointer"
            />
            <span>{formatTime(30)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
))}
		</div>
	)
}

export default RecentTracks
