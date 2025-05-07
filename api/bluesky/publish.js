import { BskyAgent } from '@atproto/api'

const agent = new BskyAgent({ service: 'https://bsky.social' })

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Text is required.' })

  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_APP_PASSWORD,
    })

    const result = await agent.post({ text })
    res.status(200).json({ success: true, uri: result.uri })
  } catch (err) {
    console.error('Publish Error:', err)
    res.status(500).json({ error: 'Failed to publish post.' })
  }
}
