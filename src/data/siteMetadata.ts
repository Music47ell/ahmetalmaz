const siteMetadata = {
	name: 'Ahmet ALMAZ',
	description: 'Full Stack Developer from Türkiye 🇹🇷',
	username: 'Music47ell',
	instance: 'mastodon.social',
	siteUrl: 'https://ahmetalmaz.com',
	apiUrl: 'https://api.ahmetalmaz.com',
	locale: 'en-US',
	avatar: '/images/others/me.png',
	altAvatar: '/images/others/doomface.gif',
	socials: [
		{ title: 'Mastodon', url: 'https://mastodon.social/@Music47ell' },
		{ title: 'GitHub', url: 'https://github.com/music47ell' },
		{ title: 'RSS Feed', url: 'https://ahmetalmaz.com/feed.xml' },
	],
	NavLinks: [
		{ title: 'Home', href: '/', activePath: /^\/$/ },
		{ title: 'Blog', href: '/blog', activePath: /^\/blog*/ },
		{ title: 'Stats', href: '/stats', activePath: /^\/stats*/ },
		{
			title: 'Resume',
			href: 'https://cdn.ahmetalmaz.com/ahmetalmaz-resume.pdf',
			activePath: /^\/resume*/,
		},
	],
	donate: [
	{ img: "/images/badges/donate.gif", url: "https://github.com/sponsors/Music47ell" },
],
social: [
	{ img: "/images/badges/mastodon-flat.png", url: "https://astro.build/" },
  { img: "/images/badges/github.gif", url: "https://github.com/music47ell" },
	{ img: "/images/badges/rss-button.gif", url: "https://ahmetalmaz.com/feed.xml" },
],
uses: [
  { img: "/images/badges/brave.gif", url: "https://brave.com/" },
	{ img: "/images/badges/vscode.gif", url: "https://librewolf.net/" },
  { img: "/images/badges/bitwarden.gif", url: "https://bitwarden.com/" },
  { img: "/images/badges/navidrome.gif", url: "https://www.navidrome.org/" },
],
	stack: [
  { img: "/images/badges/astro.png", url: "https://astro.build/" },
  { img: "/images/badges/caddy.png", url: "https://caddyserver.com/" },
  { img: "/images/badges/docker.png", url: "https://www.docker.com/" },
  { img: "/images/badges/debian.gif", url: "https://www.debian.org/" },
  { img: "/images/badges/hetzner.gif", url: "https://ahmetalmaz.com/go/hetzner" },
]
}

export default siteMetadata
