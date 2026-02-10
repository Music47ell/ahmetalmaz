import type React from 'react'

interface OverviewItemProps {
	label: string
	value: number
}

const formatNumberWithCommas = (num: number): string => {
	if (num === undefined || num === null || Number.isNaN(num)) {
		return ''
	}
	return num.toLocaleString('en')
}

const OverviewItem: React.FC<OverviewItemProps> = ({ label, value }) => {
	return (
		<div className="flex flex-col space-y-1 border border-dracula-dracula px-4 py-3 sm:col-span-1">
			<span className="text-sm">{label}</span>
			<span>{formatNumberWithCommas(value)}</span>
		</div>
	)
}

export default OverviewItem
