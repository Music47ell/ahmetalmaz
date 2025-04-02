import type React from 'react'
import OverviewItem from '../Overview'

type ListenbrainzStats = {
	accountAge: number
	artistsCount: number
	tracksCount: number
	listensCount: number
	albumsCount: number
}

type ListenbrainzStatsProps = {
	listenbrainzStats: ListenbrainzStats
}

const ListenbrainzStats: React.FC<ListenbrainzStatsProps> = ({
	listenbrainzStats,
}) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<OverviewItem
				label="Account Age in Years"
				value={listenbrainzStats?.accountAge}
			/>
			<OverviewItem label="Artists" value={listenbrainzStats?.artistsCount} />
			<OverviewItem label="Tracks" value={listenbrainzStats?.tracksCount} />
			<OverviewItem
				label="Total Listens"
				value={listenbrainzStats?.listensCount}
			/>
			<OverviewItem
				label="Albums Count"
				value={listenbrainzStats?.albumsCount}
			/>
		</div>
	)
}

export default ListenbrainzStats
