// Simple JSON file-based database (no external service needed)
const fs = require('fs')
const path = require('path')

const DB_FILE = path.join(__dirname, '../data/builds.json')

function ensureDb() {
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]')
}

function readDb() {
  ensureDb()
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
}

function writeDb(data) {
  ensureDb()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function saveBuild(build) {
  const builds = readDb()
  builds.unshift(build)
  writeDb(builds)
}

function getBuilds() {
  return readDb()
}

function getBuild(id) {
  return readDb().find(b => b.id === id) || null
}

function updateBuild(id, fields) {
  const builds = readDb()
  const idx = builds.findIndex(b => b.id === id)
  if (idx !== -1) {
    builds[idx] = { ...builds[idx], ...fields }
    writeDb(builds)
  }
}

module.exports = { saveBuild, getBuilds, getBuild, updateBuild }
