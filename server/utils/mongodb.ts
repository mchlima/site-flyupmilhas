import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getMongoDb(): Promise<Db> {
  if (db) return db

  const config = useRuntimeConfig()
  const uri = config.mongodbUri

  if (!uri) {
    throw new Error('NUXT_MONGODB_URI is not set')
  }

  client = new MongoClient(uri)
  await client.connect()

  db = client.db(config.mongodbDatabase)
  return db
}

export async function closeMongoDb(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}
