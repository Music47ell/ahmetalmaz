'use client'

import { useEffect, useState, useRef } from 'react'
import siteMetadata from "../data/siteMetadata";

interface NowPlayingData {
	artist: string
	title: string
	image: string
	url?: string
	isPlaying: boolean
	preview?: string
	love?: boolean
}

export default function NowPlaying() {
	const [data, setData] = useState<NowPlayingData>({
		artist: '',
		title: '',
		image: '',
		url: '/',
		isPlaying: false,
		preview: '',
		love: false,
	})
	const [playing, setPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const waveContainerRef = useRef<HTMLDivElement | null>(null)
	const waveRef = useRef<SiriWave9 | null>(null)

	// Fetch now playing
	useEffect(() => {
		const fetchNowPlaying = async () => {
			try {
				const res = await fetch(`${siteMetadata.apiUrl}/listenbrainz/now-playing`)
				const nowPlayingData = await res.json()
				setData(nowPlayingData)
			} catch (error) {
				console.error('Error fetching now playing data:', error)
			}
		}
		fetchNowPlaying()
	}, [])

	// Toggle play/pause
	const togglePlay = () => {
		if (!audioRef.current || !waveContainerRef.current) return

		if (playing) {
			audioRef.current.pause()
			setPlaying(false)
			waveRef.current?.stop()
		} else {
			audioRef.current.play()
			setPlaying(true)
			if (!waveRef.current) {
				waveRef.current = new SiriWave9({
					container: waveContainerRef.current,
					height: 120,
					speed: 0.05,
					amplitude: 1,
					autostart: true,
				})
			} else {
				waveRef.current.start()
			}
		}
	}

	// Audio handlers
	const handleTimeUpdate = () => {
		if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
	}

	const handleEnded = () => {
		setPlaying(false)
		setCurrentTime(0)
		waveRef.current?.stop()
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

	// --- SiriWave9 classes ---
	class SiriWave9Curve {
		controller: SiriWave9
		color: number[]
		tick: number
		amplitude: number
		seed: number
		open_class: number

		constructor(opt: { controller: SiriWave9, color: number[] }) {
			this.controller = opt.controller
			this.color = opt.color
			this.tick = 0
			this.respawn()
		}

		respawn() {
			this.amplitude = 0.3 + Math.random() * 0.7
			this.seed = Math.random()
			this.open_class = 2 + ((Math.random() * 3) | 0)
		}

		equation(i: number) {
			const p = this.tick
			const y =
				-Math.abs(Math.sin(p)) *
				this.controller.amplitude *
				this.amplitude *
				this.controller.MAX *
				Math.pow(1 / (1 + Math.pow(this.open_class * i, 2)), 2)
			if (Math.abs(y) < 0.001) this.respawn()
			return y
		}

		_draw(m: number) {
			this.tick += this.controller.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI))
			const ctx = this.controller.ctx
			ctx.beginPath()
			const x_base = this.controller.width / 2 + (-this.controller.width / 4 + this.seed * (this.controller.width / 2))
			const y_base = this.controller.height / 2
			let x_init: number | undefined
			for (let i = -3; i <= 3; i += 0.01) {
				const x = x_base + i * this.controller.width / 4
				const y = y_base + m * this.equation(i)
				x_init = x_init ?? x
				ctx.lineTo(x, y)
			}
			const h = Math.abs(this.equation(0))
			const gradient = ctx.createRadialGradient(x_base, y_base, h * 1.15, x_base, y_base, h * 0.3)
			gradient.addColorStop(0, `rgba(${this.color.join(',')},0.4)`)
			gradient.addColorStop(1, `rgba(${this.color.join(',')},0.2)`)
			ctx.fillStyle = gradient
			ctx.lineTo(x_init!, y_base)
			ctx.closePath()
			ctx.fill()
		}

		draw() {
			this._draw(-1)
			this._draw(1)
		}
	}

	class SiriWave9 {
		COLORS = [
			[32, 133, 252],
			[94, 252, 169],
			[253, 71, 103],
		]
		tick = 0
		run = false
		ratio = window.devicePixelRatio || 1
		curves: SiriWave9Curve[] = []
		width: number
		height: number
		MAX: number
		speed: number
		amplitude: number
		canvas: HTMLCanvasElement
		ctx: CanvasRenderingContext2D
		container: HTMLDivElement

		constructor(opt: { container: HTMLDivElement; height?: number; speed?: number; amplitude?: number; autostart?: boolean }) {
			this.container = opt.container
			this.width = this.ratio * this.container.offsetWidth
			this.height = this.ratio * (opt.height || 120)
			this.MAX = this.height / 2
			this.speed = opt.speed || 0.05
			this.amplitude = opt.amplitude || 1

			this.canvas = document.createElement('canvas')
			this.canvas.width = this.width
			this.canvas.height = this.height
			this.canvas.style.width = '100%'
			this.canvas.style.height = `${this.height / this.ratio}px`
			this.container.appendChild(this.canvas)
			this.ctx = this.canvas.getContext('2d')!

			for (let i = 0; i < this.COLORS.length; i++) {
				const color = this.COLORS[i]
				for (let j = 0; j < (3 * Math.random()) | 0; j++) {
					this.curves.push(new SiriWave9Curve({ controller: this, color }))
				}
			}

			if (opt.autostart) this.start()
		}

		_clear() {
			this.ctx.globalCompositeOperation = 'destination-out'
			this.ctx.fillRect(0, 0, this.width, this.height)
			this.ctx.globalCompositeOperation = 'lighter'
		}

		_draw() {
			if (!this.run) return
			this._clear()
			for (let i = 0; i < this.curves.length; i++) this.curves[i].draw()
			requestAnimationFrame(this._draw.bind(this))
		}

		start() {
			this.tick = 0
			this.run = true
			this._draw()
		}

		stop() {
			this.tick = 0
			this.run = false
		}
	}

	return (
		<div className="relative overflow-hidden p-4 border border-dracula-dracula shadow-lg">
			{data.love && (
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

			<a href={data.url} className="flex items-center gap-5">
				<div className="relative flex-shrink-0">
					<img
						src={data.image}
						alt={data.title}
						title={data.title}
						width={100}
						height={100}
						className="block animate-spin-slow rounded-full"
					/>
				</div>
				<div className="flex flex-col">
					<p className="text-sm font-medium text-gray-300 md:text-lg">{data.artist}</p>
					<p className="text-lg font-semibold text-dracula-cullen md:text-2xl">{data.title}</p>
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

					<div ref={waveContainerRef} className="w-full h-32 mt-4"></div>

					<audio
						ref={audioRef}
						src={data.preview}
						onTimeUpdate={handleTimeUpdate}
						onEnded={handleEnded}
					/>

					<div className="flex items-center gap-2 text-dracula-cullen text-sm">
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
