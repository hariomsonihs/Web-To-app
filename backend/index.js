require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const { uploadToImgBB } = require('./services/imgbb')
const { triggerGitHubBuild, getBuildStatus } = require('./services/github')
const { saveBuild, getBuilds, getBuild, updateBuild } = require('./services/db')
const { validateCreateApp } = require('./middleware/validate')
const fetchMeta = require('./routes/fetchMeta')

const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } })

app.use(cors({
  origin: ['https://web-to-app-snowy.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
}))
app.use(express.json())

// Routes
app.use('/api/fetch-meta', fetchMeta)

app.post('/api/create-app',
  upload.fields([{ name: 'iconFile', maxCount: 1 }, { name: 'splashFile', maxCount: 1 }]),
  validateCreateApp,
  async (req, res) => {
    try {
      const buildId = uuidv4()
      const { url, appName, packageName, theme, primaryColor, permissions,
              pushNotifications, admob, admobAppId, admobBannerId,
              bottomNavLinks, customJs, buildType } = req.body

      // Upload images to ImgBB
      let iconUrl = null, splashUrl = null
      if (req.files?.iconFile?.[0]) {
        iconUrl = await uploadToImgBB(req.files.iconFile[0].buffer, `icon_${buildId}`)
      }
      if (req.files?.splashFile?.[0]) {
        splashUrl = await uploadToImgBB(req.files.splashFile[0].buffer, `splash_${buildId}`)
      }

      const buildData = {
        id: buildId, url, appName, packageName, theme,
        primaryColor: primaryColor || '#667eea',
        permissions: JSON.parse(permissions || '["internet"]'),
        pushNotifications: pushNotifications === 'true',
        admob: admob === 'true', admobAppId, admobBannerId,
        bottomNavLinks: JSON.parse(bottomNavLinks || '[]'),
        customJs, buildType: buildType || 'apk',
        iconUrl, splashUrl,
        status: 'pending', step: 0,
        createdAt: new Date().toISOString()
      }

      saveBuild(buildData)

      // Trigger GitHub Actions (non-blocking)
      triggerGitHubBuild(buildData).catch(err => {
        console.error('GitHub trigger failed:', err.message)
        updateBuild(buildId, { status: 'failed' })
      })

      res.json({ buildId, message: 'Build started' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err.message })
    }
  }
)

app.get('/api/build-status/:buildId', async (req, res) => {
  const build = getBuild(req.params.buildId)
  if (!build) return res.status(404).json({ error: 'Build not found' })

  // Poll GitHub for status if still building
  if (build.status === 'building' && build.runId) {
    try {
      const ghStatus = await getBuildStatus(build.runId)
      if (ghStatus.status === 'completed') {
        const update = { status: ghStatus.conclusion === 'success' ? 'completed' : 'failed', step: 5 }
        if (ghStatus.downloadUrl) update.downloadUrl = ghStatus.downloadUrl
        updateBuild(build.id, update)
        return res.json({ ...build, ...update })
      }
    } catch { /* use cached status */ }
  }

  res.json(build)
})

app.get('/api/builds', (req, res) => {
  res.json(getBuilds())
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
