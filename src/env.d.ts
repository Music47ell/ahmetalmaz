/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.geojson.json' {
	const value: { type: string; features: unknown[] }
	export default value
}
