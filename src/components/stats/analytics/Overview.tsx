interface Props {
	title: string
	lastDay?: { total: string }[]
	lastWeek?: { total: string }[]
	lastMonth?: { total: string }[]
	lastYear?: { total: string }[]
}

const Stats: React.FC<Props> = ({
	title,
	lastDay = [{ total: '0' }],
	lastWeek = [{ total: '0' }],
	lastMonth = [{ total: '0' }],
	lastYear = [{ total: '0' }],
}) => {
	return (
		<div>
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">{title}</h2>
			</div>

			<div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-2">
				{lastDay.length > 0 && (
					<div className="flex flex-col space-y-1 border border-yellow-500 px-4 py-3 sm:col-span-1">
						<span className="text-sm">Last 24 hours</span>
						{lastDay.map(({ total }) => (
							<span key={total}>{total}</span>
						))}
					</div>
				)}

				{lastWeek.length > 0 && (
					<div className="flex flex-col space-y-1 border border-yellow-500 px-4 py-3 sm:col-span-1">
						<span className="text-sm">Last 7 days</span>
						{lastWeek.map(({ total }) => (
							<span key={total}>{total}</span>
						))}
					</div>
				)}

				{lastMonth.length > 0 && (
					<div className="flex flex-col space-y-1 border border-yellow-500 px-4 py-3 sm:col-span-1">
						<span className="text-sm">Last 30 days</span>
						{lastMonth.map(({ total }) => (
							<span key={total}>{total}</span>
						))}
					</div>
				)}

				{lastYear.length > 0 && (
					<div className="flex flex-col space-y-1 border border-yellow-500 px-4 py-3 sm:col-span-1">
						<span className="text-sm">Last 365 days</span>
						{lastYear.map(({ total }) => (
							<span key={total}>{total}</span>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Stats
