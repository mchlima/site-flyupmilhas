import { disconnectDb } from '../utils/mongodb'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', async () => {
    await disconnectDb()
  })
})
