const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERNAME = process.env.USERNAME
const REPO = process.env.REPO

export const getPaths = async () => {
	const owner = USERNAME
	const repo = REPO
	const path = 'src/content/blog'

	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github.v3.json',
				Authorization: `Bearer ${GITHUB_TOKEN}`,
				'X-GitHub-Api-Version': '2022-11-28',
				'User-Agent': 'request',
			},
		})

		if (!response.ok) {
			return { error: response.status, message: response.statusText }
		}

		const data = await response.json()

		if (!Array.isArray(data)) {
			return { error: 404, message: 'No content found' }
		}

		const paths = data.map((item) => `${item.path}/index.mdx`)
		return { paths }
	} catch (error) {
		return {
			error: 500,
			message:
				error instanceof Error ? error.message : 'An unknown error occurred',
		}
	}
}

export const getPost = async () => {
	const owner = USERNAME
	const repo = REPO

	const fetchContent = async (
		path: string,
	): Promise<
		{ numberOfWordsInPost: number } | { error: number; message: string }
	> => {
		const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

		try {
			const response: Response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/vnd.github.v3.json',
					Authorization: `Bearer ${GITHUB_TOKEN}`,
					'X-GitHub-Api-Version': '2022-11-28',
					'User-Agent': 'request',
				},
			})

			if (!response.ok) {
				return { error: response.status, message: response.statusText }
			}

			const responseData = await response.json()
			const decodedContent = atob(responseData.content)
			const numberOfWordsInPost = decodedContent.split(' ').length

			return { numberOfWordsInPost }
		} catch (error) {
			return {
				error: 500,
				message:
					error instanceof Error ? error.message : 'An unknown error occurred',
			}
		}
	}

	try {
		const pathsResult = await getPaths()
		if (pathsResult.error) {
			return pathsResult
		}

		const data = pathsResult.paths
			? await Promise.all(pathsResult.paths.map(fetchContent))
			: []

		const validData = data.filter(
			(item): item is { numberOfWordsInPost: number } => !('error' in item),
		)
		const numberOfPosts = validData.length
		const numberOfWords = validData.reduce(
			(acc, item) => acc + item.numberOfWordsInPost,
			0,
		)

		return { stats: { numberOfPosts, numberOfWords } }
	} catch (error) {
		return {
			error: 500,
			message:
				error instanceof Error ? error.message : 'An unknown error occurred',
		}
	}
}
