import mongoose from 'mongoose'
import env from './config'

async function connectDb() {
  if (!env.MONGODB_URL) throw new Error('MONGODB_URL is not set')

  return mongoose
    .connect(env.MONGODB_URL)
    .then(() => {
      console.log('Connected to the database')
    })
    .catch((err) => {
      console.log('Error connecting to the database', err)
      process.exit(1)
    })
}

export default connectDb
