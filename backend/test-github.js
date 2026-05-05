require('dotenv').config()
const axios = require('axios')

console.log('OWNER:', process.env.GITHUB_OWNER)
console.log('REPO:', process.env.GITHUB_REPO)
console.log('TOKEN:', process.env.GITHUB_TOKEN?.substring(0, 15) + '...')

// Fixed payload — max 10 properties
const payload = {
  event_type: 'build-apk',
  client_payload: {
    buildId:      'test123',
    url:          'https://google.com',
    appName:      'TestApp',
    packageName:  'com.test.myapp',
    theme:        'dark',
    primaryColor: '#667eea',
    buildType:    'apk',
    iconUrl:      '',
    splashUrl:    '',
    config: JSON.stringify({
      permissions: 'internet',
      pushNotifications: 'false',
      admob: 'false',
      admobAppId: '',
      admobBannerId: '',
      bottomNavLinks: '[]',
      customJs: ''
    })
  }
}

console.log('Properties count:', Object.keys(payload.client_payload).length)

axios.post(
  `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/dispatches`,
  payload,
  {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
)
.then(r => console.log('✅ SUCCESS! Status:', r.status))
.catch(e => {
  console.log('❌ ERROR Status:', e.response?.status)
  console.log('❌ ERROR Body:', JSON.stringify(e.response?.data, null, 2))
})
