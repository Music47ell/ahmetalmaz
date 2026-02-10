interface City {
	title: string
	cities: { city: string; flag: string; total: number }[]
}

const CityList: React.FC<City> = ({ title, cities }) => {
	if (!cities || cities.length === 0) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">{title}</h2>
			</div>

			{cities.length > 0 ? (
				<ul className="m-0 p-0 border border-dracula-dracula px-4 py-2">
					{cities.map(({ city, flag, total }, index) => (
						<li
							key={`${city}-${flag}-${total}`}
							className="m-0 p-0 flex items-center gap-4 leading-[3rem]"
						>
							<small className="flex shrink-0 items-center justify-center w-6 h-6 font-bold leading-4 border-2">
								{index + 1}
							</small>

							<div className="flex grow items-center gap-2">
								<span className="mt-1">{flag}</span>
								<span>{city}</span>
							</div>
							<strong>{`x${total}`}</strong>
						</li>
					))}
				</ul>
			) : (
				<p>No data available.</p>
			)}
		</div>
	)
}

export default CityList
