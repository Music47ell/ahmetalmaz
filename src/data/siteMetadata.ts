const siteMetadata = {
	name: 'Ahmet ALMAZ',
	description: 'Full Stack Developer from Türkiye 🇹🇷',
	username: 'Music47ell',
	siteUrl: 'https://ahmetalmaz.com',
	locale: 'en-US',
	avatar: '/images/others/me.png',
	socials: [
		{ title: 'GitHub', url: 'https://github.com/music47ell' },
		{ title: 'LinkedIn', url: 'https://www.linkedin.com/in/music47ell' },
	],
	NavLinks: [
		{ title: 'Home', href: '/', activePath: /^\/$/ },
		{ title: 'Stats', href: '/stats', activePath: /^\/stats*/ },
		{ title: 'Colophon', href: '/colophon', activePath: /^\/colophon*/ },
		{ title: 'Uses', href: '/uses', activePath: /^\/uses*/ },
		{
			title: 'Resume',
			href: '/ahmetalmaz-resume.pdf',
			activePath: /^\/resume*/,
		},
	],
}

export default siteMetadata
