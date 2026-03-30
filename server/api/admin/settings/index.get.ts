import { Setting } from '../../../models/Setting'

const DEFAULTS: Record<string, unknown> = {
  'plan.price': 20000, // centavos
  'plan.name': 'Mentoria Fly Up Milhas',
  'plan.description': '3 encontros online + suporte via WhatsApp',
}

export default defineEventHandler(async () => {
  await connectDb()
  const docs = await Setting.find({}).lean()

  const settings: Record<string, unknown> = { ...DEFAULTS }
  for (const doc of docs) {
    settings[doc.key] = doc.value
  }

  return settings
})
