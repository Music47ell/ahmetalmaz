const siteMetadata = {
	name: 'Ahmet ALMAZ',
	description: 'Full Stack Developer from Türkiye 🇹🇷',
	username: 'Music47ell',
	instance: 'mastodon.social',
	siteUrl: 'https://ahmetalmaz.com',
	cdnUrl: 'https://cdn.ahmetalmaz.com',
	locale: 'en-US',
	avatar: '/images/others/me.png',
	altAvatar: '/images/others/doomface.gif',
	socials: [
		{ title: 'GitHub', url: 'https://github.com/music47ell' },
		{ title: 'Mastodon', url: 'https://mastodon.social/@Music47ell' },
		{ title: 'LinkedIn', url: 'https://www.linkedin.com/in/music47ell' },
	],
	NavLinks: [
		{ title: 'Home', href: '/', activePath: /^\/$/ },
		{ title: 'Blog', href: '/blog', activePath: /^\/blog*/ },
		{ title: 'Stats', href: '/stats', activePath: /^\/stats*/ },
		{
			title: 'Resume',
			href: '/ahmetalmaz-resume.pdf',
			activePath: /^\/resume*/,
		},
	],
}

export default siteMetadata
