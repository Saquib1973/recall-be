import express, { type Request, type Response } from 'express'

const healthRouter = express.Router()

healthRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Health check',
  })

})

export default healthRouter
