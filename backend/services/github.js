const axios = require('axios')
const { updateBuild } = require('./db')

const GH_API = 'https://api.github.com'
const headers = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
})

async function triggerGitHubBuild(buildData) {
  const { id: buildId, url, appName, packageName, theme, primaryColor,
          permissions, pushNotifications, admob, admobAppId, admobBannerId,
          bottomNavLinks, customJs, buildType, iconUrl, splashUrl } = buildData

  updateBuild(buildId, { status: 'building', step: 2 })

  const payload = {
    event_type: 'build-apk',
    client_payload: {
      buildId:      String(buildId),
      url:          String(url),
      appName:      String(appName),
      packageName:  String(packageName),
      theme:        String(theme || 'dark'),
      primaryColor: String(primaryColor || '#667eea'),
      buildType:    String(buildType || 'apk'),
      iconUrl:      String(iconUrl || ''),
      splashUrl:    String(splashUrl || ''),
      config: JSON.stringify({
        permissions:       Array.isArray(permissions) ? permissions.join(',') : 'internet',
        pushNotifications: String(pushNotifications || 'false'),
        admob:             String(admob || 'false'),
        admobAppId:        String(admobAppId || ''),
        admobBannerId:     String(admobBannerId || ''),
        bottomNavLinks:    JSON.stringify(bottomNavLinks || []),
        customJs:          String(customJs || '').substring(0, 300),
      })
    }
  }

  // Save dispatch time — subtract 30s buffer for clock skew
  const dispatchedAt = new Date(Date.now() - 30000).toISOString()

  const response = await axios.post(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
    payload,
    { headers: headers() }
  )
  console.log('Dispatched:', response.status, 'buildId:', buildId, 'at:', new Date().toISOString())

  updateBuild(buildId, { step: 3, dispatchedAt })
}

// Called lazily from build-status polling
async function findAndUpdateRunId(build) {
  if (build.runId) return build.runId
  if (!build.dispatchedAt) return null

  try {
    const res = await axios.get(
      `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs?per_page=10&event=repository_dispatch`,
      { headers: headers() }
    )

    const runs = res.data.workflow_runs || []
    const afterDate = new Date(build.dispatchedAt)

    // Find run created after dispatch time AND not yet assigned to another build
    for (const run of runs) {
      const runDate = new Date(run.created_at)
      if (runDate >= afterDate) {
        console.log(`Matched runId ${run.id} (${run.created_at}) for build ${build.id}`)
        updateBuild(build.id, { runId: run.id, step: 4 })
        return run.id
      }
    }
    console.log(`No run found after ${build.dispatchedAt} for build ${build.id}`)
  } catch (e) {
    console.error('findAndUpdateRunId error:', e.message)
  }
  return null
}

async function getBuildStatus(runId, buildId) {
  const res = await axios.get(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`,
    { headers: headers() }
  )
  const run = res.data
  if (run.status !== 'completed') return { status: 'building' }

  let downloadUrl = null
  try {
    const artRes = await axios.get(
      `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}/artifacts`,
      { headers: headers() }
    )
    const apk = artRes.data.artifacts?.find(a =>
      a.name === `apk-${buildId}` || a.name?.startsWith('apk-')
    )
    if (apk) {
      // GitHub Actions page — user downloads APK from here (artifacts need auth for direct download)
      downloadUrl = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`
    }
  } catch { }

  return { status: 'completed', conclusion: run.conclusion, downloadUrl }
}

module.exports = { triggerGitHubBuild, findAndUpdateRunId, getBuildStatus }
