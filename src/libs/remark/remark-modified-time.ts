import { execSync } from 'node:child_process'

export default function remarkModifiedTime() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (_tree: any, file: any) => {
		try {
			const filepath = file.history[0]
			const result = execSync(`git log -1 --pretty="format:%cI" ${filepath}`)

			file.data.astro.frontmatter.lastModified = result.toString()
		} catch (e) {
			console.error(e)
		}
	}
}
