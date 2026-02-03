import cors from 'cors'
import express from 'express'

const app = express()

app.use(cors())
app.use(express.json())

const port = Number(process.env.PORT) || 3001

/** @type {{ id: string; name: string; createdAt: string; updatedAt: string }[]} */
const items = []

function nowIso() {
  return new Date().toISOString()
}

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/items', (_req, res) => {
  res.json(items)
})

app.get('/api/items/:id', (req, res) => {
  const item = items.find((x) => x.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

app.post('/api/items', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  if (!name) return res.status(400).json({ error: 'name is required' })

  const ts = nowIso()
  const item = { id: makeId(), name, createdAt: ts, updatedAt: ts }
  items.push(item)

  res.status(201).json(item)
})

app.put('/api/items/:id', (req, res) => {
  const item = items.find((x) => x.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })

  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  if (!name) return res.status(400).json({ error: 'name is required' })

  item.name = name
  item.updatedAt = nowIso()

  res.json(item)
})

app.delete('/api/items/:id', (req, res) => {
  const idx = items.findIndex((x) => x.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })

  const [deleted] = items.splice(idx, 1)
  res.json(deleted)
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
