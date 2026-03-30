import { z } from 'zod'
import { User } from '../../models/User'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = LoginSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Dados inválidos' })
  }

  await connectDb()
  const user = await User.findOne({ email: result.data.email })

  if (!user || !(await verifyPassword(result.data.password, user.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Email ou senha incorretos' })
  }

  const token = signToken(user._id.toString(), user.email)
  setAuthCookie(event, token)

  return { user: { email: user.email, name: user.name } }
})
