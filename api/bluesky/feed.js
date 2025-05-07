import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://bsky.social' })

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_APP_PASSWORD,
    })

    const feed = await agent.getAuthorFeed({ actor: process.env.BLUESKY_HANDLE })
    const posts = feed.data.feed.map(post => ({
      text: post.post.record.text,
      uri: post.post.uri,
      createdAt: post.post.record.createdAt,
    }))
    res.status(200).json({ posts })
  } catch (err) {
    console.error('Feed Error:', err)
    res.status(500).json({ error: 'Failed to fetch feed.' })
  }
}
