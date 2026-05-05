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
      buildId, url, appName, packageName, theme, primaryColor,
      permissions: permissions.join(','),
      pushNotifications: String(pushNotifications),
      admob: String(admob), admobAppId: admobAppId || '',
      admobBannerId: admobBannerId || '',
      bottomNavLinks: JSON.stringify(bottomNavLinks),
      customJs: customJs || '',
      buildType, iconUrl: iconUrl || '', splashUrl: splashUrl || ''
    }
  }

  await axios.post(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
    payload,
    { headers: headers() }
  )

  // Wait a moment then find the triggered run
  await new Promise(r => setTimeout(r, 8000))
  const runId = await findLatestRunId()
  if (runId) updateBuild(buildId, { runId, step: 3 })
}

async function findLatestRunId() {
  try {
    const res = await axios.get(
      `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs?per_page=1&event=repository_dispatch`,
      { headers: headers() }
    )
    return res.data.workflow_runs?.[0]?.id || null
  } catch { return null }
}

async function getBuildStatus(runId) {
  const res = await axios.get(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}`,
    { headers: headers() }
  )
  const run = res.data
  if (run.status !== 'completed') return { status: run.status }

  // Get artifact download URL
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
  } catch { /* no artifact yet */ }

  return { status: 'completed', conclusion: run.conclusion, downloadUrl }
}

module.exports = { triggerGitHubBuild, getBuildStatus }
