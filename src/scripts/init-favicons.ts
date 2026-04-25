export const initFavicons = () => {
	const services = [
		{
			get() {
				return {
					title: 'Reddit - Dive into anything',
					favicon: '/images/favicons/reddit.png',
				}
			},
		},
		{
			get() {
				return {
					title: "X. It's what's happening / X",
					favicon: '/images/favicons/x.png',
				}
			},
		},
		{
			get() {
				return {
					title: 'Discover - Bluesky',
					favicon: '/images/favicons/bluesky.png',
				}
			},
		},
		{
			get() {
				return {
					title: 'Wikipedia',
					favicon: '/images/favicons/wikipedia.ico',
				}
			},
		},
		{
			get() {
				return {
					title: 'Friends (TV Series 1994–2004) - IMDb',
					favicon: '/images/favicons/imdb.png',
				}
			},
		},
		{
			get() {
				return {
					title: 'Twitter',
					favicon: '/images/favicons/twitter.ico',
				}
			},
		},
		{
			get() {
				return {
					title: 'Explore - Find your favourite videos on TikTok',
					favicon: '/images/favicons/tiktok.png',
				}
			},
		},
		{
			get() {
				const count = Math.floor(Math.random() * 99) + 1
				return {
					title: `(${count}) Facebook`,
					favicon: '/images/favicons/facebook.ico',
				}
			},
		},
		{
			get() {
				const count = Math.floor(Math.random() * 10) + 1
				return {
					title: `(${count}) Instagram`,
					favicon: '/images/favicons/instagram.png',
				}
			},
		},
		{
			get() {
				const randomCount = Math.floor(Math.random() * 12)
				let count = randomCount
				let display = randomCount

				if (randomCount === 11) {
					count = 50
					display = '50+'
				} else if (randomCount === 12) {
					count = 100
					display = '100+'
				}

				return {
					title: display ? `Inbox (${display})` : 'Inbox',
					favicon: `/images/favicons/gmail_${count}.png`,
				}
			},
		},
	]

	const originalTitle = document.title
	const originalLinks = Array.from(
		document.querySelectorAll("link[rel~='icon'], link[rel='shortcut icon']"),
	).map((link) => link.cloneNode(true))

	if (!originalLinks.length) return

	const randomService = () =>
		services[Math.floor(Math.random() * services.length)]?.get()

	const clearFavicons = () => {
		document
			.querySelectorAll("link[rel~='icon'], link[rel='shortcut icon']")
			.forEach((link) => link.remove())
	}

	const setFavicon = (href: string) => {
		clearFavicons()
		const link = document.createElement('link')
		link.rel = 'icon'
		link.type = 'image/x-icon'
		link.href = `${href}?v=${Date.now()}`
		document.head.appendChild(link)
	}

	const restoreFavicons = () => {
		clearFavicons()
		originalLinks.forEach((link) =>
			document.head.appendChild(link.cloneNode(true)),
		)
	}

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			const service = randomService()
			if (!service) return
			document.title = service.title
			setFavicon(service.favicon)
			return
		}

		document.title = originalTitle
		restoreFavicons()
	})
}
