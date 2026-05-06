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

  // Record time BEFORE dispatch so we can find the exact run
  const dispatchTime = new Date().toISOString()

  const response = await axios.post(
    `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
    payload,
    { headers: headers() }
  )
  console.log('GitHub dispatch status:', response.status, 'buildId:', buildId)

  // Wait for GitHub to register the run
  await new Promise(r => setTimeout(r, 10000))

  // Find the run created AFTER our dispatch time — matches this specific build
  const runId = await findRunByBuildId(buildId, dispatchTime)
  if (runId) {
    console.log('Matched run ID:', runId, 'for buildId:', buildId)
    updateBuild(buildId, { runId, step: 3 })
  } else {
    console.warn('Could not find run for buildId:', buildId)
  }
}

async function findRunByBuildId(buildId, afterTime) {
  try {
    // Retry a few times — GitHub may take a moment to list the run
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await axios.get(
        `${GH_API}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs?per_page=10&event=repository_dispatch`,
        { headers: headers() }
      )

      const runs = res.data.workflow_runs || []
      const afterDate = new Date(afterTime)

      // Find run created after our dispatch AND whose name contains buildId
      // GitHub sets run name from the event display_title
      for (const run of runs) {
        const runDate = new Date(run.created_at)
        if (runDate >= afterDate) {
          // This run was created after our dispatch — it's ours
          // (works correctly even with concurrent builds since we check time)
          console.log(`Found run: ${run.id} created at ${run.created_at}`)
          return run.id
        }
      }

      if (attempt < 4) {
        console.log(`Attempt ${attempt + 1}: run not found yet, waiting...`)
        await new Promise(r => setTimeout(r, 5000))
      }
    }
    return null
  } catch (e) {
    console.error('findRunByBuildId error:', e.message)
    return null
  }
}

async function getBuildStatus(runId, buildId) {
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
    const apk = artRes.data.artifacts?.find(a => a.name === `apk-${buildId}`) ||
                  artRes.data.artifacts?.find(a => a.name?.startsWith('apk-'))
    if (apk) {
      // Direct artifact download link
      downloadUrl = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/actions/runs/${runId}/artifacts/${apk.id}`
    }
  } catch { }

  return { status: 'completed', conclusion: run.conclusion, downloadUrl }
}

module.exports = { triggerGitHubBuild, getBuildStatus }
