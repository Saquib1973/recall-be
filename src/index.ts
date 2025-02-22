import 'dotenv/config'
import express, { Request, Response } from 'express'
import userRouter from './routes/userRoutes'
import connectDb from './utils/db'
import contentRouter from './routes/contentRoutes'
import cors from 'cors'
import env from './utils/config'

const app = express()
let healthCheckCount = 0

app.use(express.json())

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://recalll.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.get('/', (req: Request, res: Response) => {
  console.log('Root endpoint hit')
  res.status(200).send('Server is running')
})

app.get('/health', (req: Request, res: Response) => {
  console.log('Health endpoint hit')
  res.status(200).send(`/health call : ${healthCheckCount++}`)
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/content', contentRouter)

// Start the server first
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Then connect to DB
connectDb().catch((err) => {
  console.error('Failed to connect to database:', err)
})

export default app
