"use client";

import { useEffect, useState } from "react";
import RecentTracks from "./RecentTracks";
// import TopAlbums from './TopAlbums'
// import TopArtists from './TopArtists'
import ListenbrainzStats from "./ListenBrainzStats";

const MusicStats = () => {
	const [listenBrainzStats, setListenBrainzStats] = useState<{
		accountAge: number;
		artistsCount: number;
		tracksCount: number;
		listensCount: number;
		albumsCount: number;
	}>({
		accountAge: 0,
		artistsCount: 0,
		tracksCount: 0,
		listensCount: 0,
		albumsCount: 0,
	});
	const [recentTracks, setRecentTracks] = useState<
		{
			artist: string;
			image?: string;
			title: string;
			preview?: string;
		}[]
	>([]);
	// const [topAlbums, setTopAlbums] = useState<
	// 	{
	// 		image?: string
	// 		title: string
	// 	}[]
	// >([])
	// const [topArtists, setTopArtists] = useState<
	// 	{
	// 		name: string
	// 		image?: string
	// 	}[]
	// >([])

	useEffect(() => {
		const fetchListenbrainzStats = async () => {
			try {
				const response = await fetch("/api/listenbrainz");
				if (response.ok) {
					const data = await response.json();
					setListenBrainzStats(data.stats);
					setRecentTracks(data.recentTracks);
					// setTopAlbums(data.topAlbums)
					// setTopArtists(data.topArtists)
				}
			} catch (error) {
				console.error("Error fetching Listenbrainz stats:", error);
			}
		};

		fetchListenbrainzStats();
	}, []);

	return (
		<section className="flex flex-col gap-y-2">
			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Music Stats</h2>
			</div>

			<ListenbrainzStats listenbrainzStats={listenBrainzStats} />

			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Most Recent Tracks</h2>
			</div>
			<RecentTracks tracks={recentTracks} />

			{/* <div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Monthly Top Albums</h2>
			</div>
			<TopAlbums albums={topAlbums} />

			<div className="border border-red-500 px-4 py-2">
				<h2 className="uppercase">Monthly Top Artists</h2>
			</div>
			<TopArtists artists={topArtists} /> */}
		</section>
	);
};

export default MusicStats;
