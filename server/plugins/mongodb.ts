import { closeMongoDb } from '../utils/mongodb'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await closeMongoDb()
  })
})
