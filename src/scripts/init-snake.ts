export const initSnake = () => {
	const gameWidth = 15
	const gameHeight = 13
	const introAttributeNames = 'clicksnake'.split('')
	const gameAttributeNames = 'playsnakegame'.split('')

	let firstElement: ChildNode | null
	const divs: HTMLDivElement[] = []
	let mode = 'intro'
	let snake: Array<{ x: number; y: number }> = []
	const map: Record<string, number> = {}
	let direction: number
	let newDirection: number | null
	let score: number
	let highScore = 0

	let lastMove = Date.now()
	let gameOverTime = 0
	let flipFlop = 0

	const wait = (milliseconds: number) =>
		new Promise((resolve) => {
			window.setTimeout(resolve, milliseconds)
		})

	const addApple = () => {
		let x = 0
		let y = 0

		do {
			x = Math.floor(Math.random() * gameWidth)
			y = Math.floor(Math.random() * gameHeight)
		} while (map[`${x},${y}`] !== 0)

		map[`${x},${y}`] = 2
	}

	const renderGame = () => {
		divs.forEach((div, y) => {
			if (y === 0) {
				div.setAttribute('score', `${score}`)
				div.setAttribute('high-score', `${highScore}`)
				return
			}

			const mapY = y - 1
			let line = ''

			for (let x = 0; x < gameWidth; x++) {
				const tile = map[`${x},${mapY}`]
				if (tile === 1) line += '🐍'
				else if (tile === 2) line += '🍎'
				else if (tile === 3) line += '💥'
				else line += '⬜'
			}

			line += flipFlop ? ' ' : '⠀'
			div.setAttribute(gameAttributeNames[mapY] ?? '', line)
		})

		flipFlop = flipFlop ? 0 : 1
	}

	const renderGameover = () => {
		const n = Math.floor((Date.now() - gameOverTime) / 100)
		if (n < snake.length) {
			const a = Math.floor(Date.now() / 50) % 2
			if (a) {
				const segment = snake[n]
				if (!segment) return
				map[`${segment.x},${segment.y}`] = 3
				renderGame()
			}
			return
		}

		const b = Math.floor(Date.now() / 1000) % 2
		if (b) {
			for (let y = 0; y < gameHeight; y++) {
				const div = divs[y + 1]
				if (!div) continue
				div.setAttribute(
					gameAttributeNames[y] ?? '',
					' GAME OVER GAME OVER GAME OVER ',
				)
			}
			return
		}

		renderGame()
	}

	const renderIntro = () => {
		const i = Math.floor(
			Math.sin(Date.now() / 700) * (divs.length / 2) + divs.length / 2,
		)
		divs.forEach((div, y) => {
			if (y === i) {
				div.setAttribute(
					introAttributeNames[y] ?? '',
					' . OKAY now CLICK the SNAKE! . ',
				)
				return
			}

			div.setAttribute(
				introAttributeNames[y] ?? '',
				' . . . . . . . . . . . . . . . ',
			)
		})
	}

	const gameMove = () => {
		const head = snake[0]
		if (!head) return

		const newHead = { x: head.x, y: head.y }

		if (newDirection !== null) {
			if (newDirection === 0 && direction !== 2) direction = 0
			else if (newDirection === 1 && direction !== 3) direction = 1
			else if (newDirection === 2 && direction !== 0) direction = 2
			else if (newDirection === 3 && direction !== 1) direction = 3
			newDirection = null
		}

		if (direction === 0) newHead.x += 1
		else if (direction === 1) newHead.y += 1
		else if (direction === 2) newHead.x -= 1
		else if (direction === 3) newHead.y -= 1

		if (newHead.x < 0) newHead.x = gameWidth - 1
		else if (newHead.x > gameWidth - 1) newHead.x = 0
		if (newHead.y < 0) newHead.y = gameHeight - 1
		else if (newHead.y > gameHeight - 1) newHead.y = 0

		const oldTile = map[`${newHead.x},${newHead.y}`]
		snake.unshift(newHead)
		map[`${newHead.x},${newHead.y}`] = 1

		if (oldTile === 2) {
			score += 1
			if (score > highScore) {
				highScore = score
				try {
					localStorage.setItem('snake-high-score', `${highScore}`)
				} catch {}
			}
			addApple()
			return
		}

		if (oldTile === 1) {
			gameOverTime = Date.now()
			mode = 'gameover'
			return
		}

		const oldTail = snake.pop()
		if (oldTail) map[`${oldTail.x},${oldTail.y}`] = 0
	}

	const loop = () => {
		window.setTimeout(loop, 1000 / 30)

		if (mode === 'intro') {
			renderIntro()
			return
		}

		if (mode === 'game') {
			const now = Date.now()
			if (now - lastMove > 100) {
				lastMove = now
				gameMove()
			}
			renderGame()
			return
		}

		if (mode === 'gameover') renderGameover()
	}

	const startGame = async () => {
		if (mode !== 'intro') return

		mode = 'setup'
		const midY = Math.floor(gameHeight / 2)
		snake = []
		direction = 0
		newDirection = null
		score = 0

		try {
			const saved = Number.parseInt(
				localStorage.getItem('snake-high-score') ?? '0',
			)
			if (saved > highScore) highScore = saved
		} catch {}

		while (divs.length > 1) {
			const div = divs.pop()
			if (!div) break
			await wait(50)
			div.parentElement?.removeChild(div)
		}

		divs[0]?.removeAttribute(introAttributeNames[0] ?? '')
		mode = 'game'

		while (divs.length < gameHeight + 1) {
			await wait(50)
			const div = document.createElement('div')
			document.body.insertBefore(div, firstElement)
			divs.push(div)
		}

		for (let x = 0; x < gameWidth; x++) {
			for (let y = 0; y < gameHeight; y++) {
				map[`${x},${y}`] = 0
			}
		}

		for (let i = 0; i < 4; i++) {
			map[`${i},${midY}`] = 1
			snake.unshift({ x: i, y: midY })
		}

		addApple()
	}

	const keydown = (event: KeyboardEvent) => {
		const key = event.which
		if (key === 39) newDirection = 0
		else if (key === 40) newDirection = 1
		else if (key === 37) newDirection = 2
		else if (key === 38) newDirection = 3
	}

	if ((window as Window & { __snakeInitialized?: boolean }).__snakeInitialized)
		return
	;(window as Window & { __snakeInitialized?: boolean }).__snakeInitialized =
		true

	firstElement = document.body.firstChild
	for (let i = 0; i < 10; i++) {
		const div = document.createElement('div')
		document.body.insertBefore(div, firstElement)
		divs.push(div)
	}

	window.addEventListener('keydown', keydown)
	const snakeTrigger = document.querySelector(
		'[data-snake-trigger="alt-avatar"]',
	)
	if (snakeTrigger) snakeTrigger.addEventListener('click', startGame)
	loop()
}
