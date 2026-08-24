import { visit } from 'unist-util-visit'

export default function rehypeExternalUrlsFavicons() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (tree: any) => {
		visit(tree, 'element', (node) => {
			if (node.tagName === 'a' && node.properties?.href) {
				const url = node.properties.href
				if (url.startsWith('http')) {
					const domain = new URL(url).hostname
					const faviconUrl = `https://favicon.controld.com/${domain}`

					node.properties.className = [
						...(node.properties.className || []),
						'inline-flex',
						'items-center',
						'gap-1',
					]

					node.children.unshift({
						type: 'element',
						tagName: 'img',
						properties: {
							src: faviconUrl,
							alt: domain,
							width: '16',
							height: '16',
							className: 'w-4 h-4 inline-block m-0 not-prose',
							loading: 'lazy',
						},
					})
				}
			}
		})
	}
}
