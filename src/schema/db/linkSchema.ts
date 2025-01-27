import { model, Schema } from 'mongoose'

const linkSchema = new Schema({
  hash:String,
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true ,unique:true},
})

export const LinkModel = model('link', linkSchema)
