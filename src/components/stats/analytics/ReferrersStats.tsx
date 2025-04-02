interface Referrer {
	referrers: { referrer: string; total: number }[]
	title: string
}

const ReferrerList: React.FC<Referrer> = ({ title, referrers }) => {
	if (!referrers || referrers.length === 0) {
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

			{referrers.length > 0 ? (
				<ul className="m-0 p-0 border border-yellow-500 px-4 py-2">
					{referrers.map(({ referrer, total }, index) => (
						<li
							key={`${referrer}-${total}`}
							className="m-0 p-0 flex items-center gap-4 leading-[3rem]"
						>
							<small className="flex shrink-0 items-center justify-center w-6 h-6 font-bold leading-4 border-2">
								{index + 1}
							</small>

							<div className="truncate">
								<a
									href={referrer}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm"
								>
									{referrer}
								</a>
							</div>

							<strong className="flex justify-end grow">{`x${total}`}</strong>
						</li>
					))}
				</ul>
			) : (
				<p>No data available.</p>
			)}
		</div>
	)
}

export default ReferrerList
