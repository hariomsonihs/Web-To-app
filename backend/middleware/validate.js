const VALID_URL = /^https?:\/\/.+\..+/
const VALID_PACKAGE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$/

function validateCreateApp(req, res, next) {
  const { url, appName, packageName } = req.body

  if (!url || !VALID_URL.test(url))
    return res.status(400).json({ error: 'Invalid URL. Must start with http:// or https://' })

  if (!appName || appName.trim().length < 2 || appName.length > 50)
    return res.status(400).json({ error: 'App name must be 2–50 characters' })

  if (!packageName || !VALID_PACKAGE.test(packageName))
    return res.status(400).json({ error: 'Invalid package name. Use format: com.example.app' })

  // Sanitize customJs — strip script tags
  if (req.body.customJs) {
    req.body.customJs = req.body.customJs.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  }

  next()
}

module.exports = { validateCreateApp }
