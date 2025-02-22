import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import userRouter from './routes/userRoutes'
import connectDb from './utils/db'
import contentRouter from './routes/contentRoutes'
import cors from 'cors'
let healthCheckCount = 0;
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://recalll.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use('/api/v1/user', userRouter)
app.use('/api/v1/content', contentRouter)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send(`/health call : ${healthCheckCount++}`)
})

connectDb(app)
