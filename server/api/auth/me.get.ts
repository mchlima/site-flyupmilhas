import { User } from '../../models/User'

export default defineEventHandler(async (event) => {
  const auth = getAuthUser(event)
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await connectDb()
  const user = await User.findById(auth.userId).select('email name').lean()

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return { email: user.email, name: user.name }
})
