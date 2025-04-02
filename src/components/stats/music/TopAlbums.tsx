import type React from 'react'

interface Album {
	image?: string
	title: string
}

interface TopAlbumsProps {
	albums: Album[]
}

const TopAlbums: React.FC<TopAlbumsProps> = ({ albums }) => {
	if (!albums || albums.length === 0) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="grid gap-2 py-2 md:grid-cols-2 border border-yellow-500">
			{albums.map((album) => (
				<div
					key={`${album.title}-${album.image}`}
					className="relative flex items-center gap-5 overflow-hidden p-4"
				>
					<img
						src={`https://wsrv.nl/?url=${album.image}`}
						alt={album.title}
						className="h-32 w-32"
						width="100"
						height="100"
						loading="lazy"
					/>
					<div>
						<p className="origin-left text-base font-semibold text-white md:text-xl">
							{album.title}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default TopAlbums
