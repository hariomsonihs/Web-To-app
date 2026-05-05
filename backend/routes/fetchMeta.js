const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/', async (req, res) => {
  const { url } = req.query
  if (!url) return res.status(400).json({ error: 'url required' })

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      maxRedirects: 3
    })
    const html = response.data

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim().substring(0, 50) : null

    const faviconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i)
    let favicon = faviconMatch ? faviconMatch[1] : null
    if (favicon && !favicon.startsWith('http')) {
      const base = new URL(url)
      favicon = favicon.startsWith('/') ? `${base.origin}${favicon}` : `${base.origin}/${favicon}`
    }

    const isPWA = html.includes('manifest.json') || html.includes('serviceWorker')

    res.json({ title, favicon, isPWA })
  } catch {
    res.status(400).json({ error: 'Could not fetch site' })
  }
})

module.exports = router
