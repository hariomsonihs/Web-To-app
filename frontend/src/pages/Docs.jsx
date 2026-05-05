import { motion } from 'framer-motion'

const sections = [
  {
    title: '1. Setup',
    content: `Fork the android-template repo on GitHub. Add these GitHub Secrets:
• IMGBB_API_KEY — from imgbb.com/api
• KEYSTORE_BASE64 — base64 encoded debug.keystore
• KEY_ALIAS, KEY_PASSWORD, STORE_PASSWORD`
  },
  {
    title: '2. Backend (.env)',
    content: `IMGBB_API_KEY=your_key
GITHUB_TOKEN=your_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=android-template
PORT=5000`
  },
  {
    title: '3. Run Locally',
    content: `# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev

Visit http://localhost:5173`
  },
  {
    title: '4. Deploy',
    content: `Frontend → Vercel:
  vercel --prod (from /frontend)

Backend → Render:
  Connect GitHub repo, set root to /backend
  Add all .env variables in Render dashboard`
  },
  {
    title: '5. ImgBB API',
    content: `1. Go to https://imgbb.com
2. Create free account
3. Go to https://api.imgbb.com
4. Generate API key
5. Add to backend .env as IMGBB_API_KEY`
  },
  {
    title: '6. GitHub Actions',
    content: `The workflow at .github/workflows/build-apk.yml:
• Triggered via repository_dispatch event from backend
• Clones template, replaces all config values
• Runs ./gradlew assembleRelease
• Uploads APK as artifact
• Backend polls GitHub API for artifact URL`
  },
]

export default function Docs() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black gradient-text mb-2">Documentation</h1>
      <p className="text-slate-400 mb-10">Complete setup and deployment guide</p>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="glass-card p-6">
            <h2 className="text-lg font-bold mb-3 text-purple-300">{s.title}</h2>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">{s.content}</pre>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
