import siteMetadata from "../../data/siteMetadata"

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const siteUrl = searchParams.get('url')
	if (!siteUrl) return new Response('Missing URL', { status: 400 })

	try {
		const response = await fetch(siteUrl)
		if (!response.ok) throw new Error('Failed to fetch site')

		const html = await response.text()
		const linkTags = [
			...html.matchAll(
				/<link\s+[^>]*rel=["']?(?:icon|shortcut icon)["']?[^>]*>/gi,
			),
		]

		let bestFavicon = { href: '', size: 0, type: '' }

		for (const tag of linkTags) {
			const href = tag[0].match(/href=["']?([^"'>\s]+)["']?/)?.[1]
			if (!href) continue

			const sizes = tag[0].match(/sizes=["']?([^"'>\s]+)["']?/)?.[1] ?? ''
			const size = sizes.split('x')[0]
				? Number.parseInt(sizes.split('x')[0] || '0')
				: 0
			const type = tag[0].match(/type=["']?([^"'>\s]+)["']?/)?.[1] ?? ''
			const isSvg = type === 'image/svg+xml' || href.endsWith('.svg')
			const currentIsSvg =
				bestFavicon.type === 'image/svg+xml' ||
				bestFavicon.href.endsWith('.svg')

			if (
				(isSvg && !currentIsSvg) ||
				(!isSvg &&
					!currentIsSvg &&
					(size > bestFavicon.size || !bestFavicon.href))
			) {
				bestFavicon = { href, size, type }
			}
		}

		if (!bestFavicon.href) bestFavicon.href = '/favicon.ico'

		if (bestFavicon.href.startsWith('data:')) {
			const [meta, base64] = bestFavicon.href.split(',')
			const mimeMatch = meta?.match(/data:([^;]+);base64/)
			const mime = mimeMatch?.[1] ?? 'image/png'

			if (!base64) throw new Error('Invalid base64 data')
			const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))

			return new Response(binary, {
				status: 200,
				headers: {
					'Content-Type': mime,
					'Cache-Control': 'public, max-age=86400',
				},
			})
		}

		const base = new URL(siteUrl)
		let faviconUrl = bestFavicon.href

		try {
			faviconUrl = new URL(faviconUrl, base).toString()
		} catch {
			faviconUrl = `${base.protocol}//${base.hostname}/favicon.ico`
		}

		if (!/\.(ico|png|jpg|jpeg|svg)$/.test(faviconUrl)) {
			const ext =
				{
					'image/x-icon': '.ico',
					'image/png': '.png',
					'image/jpeg': '.jpg',
					'image/svg+xml': '.svg',
				}[bestFavicon.type] ?? '.ico'
			faviconUrl += ext
		}

		const iconResponse = await fetch(faviconUrl)
		if (!iconResponse.ok) throw new Error('Failed to fetch icon')

		const iconBuffer = await iconResponse.arrayBuffer()
		const contentType = iconResponse.headers.get('content-type') || 'image/png'

		return new Response(iconBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400',
			},
		})
	} catch {
		// Try your own public fallback first
		try {
			const localFavicon = await fetch(`${siteMetadata.siteUrl}/favicon.ico`) // adjust port as needed
			if (localFavicon.ok) {
				const buffer = await localFavicon.arrayBuffer()
				return new Response(buffer, {
					status: 200,
					headers: {
						'Content-Type': 'image/x-icon',
						'Cache-Control': 'public, max-age=86400',
					},
				})
			}
		} catch {
			// If even that fails, fall back to DuckDuckGo
			const fallback = `https://icons.duckduckgo.com/ip3/${new URL(siteUrl).hostname}.ico`
			const response = await fetch(fallback)
			if (!response.ok)
				return new Response('Failed to fetch fallback', { status: 500 })

			const buffer = await response.arrayBuffer()
			return new Response(buffer, {
				status: 200,
				headers: {
					'Content-Type': 'image/x-icon',
					'Cache-Control': 'public, max-age=86400',
				},
			})
		}
	}
}