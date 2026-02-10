import type React from 'react'

interface Book {
	title: string
	link: string
	readDate: string
	rating: number
	author: string
	poster: string
}

interface BooksReadProps {
	books: Book[]
}

const BooksRead: React.FC<BooksReadProps> = ({ books }) => {
	if (!books.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="grid gap-2 py-2 md:grid-cols-2 border border-dracula-dracula">
			{books.map((book) => (
				<a
					key={`${book.title}-${book.author}`}
					href={book.link}
					target="_blank"
					rel="noopener noreferrer"
					className="relative flex items-center gap-5 overflow-hidden p-4"
				>
					{book.poster ? (
						<img
							src={book.poster}
							alt={book.title}
							className="h-40 w-28 object-cover"
							loading="lazy"
						/>
					) : (
						<div className="h-32 w-32 animate-pulse bg-white" />
					)}
					<div className="flex flex-col">
						<p className="text-base font-semibold text-dracula-cullen md:text-xl">{book.title}</p>
						<p className="text-xs text-yellow-400">Rating: {book.rating} ★</p>
					</div>
				</a>
			))}
		</div>
	)
}

export default BooksRead
