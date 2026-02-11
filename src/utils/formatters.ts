const displayDate = (date: string) => {
	const targetDate = new Date(date)

	return targetDate.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

const displayNumbers = new Intl.NumberFormat('en-US', {
	maximumFractionDigits: 0,
})

const minutesToDays = (minutes: number) => {
	const minutesInDay = 24 * 60 // 24 hours * 60 minutes
	return minutes / minutesInDay
}

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;


export { displayDate, displayNumbers, minutesToDays, capitalize }
