import mongoose from 'mongoose'

let isConnected = false

export async function connectDb(): Promise<typeof mongoose> {
  if (isConnected) return mongoose

  const config = useRuntimeConfig()
  const uri = config.mongodbUri

  if (!uri) {
    throw new Error('NUXT_MONGODB_URI is not set')
  }

  await mongoose.connect(uri, { dbName: config.mongodbDatabase })
  isConnected = true

  return mongoose
}

export async function disconnectDb(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect()
    isConnected = false
  }
}
