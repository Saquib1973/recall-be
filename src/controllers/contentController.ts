import { Request, Response } from 'express'
import { ContentModel } from '../schema/db/contentSchema'
import { LinkModel } from '../schema/db/linkSchema'
import { findTypeOfContent, generateRandomHash } from '../utils/helper'
import { UserModel } from '../schema/db/userSchema'
import { TagModel } from '../schema/db/tagSchema'

const contentController = {
  async create(req: Request, res: Response) {
    const { title, description, link, tags } = req.body

    let type = undefined
    if (link) {
      type = findTypeOfContent(link)
    }

    const sanitizedLink = link?.trim() || undefined

    let tagIds = []
    if (tags && tags.length > 0) {
      tagIds = await Promise.all(
        tags.map(async (tag: string) => {
          let tagDoc = await TagModel.findOne({ tag })
          if (!tagDoc) {
            tagDoc = await TagModel.create({ tag })
          }
          return tagDoc._id
        })
      )
    }

    try {
      const doc = await ContentModel.create({
        title,
        link: sanitizedLink,
        tags: tagIds.length > 0 ? tagIds : undefined,
        description,
        type,
        userId: req.userId,
      })

      res.status(200).json({
        message: 'Document created successfully',
        doc,
      })
    } catch (error) {
      console.error('Error creating document:', error)
      res.status(500).json({
        message: "Couldn't create document",
      })
    }
  },
  async get(req: Request, res: Response) {
    try {
      let content = await ContentModel.find({
        userId: req.userId,
      }).populate('userId', '-password')
      if (!content) {
        res.status(404).json({
          message: 'document does not exist',
        })
        return
      }
      res.status(200).json({
        message: 'Found the document',
        content,
      })
    } catch (error) {
      res.status(404).json({
        message: "Coulcn't get document",
      })
      return
    }
  },
  async getChunk(req: Request, res: Response) {
    let { page: no } = req.query
    const page = parseInt(no as string)
    const limit = page !== 1 ? 10 : 20

    if (typeof page !== 'number' || page < 1) {
      res.status(400).json({
        message: 'Invalid page number',
      })
      return
    }

    try {
      let content = await ContentModel.find({
        userId: req.userId,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', '-password')
        .populate('tags')
      if (!content) {
        res.status(404).json({
          message: 'document does not exist',
        })
        return
      }

      res.status(200).json({
        message: 'Found the document',
        content,
      })
    } catch (error) {
      res.status(404).json({
        message: "Couldn't get document",
      })
      return
    }
  },
  async delete(req: Request, res: Response) {
    //TODO: zod validation
    const { contentId } = req.body
    try {
      const content = await ContentModel.deleteMany({
        _id: contentId,
        userId: req.userId,
      })
      if (content.deletedCount <= 0) {
        res.status(404).json({
          message: 'No content found to delete or you do not have permission',
        })
        return
      }
      res.status(200).json({
        message: 'delete doc successful',
      })
    } catch (error) {
      res.status(404).json({
        message: "Couldn't delete document",
      })
    }
  },
  async share(req: Request, res: Response) {
    const { share } = req.body
    try {
      if (share) {
        const link = await LinkModel.create({
          userId: req.userId,
          hash: generateRandomHash(10),
        })
        res.status(200).json({
          message: 'created share link',
          link,
        })
      } else {
        await LinkModel.deleteOne({
          userId: req.userId,
        })
        res.status(200).json({
          message: 'deleted share link',
        })
      }
    } catch (error) {
      res.status(404).json({
        message: 'share link could not be created',
      })
    }
  },
  async search(req: Request, res: Response) {
    const { q } = req.query
    console.log("entered search with the query : ",q)

    if (!q) {
      res.status(400).json({ message: 'Search query is required' })
      return
    }

    try {
      const results = await ContentModel.find(
        //@ts-ignore
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('userId', '-password')
        .populate('tags')

      res.status(200).json({ message: 'Search results', results });
      return
    } catch (error) {
      console.error('Error searching:', error)
      res.status(500).json({ message: 'Internal server error' });
      return
    }
  },
  async sharedRecall(req: Request, res: Response) {
    const { recallId, page: no, limit: limitParam } = req.query
    const page = parseInt(no as string) || 1
    const limit = parseInt(limitParam as string) || 10

    if (recallId) {
      try {
        const link = await LinkModel.findOne({ hash: recallId })
        if (!link) {
          res.status(404).json({ message: 'Shared recall not found' })
          return
        }

        if (isNaN(page) || page < 1) {
          res.status(400).json({ message: 'Invalid page number' })
          return
        }

        const skip = (page - 1) * limit
        const totalContent = await ContentModel.countDocuments({
          userId: link.userId,
        })

        const content = await ContentModel.find({ userId: link.userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('tags')
          .populate('userId', '-password')

        const user = await UserModel.findById(link.userId).select('-password')

        res.status(200).json({
          message: 'Found shared recall',
          recall: {
            content,
            user: user || undefined,
            shareLink: link.hash,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(totalContent / limit),
              totalContent,
              itemsPerPage: limit,
            },
          },
        })
        return
      } catch (error) {
        console.error('Error fetching shared recall:', error)
        res.status(500).json({ message: 'Internal server error' })
        return
      }
    }

    try {
      if (isNaN(page) || page < 1) {
        res.status(400).json({ message: 'Invalid page number' })
        return
      }

      const skip = (page - 1) * limit
      const totalLinks = await LinkModel.countDocuments()
      const links = await LinkModel.find()
        .skip(skip)
        .limit(limit)
        .populate('userId', '-password')

      const recalls = await Promise.all(
        links.map(async (link) => {
          const content = await ContentModel.find({
            userId: link.userId,
          }).populate('tags')
          const shuffledContent = content.sort(() => Math.random() - 0.5)

          return {
            content: shuffledContent,
            user: link.userId,
            shareLink: link.hash,
            totalContent: content.length,
          }
        })
      )

      res.status(200).json({
        message: 'Found shared recalls',
        recalls,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLinks / limit),
          totalLinks,
          itemsPerPage: limit,
        },
      })
      return
    } catch (error) {
      console.error('Error fetching shared recalls:', error)
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  },
}

export default contentController
