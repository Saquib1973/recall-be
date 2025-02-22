import { model, Schema } from 'mongoose'

const contentSchema = new Schema(
  {
    title: String,
    link: String,
    description: String,
    type: { type: String, default: 'others' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'tag' }],
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  {
    timestamps: true,
  }
)
contentSchema.index({ title: 'text', description: 'text', tags: 'text' })

export const ContentModel = model('content', contentSchema)
