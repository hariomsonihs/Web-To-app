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

  // GitHub allows max 10 properties in client_payload
  // Pack extra fields into a single "config" JSON string
  const payload = {
    event_type: 'build-apk',
    client_payload: {
      buildId:     String(buildId),
      url:         String(url),
      appName:     String(appName),
      packageName: String(packageName),
      theme:       String(theme || 'dark'),
      primaryColor:String(primaryColor || '#667eea'),
      buildType:   String(buildType || 'apk'),
      iconUrl:     String(iconUrl || ''),
      splashUrl:   String(splashUrl || ''),
      // Pack remaining fields into one JSON string (counts as 1 property)
      config: JSON.stringify({
        permissions: Array.isArray(permissions) ? permissions.join(',') : 'internet',
        pushNotifications: String(pushNotifications || 'false'),
        admob: String(admob || 'false'),
        admobAppId: String(admobAppId || ''),
        admobBannerId: String(admobBannerId || ''),
        bottomNavLinks: JSON.stringify(bottomNavLinks || []),
        customJs: String(customJs || '').substring(0, 300),
      })
    }
  }

  console.log('Triggering GitHub dispatch — payload properties:', Object.keys(payload.client_payload).length)

  const response = await axios.post(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
    payload,
    { headers: headers() }
  )

  console.log('GitHub dispatch status:', response.status)

  await new Promise(r => setTimeout(r, 8000))
  const runId = await findLatestRunId()
  if (runId) {
    console.log('Found run ID:', runId)
    updateBuild(buildId, { runId, step: 3 })
  }
}

async function findLatestRunId() {
  try {
    const res = await axios.get(
      `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs?per_page=1&event=repository_dispatch`,
      { headers: headers() }
    )
    return res.data.workflow_runs?.[0]?.id || null
  } catch (e) {
    console.error('findLatestRunId error:', e.message)
    return null
  }
}

async function getBuildStatus(runId) {
  const res = await axios.get(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`,
    { headers: headers() }
  )
  const run = res.data
  if (run.status !== 'completed') return { status: run.status }

  let downloadUrl = null
  try {
    const artRes = await axios.get(
      `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}/artifacts`,
      { headers: headers() }
    )
    const apk = artRes.data.artifacts?.find(a => a.name === 'apk-output')
    if (apk) {
      downloadUrl = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}/artifacts/${apk.id}`
    }
  } catch { }

  return { status: 'completed', conclusion: run.conclusion, downloadUrl }
}

module.exports = { triggerGitHubBuild, getBuildStatus }
