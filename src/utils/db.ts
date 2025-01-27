import { Express } from 'express'
import mongoose from 'mongoose'
import env from './config'

async function connectDb(app: Express) {
  if (!env.MONGODB_URL) throw new Error('MONGODB_URL is not set')

  mongoose
    .connect(env.MONGODB_URL)
    .then(() => {
      console.log('Connected to the database')
      app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`)
      })
    })
    .catch((err) => {
      console.log('Error connecting to the database', err)
    })
}

export default connectDb
