import type React from 'react'

interface Movie {
	title: string
	poster: string
	url: string
}

interface WatchedMoviesProps {
	movies: Movie[]
}

const WatchedMovies: React.FC<WatchedMoviesProps> = ({ movies }) => {
	if (!movies.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="grid gap-2 py-2 md:grid-cols-2 border border-yellow-500">
			{movies.map((movie) => (
				<div
					key={`${movie.title}-${movie.poster}-${movie.url}`}
					className="relative flex items-center gap-5 overflow-hidden p-4"
				>
					{movie.poster ? (
						<img
							src={`https://wsrv.nl/?url=${movie.poster}`}
							alt={movie.title}
							className="h-40 w-28"
							width={64}
							height={64}
							loading="lazy"
						/>
					) : (
						<div className="h-32 w-32 animate-pulse bg-white" />
					)}
					<div>
						<p className="origin-left text-base font-semibold text-white md:text-xl">
							{movie.title}
						</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default WatchedMovies
