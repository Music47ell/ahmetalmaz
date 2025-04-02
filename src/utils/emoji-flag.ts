const getFlagEmoji = (countryCode: string) => {
	return [...countryCode.toUpperCase()]
		.map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
		.reduce((a, b) => `${a}${b}`)
}

export { getFlagEmoji }
