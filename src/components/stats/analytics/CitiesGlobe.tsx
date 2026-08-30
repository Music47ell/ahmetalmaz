'use client'

import { useEffect, useRef, useState } from 'react'

interface CityPoint {
	city: string
	country: string
	latitude: number
	longitude: number
	total: number
}

interface CitiesGlobeProps {
	width?: number
	height?: number
	altitude?: number
	classNames?: string
}

// Dracula palette (matches src/assets/css/tailwind.css tokens)
const DRACULA = {
	bg: '#282a36',
	currentLine: '#6272a4',
	selection: '#44475a',
	comment: '#7c85b0',
	purple: '#bd93f9',
	green: '#50fa7b',
} as const

const CitiesGlobe = ({
	width = 390,
	height = 458,
	altitude = 2.2,
	classNames,
}: CitiesGlobeProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		let cancelled = false

		const boot = async () => {
			if (!ref.current) return

			try {
				const [{ default: Globe }, THREE] = await Promise.all([
					import('globe.gl'),
					import('three'),
				])
				const geojson = await (
					await fetch('/ne_110m_admin_0_countries.geojson.json')
				).json()

				const citiesRes = await fetch('/api/analytics/cities')
				if (!citiesRes.ok) return
				const cityData = (await citiesRes.json()) as CityPoint[]
				const points = cityData.map((d) => ({
					lat: d.latitude,
					lng: d.longitude,
					altitude: Math.min(0.8, Math.max(0.01, d.total / 50)),
					radius: 0.3,
					color: DRACULA.green,
				}))
				if (cancelled) return

				const world = new Globe(ref.current, {
					animateIn: true,
					rendererConfig: { antialias: true, alpha: true },
				})
					.width(width)
					.height(height)
					.backgroundColor('rgba(255, 255, 255, 0)')
					.globeMaterial(
						new THREE.MeshPhongMaterial({
							color: DRACULA.bg,
							opacity: 0.7,
							transparent: true,
						}),
					)
					.atmosphereColor(DRACULA.purple)
					.showGraticules(true)
					.hexPolygonsData(
						(geojson as { features: unknown[] }).features as never,
					)
					.hexPolygonResolution(3)
					.hexPolygonMargin(0.4)
					.hexPolygonColor(() => DRACULA.currentLine)
					.onGlobeReady(() => {
						if (!cancelled) setIsLoaded(true)
					})

				const stars = [...Array(500).keys()].map(() => ({
					lat: (Math.random() - 0.5) * 180,
					lng: (Math.random() - 0.5) * 360,
					alt: Math.random() * 1.4 + 0.1,
					kind: 'star' as const,
				}))

				const customLayer: {
					lat: number
					lng: number
					alt: number
					kind: 'star'
				}[] = stars

				world
					.pointsData(points)
					.pointAltitude('altitude')
					.pointRadius('radius')
					.pointColor('color')
					.pointsMerge(true)
					.customLayerData(customLayer)
					.customThreeObject(() => {
						return new THREE.Mesh(
							new THREE.SphereGeometry(0.3),
							new THREE.MeshBasicMaterial({
								color: DRACULA.comment,
								opacity: 0.9,
								transparent: true,
							}),
						)
					})
					.customThreeObjectUpdate(
						(obj, d: { lat: number; lng: number; alt: number }) => {
							Object.assign(obj.position, world.getCoords(d.lat, d.lng, d.alt))
						},
					)

				world.pointOfView({ lat: 19.05, lng: -50.42, altitude })

				const controls = world.controls()
				controls.autoRotate = true
				controls.enableRotate = true
				controls.enableZoom = false
				controls.enablePan = false

				const handleVisibility = () => {
					controls.autoRotate = document.visibilityState === 'visible'
				}
				document.addEventListener('visibilitychange', handleVisibility)
				handleVisibility()

				return () => {
					document.removeEventListener('visibilitychange', handleVisibility)
				}
			} catch {
				// globe is decorative — fail silently
			}
		}

		const cleanup = boot()

		return () => {
			cancelled = true
			Promise.resolve(cleanup).then((fn) => fn?.())
		}
	}, [width, height, altitude])

	return (
		<div className="relative flex items-center justify-center overflow-hidden w-fit">
			{!isLoaded && (
				<div className="absolute flex items-center justify-center h-full w-full">
					<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
				</div>
			)}
			<div
				ref={ref}
				style={{ width: `${width}px`, height: `${height}px` }}
				className={classNames}
				aria-hidden="true"
			/>
		</div>
	)
}

export default CitiesGlobe
