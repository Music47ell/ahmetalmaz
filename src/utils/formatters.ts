const displayDate = (date: string) => {
	const currentDate = new Date()
	const targetDate = new Date(date)

	const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
	const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
	const daysAgo = currentDate.getDate() - targetDate.getDate()

	let formattedDate = ''

	if (yearsAgo > 0) {
		formattedDate = `${yearsAgo}y ago`
	} else if (monthsAgo > 0) {
		formattedDate = `${monthsAgo}mo ago`
	} else if (daysAgo > 0) {
		formattedDate = `${daysAgo}d ago`
	} else {
		formattedDate = 'Today'
	}

	const fullDate = targetDate.toLocaleString('en-us', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

	return `${fullDate} (${formattedDate})`
}

const displayNumbers = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0,
})

const minutesToDays = (minutes: number) => {
	const minutesInDay = 24 * 60 // 24 hours * 60 minutes
	return minutes / minutesInDay
}

export { displayDate, displayNumbers, minutesToDays }
