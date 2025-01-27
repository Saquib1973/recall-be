import { model, Schema } from 'mongoose'

const tagSchema = new Schema({
  tag: { type: String, unique: true },
})

export const TagModel = model('tag', tagSchema)
