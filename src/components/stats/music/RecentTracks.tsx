import type React from 'react'
import { useState, useRef } from 'react'

interface Track {
	artist: string
	image?: string
	title: string
	preview?: string
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
				<div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col border border-yellow-500 shadow-lg bg-black/50">
			{tracks.map((track, index) => (
				<div
					key={`${track.title}-${index}`}
					className="flex items-center gap-4 p-4 border-b border-yellow-500"
				>
					<img
						src={track.image}
						alt={track.title}
						className="h-28 w-28 object-cover flex-shrink-0"
						width="112"
						height="112"
						loading="lazy"
					/>

					<div className="flex flex-col w-full">
						<p className="text-lg font-semibold text-white">{track.title}</p>
						<p className="text-base font-semibold text-white">{track.artist}</p>
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
								{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
								<audio
									ref={(el) => {
										audioRefs.current[index] = el
									}}
									src={track.preview}
									onEnded={() => handleEnded(index)}
									onTimeUpdate={() => handleTimeUpdate(index)}
								/>
								<div className="flex items-center gap-2 text-white text-sm">
									<span>{formatTime(currentTime[index] || 0)}</span>
									<input
										type="range"
										min="0"
										max="30"
										value={currentTime[index] || 0}
										onChange={(e) => handleSeek(index, Number(e.target.value))}
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
