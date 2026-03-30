import { z } from 'zod'
import { Setting } from '../../../models/Setting'

const UpdateSettingsSchema = z.object({
  'plan.price': z.number().min(100).optional(),
  'plan.name': z.string().min(1).max(200).optional(),
  'plan.description': z.string().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = UpdateSettingsSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()

  const ops = Object.entries(result.data)
    .filter(([, v]) => v !== undefined)
    .map(([key, value]) =>
      Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true }),
    )

  await Promise.all(ops)

  return { success: true }
})
