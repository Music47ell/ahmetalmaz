import type React from 'react'
import OverviewItem from '../Overview'

interface BlogStatsProps {
	totalViews?: number
	loaded: boolean
	postCount: number
	wordCount: number
}

const BlogOverview: React.FC<BlogStatsProps> = ({
	totalViews,
	loaded,
	postCount,
	wordCount,
}) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<OverviewItem
				label="Total Views"
				value={loaded ? (totalViews ?? 0).toLocaleString('en') : undefined}
			/>
			<OverviewItem label="Blog Posts" value={postCount} />
			<OverviewItem
				label="Words Written"
				value={wordCount.toLocaleString('en')}
			/>
			<OverviewItem
				label="Avg Words per Post"
				value={
					postCount > 0
						? Math.round(wordCount / postCount).toLocaleString('en')
						: 0
				}
			/>
		</div>
	)
}

export default BlogOverview
