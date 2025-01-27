import express from 'express'
import contentController from '../controllers/contentController'
import { userAuthMiddleware } from '../middleware/authMiddleware'

const contentRouter = express.Router()

contentRouter.post('/',userAuthMiddleware, contentController.create)
contentRouter.get('/', userAuthMiddleware,contentController.get)
contentRouter.delete('/',userAuthMiddleware, contentController.delete)
contentRouter.post('/share',userAuthMiddleware, contentController.share)
contentRouter.get('/chunk',userAuthMiddleware, contentController.getChunk)
contentRouter.get('/shared-recalls', contentController.sharedRecall)
export default contentRouter
