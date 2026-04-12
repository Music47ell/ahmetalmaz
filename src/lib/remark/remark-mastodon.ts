import type { Parent } from 'unist'

// Define the exact shape of the returned object
export type TootData = {
  id: string
  created_at: string
  url: string
  replies_count: number
  reblogs_count: number
  favourites_count: number
  content: string
  media_attachments: any[]
}

async function fetchStatus(id: string): Promise<TootData> {
  // Ensure no extra spaces in the ID cause URL issues
  const cleanId = id.trim()
  
  const res = await fetch(`https://mastodon.social/api/v1/statuses/${cleanId}`)
  
  if (!res.ok) {
    throw new Error(`Mastodon API error (${res.status}): Failed to fetch status ${cleanId}`)
  }

  const s = await res.json()

  // Return the exact structure you requested
  return {
    id: String(s.id),
    created_at: s.created_at,
    url: s.url,
    replies_count: Number(s.replies_count),
    reblogs_count: Number(s.reblogs_count),
    favourites_count: Number(s.favourites_count),
    content: s.content,
    media_attachments: s.media_attachments || []
  }
}

export default function remarkMastodonToot() {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return async (tree: Parent, { data }: any) => {
    const frontmatter = data.astro?.frontmatter
    
    if (!frontmatter) return

    // Look for 'tootId' in the frontmatter to know what to fetch
    // Example in MD: tootId: '123123123'
    const tootId = frontmatter.toot

    if (!tootId) {
      // If no ID is provided, do nothing (silent fail)
      return
    }

    try {
      const tootData = await fetchStatus(tootId)
      
      // Inject the result directly into frontmatter.toot
      data.astro.frontmatter.toot = tootData
      
      // Optional: Remove the helper ID so it doesn't clutter your final data
      // delete data.astro.frontmatter.tootId 
    } catch (error) {
      console.error(`[remark-mastodon-toot] Error fetching status ${tootId}:`, error)
      // Optionally set to null or an error object if you want to handle failures in the UI
      data.astro.frontmatter.toot = null
    }
  }
}