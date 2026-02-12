interface DeviceType {
	devices: { device: string; total: number }[]
	title: string
}

const DeviceTypeList: React.FC<DeviceType> = ({ title, devices }) => {
	if (!devices || devices.length === 0) {
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

			{devices.length > 0 ? (
				<ul className="m-0 p-0 border border-dracula-dracula px-4 py-2">
					{devices.map(({ device, total }, index) => (
						<li
							key={`${device}-${total}`}
							className="m-0 p-0 flex items-center gap-4 leading-[3rem]"
						>
							<small className="flex shrink-0 items-center justify-center w-6 h-6 font-bold leading-4 border-2">
								{index + 1}
							</small>

							<div className="truncate capitalize text-sm">
								{device}
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

export default DeviceTypeList
