import express from 'express'
import contentController from '../controllers/contentController'
import { userAuthMiddleware } from '../middleware/authMiddleware'

const contentRouter = express.Router()

contentRouter.post('/', userAuthMiddleware, contentController.create)
contentRouter.get('/', userAuthMiddleware, contentController.get)
contentRouter.delete('/', userAuthMiddleware, contentController.delete)
contentRouter.get('/chunk', userAuthMiddleware, contentController.recallChunks)
contentRouter.get(
  '/share',
  userAuthMiddleware,
  contentController.sharedRecallStatus
)
contentRouter.post('/share', userAuthMiddleware, contentController.share)
contentRouter.get('/search', userAuthMiddleware, contentController.search);
contentRouter.get('/shared/:hash', contentController.sharedRecallChunks)
contentRouter.get(
  '/recall/shared/',
  userAuthMiddleware,
  contentController.sharedRecall
)
contentRouter.put("/recall/:id", userAuthMiddleware, contentController.updateRecall);
contentRouter.get(
  '/recall/:id',
  userAuthMiddleware,
  contentController.recall
)
export default contentRouter
