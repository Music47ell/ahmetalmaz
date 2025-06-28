'use client'

import { useEffect, useState } from 'react'

export default function NowWatching() {
	const [data, setData] = useState({
		title: '',
		image: '',
		url: '/',
		isWatching: false,
	})

	useEffect(() => {
		const fetchNowWatching = async () => {
			try {
				const res = await fetch('/api/trakt/now-watching')
				const nowWatchingData = await res.json()
				setData(nowWatchingData)
			} catch (error) {
				console.error('Error fetching now watching data:', error)
			}
		}

		fetchNowWatching()
	}, [])

	if (!data.isWatching) return null

	return (
		<div className="overflow-hidden p-4 border border-zinc-500 bg-zinc-800 shadow-lg transition transform hover:scale-105 hover:shadow-xl">
			<a href={data.url} className="flex relative items-center gap-5">
				<div className="relative origin-center">
					<img
						src={data.image}
						alt={data.title}
						title={data.title}
						width={100}
						height={100}
						className="block rounded-full"
					/>
				</div>
				<div>
					<p className="origin-left text-base font-semibold text-white md:text-xl">
						{data.title}
					</p>
				</div>
			</a>
		</div>
	)
}
