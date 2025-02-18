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
  async getSharedStatus(req: Request, res: Response) {
    try {
      const link = await LinkModel.findOne({ userId: req.userId });
      if (!link) {
        res.status(404).json({
          message: 'No link found',
        })
        return
      }
      res.status(200).json({
        message: 'Found the link',
        link,

      })
    } catch (error) {
      res.status(404).json({
        message: 'No link found',
      })
    }
  },
  async share(req: Request, res: Response) {
    const { share } = req.body
    try {
      if (share) {
        const prev = await LinkModel.findOne({ userId: req.userId });
        if (!prev) {

          const link = await LinkModel.create({
            userId: req.userId,
            hash: generateRandomHash(10),
          })
          res.status(200).json({
            message: 'created share link',
            link,
          })
        } else {
          res.status(200).json({
            message: 'share link already exists',
            link: prev,
          })
          return
        }
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
    let { hash } = req.params
    console.log(hash);
    try {
      const link = await LinkModel.findOne({ hash });
      if(!link){
        res.status(404).json({
          message: 'No link found',
        })
        return
      }
      console.log(link)
      try {
        if (!link?.userId) {
          res.status(404).json({
            message: 'No link found',
          })
          return
        }
        let content = await ContentModel.find({
          userId: link?.userId,
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
      }
    } catch (error) {
      res.status(404).json({
        message: 'No link found',
      })
    }

  },
  async getRecallProtected(req: Request, res: Response) {
    let { id } = req.params;
    try {

      const content = await ContentModel.findOne({ _id: id });
      if (
        content?.userId?.toString() !== req.userId) {
        res.status(403).json({
          message: 'You are not authorized to view this document',
        })
        return
      }

      res.status(200).json({
        message: 'Found the document',
        content,
      })
    } catch (error) {
      res.status(404).json({
        message: 'No link found',
      })
      return
    }

  },
  async getRecallOpen(req: Request, res: Response) {

  }
}

export default contentController
