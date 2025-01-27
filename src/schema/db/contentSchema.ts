import { model, Schema } from 'mongoose'

const contentSchema = new Schema(
  {
    title: { type: String },
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

export const ContentModel = model('content', contentSchema)
