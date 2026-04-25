import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from 'astro:env/client'

type PostViewsProps = {
	slug: string
	TrackViews?: boolean
	trackViews?: boolean
}

const PostViews: React.FC<PostViewsProps> = ({
	slug,
	TrackViews,
	trackViews,
}) => {
	const [views, setViews] = useState(0)
	const targetRef = useRef<HTMLSpanElement>(null)
	const fetchedRef = useRef(false)

	useEffect(() => {
		const shouldTrackViews = TrackViews ?? trackViews ?? false
		let mounted = true

		const fetchViews = async () => {
			const res = await fetch(
				`${API_BASE_URL}/insight/${encodeURIComponent(slug)}?t=${Date.now()}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					cache: 'no-store',
				},
			)

			const data = await res.json()
			return Number(data.views) || 0
		}

		const loadViews = async () => {
			const firstViews = await fetchViews()
			if (!mounted) return
			setViews(firstViews)

			// On tracked pages, analytics events can land shortly after first paint.
			// Re-fetch once to avoid showing a stale count until a manual refresh.
			if (!shouldTrackViews) return

			window.setTimeout(async () => {
				const nextViews = await fetchViews()
				if (!mounted) return
				setViews((current) => Math.max(current, nextViews))
			}, 1600)
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting || fetchedRef.current) return
					fetchedRef.current = true
					loadViews()
					if (entry.target) observer.unobserve(entry.target)
				})
			},
			{ root: null, threshold: 0.5 },
		)

		if (targetRef.current) {
			observer.observe(targetRef.current)
		}

		return () => {
			mounted = false
			if (targetRef.current) observer.unobserve(targetRef.current)
		}
	}, [TrackViews, slug, trackViews])

	return (
		<span ref={targetRef} className="shrink-0">
			{views}
		</span>
	)
}

export default PostViews
