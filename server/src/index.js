import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import moviesRouter from './routes/movies.js'
import votesRouter from './routes/votes.js'
import searchRouter from './routes/search.js'
import streamingRouter from './routes/streaming.js'
import adminRouter from './routes/admin.js'
import watchedVotesRouter from './routes/watchedVotes.js'
import { seedIfEmpty } from './seed.js'

const app = express()
const PORT = process.env.PORT || 3001

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set')
  process.exit(1)
}
if (!process.env.INVITE_CODE) {
  console.warn('WARN: INVITE_CODE environment variable is not set. Registration will be impossible.')
}
if (!process.env.CORS_ORIGIN) {
  console.warn('WARN: CORS_ORIGIN environment variable is not set. Defaulting to http://localhost:5173')
}

app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim()),
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/movies', moviesRouter)
app.use('/api/votes', votesRouter)
app.use('/api/search', searchRouter)
app.use('/api/streaming', streamingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/watched-votes', watchedVotesRouter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

await seedIfEmpty()

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})