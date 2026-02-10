import type React from 'react'

interface Show {
  title: string
  poster: string
  url: string
  rating: number | null
  watched: Date
}

interface WatchedShowsProps {
  shows: Show[]
}

const WatchedShows: React.FC<WatchedShowsProps> = ({ shows }) => {
  if (!shows.length) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-2 py-2 md:grid-cols-2 border border-dracula-dracula">
      {shows.map((show) => (
        <a
          key={`${show.title}-${show.url}`}
          href={show.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center gap-5 overflow-hidden p-4"
        >
          {show.poster ? (
            <img
              src={show.poster}
              alt={show.title}
              className="h-40 w-28 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-32 w-32 animate-pulse bg-white" />
          )}

          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-dracula-cullen md:text-xl">
              {show.title}
            </p>
            {show.rating !== null && (
            <p className="text-xs text-dracula-marcelin">Rating: {show.rating} ♥</p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}

export default WatchedShows
