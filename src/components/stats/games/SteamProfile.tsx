import type React from 'react'

type SteamProfileData = {
	steamId: string
	username: string
	profileUrl: string
	avatarFull: string | null
	createdAt: string
	accountAgeYears: number
}

type SteamProfileProps = {
	profile: SteamProfileData
}

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

const SteamProfile: React.FC<SteamProfileProps> = ({ profile }) => {
	return (
		<div className="grid gap-3 md:grid-cols-2">
			<div className="flex flex-col space-y-1 border border-dracula-dracula px-4 py-3">
				<span className="text-sm">Account Age</span>
				<span>{profile.accountAgeYears} years</span>
			</div>
			<div className="flex flex-col space-y-1 border border-dracula-dracula px-4 py-3">
				<span className="text-sm">Created</span>
				<span>{profile.createdAt ? formatDate(profile.createdAt) : '-'}</span>
			</div>
		</div>
	)
}

export default SteamProfile
