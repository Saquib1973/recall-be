import express from 'express'
import contentController from '../controllers/contentController'
import { userAuthMiddleware } from '../middleware/authMiddleware'

const contentRouter = express.Router()

contentRouter.post('/',userAuthMiddleware, contentController.create)
contentRouter.get('/', userAuthMiddleware,contentController.get)
contentRouter.delete('/',userAuthMiddleware, contentController.delete)
contentRouter.post('/share',userAuthMiddleware, contentController.share)
contentRouter.get(
  '/share',
  userAuthMiddleware,
  contentController.getSharedStatus
)
contentRouter.get('/chunk',userAuthMiddleware, contentController.getChunk)
contentRouter.get('/search' ,contentController.search)
contentRouter.get('/recall/:id', userAuthMiddleware,contentController.getRecallProtected)
contentRouter.get('/shared/:hash', contentController.sharedRecall)
export default contentRouter
