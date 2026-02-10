'use client'

import { useEffect, useState } from 'react'
import GoodreadsStats from './GoodreadsStats'
import BooksRead from './BooksRead'

const apiBaseUrl = import.meta.env.PUBLIC_API_BASE_URL;

const BooksStats = () => {
	const [stats, setStats] = useState<{
		readingSince: string
		totalBooks: number
		totalPages: number
		totalWords: number
		totalDaysReading: number
		uniqueAuthors: number
	}>({
		readingSince: '',
		totalBooks: 0,
		totalPages: 0,
		totalWords: 0,
		totalDaysReading: 0,
		uniqueAuthors: 0,
	})

	const [books, setBooks] = useState<
		{
			title: string
			link: string
			readDate: string
			rating: number
			author: string
			poster: string
		}[]
	>([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsRes, booksRes] = await Promise.all([
					fetch(`${apiBaseUrl}/goodreads/stats`),
					fetch(`${apiBaseUrl}/goodreads/books-read`),
				])

				if (statsRes.ok && booksRes.ok) {
					const statsData = await statsRes.json()
					const booksData = await booksRes.json()

					setStats(statsData)
					setBooks(booksData)
				} else {
					console.error('One or more requests failed.')
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}

		fetchData()
	}, [])

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-3 flex items-center justify-between">
				<h2 className="uppercase font-semibold tracking-wide">Goodreads Stats</h2>
				<span className="text-xs text-yellow-400 tracking-wider whitespace-nowrap flex items-center">
					<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><title>Powered by Goodreads</title><path fill="#1E1914" d="M17.346.026c.422-.083.859.037 1.179.325.346.284.55.705.557 1.153-.023.457-.247.88-.612 1.156l-2.182 1.748a.601.601 0 0 0-.255.43.52.52 0 0 0 .11.424 5.886 5.886 0 0 1 .832 6.58c-1.394 2.79-4.503 3.99-7.501 2.927a.792.792 0 0 0-.499-.01c-.224.07-.303.18-.453.383l-.014.02-.941 1.254s-.792.985.457.935c3.027-.119 3.817-.119 5.439-.01 2.641.18 3.806 1.903 3.806 3.275 0 1.623-1.036 3.383-3.809 3.383a117.46 117.46 0 0 0-5.517-.03c-.31.005-.597.013-.835.02-.228.006-.41.011-.52.011-.712 0-1.648-.186-1.66-1.068-.008-.729.624-1.12 1.11-1.172.43-.045.815.007 1.24.064.252.034.518.07.815.088.185.011.366.025.552.038.53.038 1.102.08 1.926.087.427.005.759.01 1.025.015.695.012.941.016 1.28-.015 1.248-.112 1.832-.61 1.832-1.376 0-.805-.584-1.264-1.698-1.414-1.564-.213-2.33-.163-3.72-.074a87.66 87.66 0 0 1-1.669.095c-.608.029-2.449.026-2.682-1.492-.053-.416-.073-1.116.807-2.325l.75-1.003c.36-.49.582-.898.053-1.559 0 0-.39-.468-.52-.638-1.215-1.587-1.512-4.08-.448-6.114 1.577-3.011 5.4-4.26 8.37-2.581.253.143.438.203.655.163.201-.032.27-.167.363-.344.02-.04.042-.082.067-.126.004-.01.241-.465.535-1.028l.734-1.41a1.493 1.493 0 0 1 1.041-.785ZM9.193 13.243c1.854.903 3.912.208 5.254-2.47 1.352-2.699.827-5.11-1.041-6.023C10.918 3.537 8.81 5.831 8.017 7.41c-1.355 2.698-.717 4.886 1.147 5.818Z"/></svg>
				</span>
			</div>

			<GoodreadsStats stats={stats} />

			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">Recently Read Books</h2>
			</div>
			<BooksRead books={books} />
		</div>
	)
}

export default BooksStats
