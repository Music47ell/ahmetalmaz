'use client'

import { useEffect, useState, useRef } from 'react'

export default function NowPlaying() {
	const [data, setData] = useState({
		artist: '',
		title: '',
		image: '',
		url: '/',
		isPlaying: false,
		preview: '',
	})
	const [playing, setPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		const fetchNowPlaying = async () => {
			try {
				const res = await fetch('/api/listenbrainz/now-playing')
				const nowPlayingData = await res.json()
				setData(nowPlayingData)
			} catch (error) {
				console.error('Error fetching now playing data:', error)
			}
		}

		fetchNowPlaying()
	}, [])

	const togglePlay = () => {
		if (!audioRef.current) return

		if (playing) {
			audioRef.current.pause()
			setPlaying(false)
		} else {
			audioRef.current.play()
			setPlaying(true)
		}
	}

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime)
		}
	}

	const handleEnded = () => {
		setPlaying(false)
		setCurrentTime(0)
	}

	const handleSeek = (value: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value
			setCurrentTime(value)
		}
	}

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
	}

	if (!data.isPlaying) return null

	return (
		<div className="overflow-hidden p-4 border border-zinc-500 shadow-lg">
			<a href={data.url} className="flex items-center gap-5">
				<div className="relative flex-shrink-0">
					<img
						src={`https://wsrv.nl/?url=${data.image}`}
						alt={data.title}
						title={data.title}
						width={100}
						height={100}
						className="block animate-spin-slow rounded-full"
					/>
				</div>
				<div className="flex flex-col">
					<p className="text-sm font-medium text-gray-300 md:text-lg">
						{data.artist}
					</p>
					<p className="text-lg font-semibold text-white md:text-2xl">
						{data.title}
					</p>
				</div>
			</a>
			{data.preview && (
				<div className="mt-2 flex flex-col gap-2">
					<button
						type="button"
						onClick={togglePlay}
						className="bg-yellow-500 text-black px-3 py-1 rounded shadow-md hover:bg-yellow-400 transition"
					>
						{playing ? 'Pause' : 'Play'}
					</button>
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<audio
						ref={audioRef}
						src={data.preview}
						onTimeUpdate={handleTimeUpdate}
						onEnded={handleEnded}
					/>
					<div className="flex items-center gap-2 text-white text-sm">
						<span>{formatTime(currentTime)}</span>
						<input
							type="range"
							min="0"
							max="30"
							value={currentTime}
							onChange={(e) => handleSeek(Number(e.target.value))}
							className="w-full cursor-pointer appearance-none bg-black [&::-webkit-slider-runnable-track]:bg-black [&::-moz-range-track]:bg-black [&::-ms-track]:bg-black"
						/>
						<span>{formatTime(30)}</span>
					</div>
				</div>
			)}
		</div>
	)
}
