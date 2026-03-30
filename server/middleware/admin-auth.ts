export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/admin')) return

  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.user = user
})
