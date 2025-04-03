import { visit } from 'unist-util-visit'

export default function rehypeExternalUrlsFavicons() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (tree: any) => {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'a' && node.properties?.href) {
				const url = node.properties.href
				if (url.startsWith('http')) {
					const domain = new URL(url).hostname
					const faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`

					// Ensure the link itself has the necessary Tailwind classes
					node.properties.className = [
						...(node.properties.className || []),
						'inline-flex',
						'items-center',
						'gap-1', // Spacing between text and icon
					]

					node.children.push({
						type: 'element',
						tagName: 'img',
						properties: {
							src: faviconUrl,
							alt: domain,
							width: '16',
							height: '16',
							className: 'w-4 h-4 inline-block ml-1 -mt-px mb-0',
							loading: 'lazy',
						},
					})
				}
			}
		})
	}
}
