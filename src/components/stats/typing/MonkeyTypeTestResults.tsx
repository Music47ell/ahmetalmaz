interface TestResult {
	wpm: number
	accuracy: number
	rawWpm: number
	consistency: number
	timestamp: number
}

interface MonkeyTypeTestResultsProps {
	title: string
	results: TestResult[]
}

const formatDate = (timestamp: number): string => {
	return new Date(timestamp).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

const MonkeyTypeTestResults: React.FC<MonkeyTypeTestResultsProps> = ({ title, results }) => {
	if (!results || results.length === 0) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-3 bg-dracula-background">
				<h2 className="uppercase font-semibold tracking-wide text-sm">{title}</h2>
			</div>

			<div className="border border-dracula-dracula overflow-hidden">
				{results.map((result, index) => (
					<div
						key={`${result.timestamp}-${index}`}
						className="flex items-center justify-between px-4 py-4 border-b border-dracula-dracula hover:bg-dracula-background/50 transition-colors last:border-b-0"
					>
						{/* Rank */}
						<div className="flex items-center justify-center w-8 h-8 rounded border border-dracula-dracula font-bold text-sm shrink-0">
							{index + 1}
						</div>

						{/* Main Stats */}
						<div className="flex grow items-center gap-6 ml-4">
							<div className="flex flex-col gap-1">
								<span className="text-lg font-bold text-white">{result.wpm}</span>
								<span className="text-xs text-gray-500">WPM</span>
							</div>
							<span className="text-gray-600">|</span>
							<span className="text-xs text-gray-400">{formatDate(result.timestamp)}</span>
						</div>

						{/* Secondary Stats */}
						<div className="flex gap-6 ml-auto">
							<div className="flex flex-col items-end">
								<span className="text-sm font-semibold text-white">{result.accuracy}%</span>
								<span className="text-xs text-gray-500">Accuracy</span>
							</div>
							<div className="flex flex-col items-end">
								<span className="text-sm font-semibold text-white">{result.consistency}%</span>
								<span className="text-xs text-gray-500">Consistency</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default MonkeyTypeTestResults