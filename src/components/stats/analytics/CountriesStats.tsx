interface Countries {
	title: string
	countries: { country: string; flag: string; total: number }[]
}

const CountryList: React.FC<Countries> = ({ title, countries }) => {
	if (!countries || countries.length === 0) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">{title}</h2>
			</div>

			{countries.length > 0 ? (
				<ul className="m-0 p-0 border border-yellow-500 px-4 py-2">
					{countries.map(({ country, flag, total }, index) => (
						<li
							key={`${country}-${flag}-${total}`}
							className="m-0 p-0 flex items-center gap-4 leading-[3rem]"
						>
							<small className="flex shrink-0 items-center justify-center w-6 h-6 font-bold leading-4 border-2">
								{index + 1}
							</small>

							<div className="flex grow items-center gap-2">
								<span className="mt-1">{flag}</span>
								<span>{country}</span>
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

export default CountryList
