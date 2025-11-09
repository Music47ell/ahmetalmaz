"use client";

import { useEffect, useState } from "react";
import RecentTracks from "./RecentTracks";
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
		{ artist: string; image?: string; title: string; preview?: string }[]
	>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsRes, recentTracksRes, topAlbumsRes, topArtistsRes] = await Promise.all([
					fetch("https://api.ahmetalmaz.com/listenbrainz/stats"),
					fetch("https://api.ahmetalmaz.com/listenbrainz/recent-tracks"),
				]);

				if (statsRes.ok) {
					const data = await statsRes.json();
					setListenBrainzStats(data);
				} else {
					console.error("Failed to fetch ListenBrainz stats");
				}

				if (recentTracksRes.ok) {
					const data = await recentTracksRes.json();
					setRecentTracks(data);
				} else {
					console.error("Failed to fetch recent tracks");
				}
			} catch (error) {
				console.error("Error fetching ListenBrainz data:", error);
			}
		};

		fetchData();
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
		</section>
	);
};

export default MusicStats;
