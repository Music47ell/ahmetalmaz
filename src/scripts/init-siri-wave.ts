class SiriWave9Curve {
	private controller: SiriWave9
	private color: number[]
	private tick = 0
	private amplitude = 0
	private seed = 0
	private openClass = 2

	constructor(opt: { controller: SiriWave9; color: number[] }) {
		this.controller = opt.controller
		this.color = opt.color
		this.respawn()
	}

	private respawn() {
		this.amplitude = 0.3 + Math.random() * 0.7
		this.seed = Math.random()
		this.openClass = 2 + ((Math.random() * 3) | 0)
	}

	private equation(i: number) {
		const p = this.tick
		const y =
			-Math.abs(Math.sin(p)) *
			this.controller.amplitude *
			this.amplitude *
			this.controller.max *
			Math.pow(1 / (1 + Math.pow(this.openClass * i, 2)), 2)

		if (Math.abs(y) < 0.001) this.respawn()
		return y
	}

	private drawDirection(multiplier: number) {
		this.tick +=
			this.controller.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI))

		const ctx = this.controller.ctx
		ctx.beginPath()

		const xBase =
			this.controller.width / 2 +
			(-this.controller.width / 4 + this.seed * (this.controller.width / 2))
		const yBase = this.controller.height / 2

		let xStart = xBase
		for (let i = -3; i <= 3; i += 0.01) {
			const x = xBase + (i * this.controller.width) / 4
			const y = yBase + multiplier * this.equation(i)
			xStart = Math.min(xStart, x)
			ctx.lineTo(x, y)
		}

		const h = Math.abs(this.equation(0))
		const gradient = ctx.createRadialGradient(
			xBase,
			yBase,
			h * 1.15,
			xBase,
			yBase,
			h * 0.3,
		)
		gradient.addColorStop(0, `rgba(${this.color.join(',')},0.4)`)
		gradient.addColorStop(1, `rgba(${this.color.join(',')},0.2)`)
		ctx.fillStyle = gradient
		ctx.lineTo(xStart, yBase)
		ctx.closePath()
		ctx.fill()
	}

	draw() {
		this.drawDirection(-1)
		this.drawDirection(1)
	}
}

class SiriWave9 {
	public readonly width: number
	public readonly height: number
	public readonly max: number
	public readonly speed: number
	public readonly amplitude: number
	public readonly ctx: CanvasRenderingContext2D
	private readonly ratio = window.devicePixelRatio || 1
	private readonly curves: SiriWave9Curve[] = []
	private running = false

	constructor(opt: {
		container: HTMLElement
		height?: number
		speed?: number
		amplitude?: number
		autostart?: boolean
	}) {
		this.width = this.ratio * opt.container.offsetWidth
		this.height = this.ratio * (opt.height || 120)
		this.max = this.height / 2
		this.speed = opt.speed || 0.05
		this.amplitude = opt.amplitude || 1

		const canvas = document.createElement('canvas')
		canvas.width = this.width
		canvas.height = this.height
		canvas.style.width = '100%'
		canvas.style.height = `${this.height / this.ratio}px`
		opt.container.appendChild(canvas)

		const context = canvas.getContext('2d')
		if (!context) throw new Error('Unable to initialize wave canvas context')
		this.ctx = context

		const colors = [
			[32, 133, 252],
			[94, 252, 169],
			[253, 71, 103],
		]

		for (const color of colors) {
			for (let j = 0; j < ((3 * Math.random()) | 0); j++) {
				this.curves.push(new SiriWave9Curve({ controller: this, color }))
			}
		}

		if (opt.autostart) this.start()
	}

	private clear() {
		this.ctx.globalCompositeOperation = 'destination-out'
		this.ctx.fillRect(0, 0, this.width, this.height)
		this.ctx.globalCompositeOperation = 'lighter'
	}

	private draw = () => {
		if (!this.running) return
		this.clear()
		for (const curve of this.curves) curve.draw()
		window.requestAnimationFrame(this.draw)
	}

	start() {
		this.running = true
		this.draw()
	}
}

export const startSiriWave = (container: HTMLElement) => {
	if (container.dataset.waveInitialized === 'true') return
	container.dataset.waveInitialized = 'true'

	new SiriWave9({
		height: 120,
		speed: 0.01,
		amplitude: 1,
		container,
		autostart: true,
	})
}
