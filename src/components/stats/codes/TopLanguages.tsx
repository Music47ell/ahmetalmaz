import type React from 'react'
import { displayNumbers } from '@/utils/formatters'

export type Language = {
	name: string
	color: string
	percent: number
	xps: number
	level: number
}

type TopLanguagesProps = {
	topLanguages: Language[]
}

const TopLanguages: React.FC<TopLanguagesProps> = ({ topLanguages }) => {
	if (!topLanguages.length) {
		return (
			<div className="flex justify-center items-center py-10">
				<div className="border-t-4 border-yellow-500 border-solid w-16 h-16 rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="relative flex flex-1 flex-col gap-2 p-[2px] border border-yellow-500">
			<div className="h-full w-full p-4">
				<div className="grid gap-2 px-4 py-3">
					{/* Iterate over topLanguages and pass each language data to Progress */}
					{topLanguages.map((language) => (
						<div
							key={language.name}
							className="flex items-center justify-between gap-3"
						>
							<div className="flex w-24 flex-col">
								{language.name}
								<span className="text-xs text-neutral-400">
									Level {language.level}
								</span>
								<span className="text-xs text-neutral-400">
									XP {displayNumbers.format(language.xps)}
								</span>
							</div>
							<div className="relative flex h-3 flex-1 justify-center bg-gray-500">
								<span
									className="absolute left-0 top-0 h-3 px-3 from-red-500 to-yellow-500 bg-gradient-to-r"
									style={{
										width: `${language.percent}%`,
										transition: 'width 0.8s',
									}}
								>
									&ensp;
								</span>
							</div>
							<div className="w-8 text-right text-neutral-100">
								{language.percent.toFixed(0)}%
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default TopLanguages
