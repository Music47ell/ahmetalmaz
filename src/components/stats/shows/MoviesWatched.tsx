import type React from 'react'

interface Movie {
	title: string
	poster: string
	url: string
	rating: number | null
  watched: Date
}

interface WatchedMoviesProps {
	movies: Movie[]
}

const WatchedMovies: React.FC<WatchedMoviesProps> = ({ movies }) => {
	if (!movies.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="grid gap-2 py-2 md:grid-cols-2 border border-dracula-dracula">
			{movies.map((movie) => (
				<a
					key={`${movie.title}-${movie.poster}-${movie.url}`}
					href={movie.url}
					target="_blank"
					rel="noopener noreferrer"
					className="relative flex items-center gap-5 overflow-hidden p-4"
				>
					{movie.poster ? (
						<img
							src={movie.poster}
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
						<p className="origin-left text-base font-semibold text-dracula-cullen md:text-xl">
							{movie.title}
						</p>
            {movie.rating !== null && (
            <p className="text-xs text-dracula-marcelin">Rating: {movie.rating} ♥</p>
            )}
					</div>
				</a>
			))}
		</div>
	)
}

export default WatchedMovies
