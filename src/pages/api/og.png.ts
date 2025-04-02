import satori, { type Font } from 'satori'
import { html } from 'satori-html'
import sharp from 'sharp'
import * as fs from 'node:fs/promises'
import type { APIContext } from 'astro'
import siteMetadata from '@/data/siteMetadata'

export class ImageResponse extends Response {
	constructor(template = '') {
		const result = new ReadableStream({
			async start(controller) {
				try {
					const markup = html(template) as React.ReactNode
					const font: Font = {
						name: 'Alef',
						data: await fetch(
							'https://fonts.gstatic.com/s/alef/v12/FeVfS0NQpLYgrjJbC5FxxbU.ttf',
						).then((res) => res.arrayBuffer()),
						weight: 400,
						style: 'normal',
					}

					const svg = await satori(markup, {
						width: 1200,
						height: 630,
						fonts: [font],
					})

					const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
					controller.enqueue(pngBuffer)
					controller.close()
				} catch (error) {
					console.error('Error generating image:', error)
					controller.close()
				}
			},
		})

		super(result, {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control':
					process.env.NODE_ENV === 'development'
						? 'no-cache, no-store'
						: 'public, immutable, no-transform, max-age=31536000',
			},
		})
	}
}

export async function GET({ request }: APIContext) {
	try {
		const { searchParams } = new URL(request.url)
		const title = searchParams.get('title') || siteMetadata.name

		const imageBuffer = await fs.readFile('./public/images/others/me.png')
		const resizedImage = await sharp(imageBuffer).resize(128).png().toBuffer()
		const imgSrc = `data:image/png;base64,${resizedImage.toString('base64')}`

		const template = `
      <div tw="flex flex-col justify-center w-full h-full p-12 items-center bg-[#282a36]">
        <h1 tw="text-5xl text-gray-100 m-auto">${title}</h1>
        <div tw="flex flex-row items-center">
          <img src="${imgSrc}" tw="rounded-full w-20 h-20 mr-3" alt="${siteMetadata.name}" />
          <span tw="text-3xl text-gray-100">${siteMetadata.name}</span>
        </div>
      </div>
    `

		return new ImageResponse(template)
	} catch (error) {
		console.error('Error generating image:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}
