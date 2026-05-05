# WebToApp — Website to Android App Converter

Convert any website into an Android APK for free using GitHub Actions.

---

## Project Structure

```
Web to app/
├── frontend/               React + Tailwind + Framer Motion UI
├── backend/                Node.js + Express API
├── android-template/       Android Studio WebView project template
└── .github/workflows/      GitHub Actions APK build pipeline
```

---

## Quick Start (Local Development)

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/webtoapp.git
cd webtoapp
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your keys (see below)
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables (backend/.env)

```env
IMGBB_API_KEY=your_imgbb_api_key
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=android-template
PORT=5000
```

---

## How to Get API Keys

### ImgBB API Key (FREE)
1. Go to https://imgbb.com → Sign up free
2. Go to https://api.imgbb.com
3. Click "Get API key"
4. Copy key → paste into `IMGBB_API_KEY`

### GitHub Personal Access Token
1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with scopes: `repo`, `workflow`
3. Copy token → paste into `GITHUB_TOKEN`

---

## GitHub Actions Setup

1. Push the entire project to a GitHub repo
2. Go to repo → Settings → Secrets and Variables → Actions
3. Add these secrets:
   - `IMGBB_API_KEY` — your ImgBB key
   - `KEYSTORE_BASE64` — run: `base64 -w 0 debug.keystore` (optional, uses debug key by default)

The workflow at `.github/workflows/build-apk.yml` is triggered automatically
when the backend calls the GitHub API via `repository_dispatch`.

---

## Deploy to Production

### Frontend → Vercel (FREE)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

Or connect GitHub repo at https://vercel.com/new
- Root directory: `frontend`
- Build command: `npm run build`
- Output: `dist`

### Backend → Render (FREE)

1. Go to https://render.com → New Web Service
2. Connect your GitHub repo
3. Settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Add all `.env` variables in the Environment tab

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/create-app` | Submit app build request |
| GET | `/api/build-status/:id` | Poll build status |
| GET | `/api/builds` | List all builds |
| GET | `/api/fetch-meta?url=` | Fetch site title/favicon |

---

## Android Template Placeholders

The build workflow replaces these in the template:

| Placeholder | Replaced With |
|-------------|---------------|
| `{{APP_NAME}}` | User's app name |
| `{{PACKAGE_NAME}}` | User's package name |
| `{{WEBSITE_URL}}` | User's website URL |
| `{{PRIMARY_COLOR}}` | Hex color code |
| `{{CUSTOM_JS}}` | JavaScript to inject |

---

## Features

- ✅ WebView with progress bar
- ✅ Pull to refresh
- ✅ Offline error page with retry
- ✅ Splash screen
- ✅ Dark/Light/Custom theme
- ✅ Configurable permissions
- ✅ Optional Firebase push notifications
- ✅ Optional AdMob ads
- ✅ Bottom navigation links
- ✅ Custom JS injection
- ✅ APK + AAB output
- ✅ Auto favicon/title fetch
- ✅ ImgBB image hosting
- ✅ GitHub Actions free build

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | JSON file (zero config) |
| Image Storage | ImgBB API (free) |
| Build | GitHub Actions (free) |
| Frontend Host | Vercel (free) |
| Backend Host | Render (free) |
