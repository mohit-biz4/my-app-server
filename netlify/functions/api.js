import cors from 'cors'
import express from 'express'
import serverless from 'serverless-http'

const app = express()
const router = express.Router()

app.use(cors())
app.use(express.json())

/** @type {{ id: string; name: string; createdAt: string; updatedAt: string }[]} */
const items = []

function nowIso() {
  return new Date().toISOString()
}

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.get('/items', (_req, res) => {
  res.json(items)
})

router.get('/items/:id', (req, res) => {
  const item = items.find((x) => x.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

router.post('/items', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  if (!name) return res.status(400).json({ error: 'name is required' })

  const ts = nowIso()
  const item = { id: makeId(), name, createdAt: ts, updatedAt: ts }
  items.push(item)

  res.status(201).json(item)
})

router.put('/items/:id', (req, res) => {
  const item = items.find((x) => x.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  if (!name) return res.status(400).json({ error: 'name is required' })

  item.name = name
  item.updatedAt = nowIso()

  res.json(item)
})

router.delete('/items/:id', (req, res) => {
  const idx = items.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })

  const [deleted] = items.splice(idx, 1)
  res.json(deleted)
})

app.use('/.netlify/functions/api', router)
app.use('/', router)

export const handler = serverless(app)
