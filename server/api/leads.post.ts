import { z } from 'zod'

const LeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Informe um e-mail valido'),
  whatsapp: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 digitos (somente numeros)',
  ),
  website: z.string().optional(),
})

const ipRequests = new Map<string, { count: number, resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60_000

export default defineEventHandler(async (event) => {
  // Rate limit by IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  const entry = ipRequests.get(ip)

  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT_MAX) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Muitas tentativas. Tente novamente em 1 minuto.',
      })
    }
    entry.count++
  } else {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
  }

  // Validate body
  const body = await readBody(event)
  const result = LeadSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      data: result.error.flatten(),
    })
  }

  const { website, ...leadData } = result.data

  // Honeypot: bot filled hidden field — silently discard
  if (website) {
    return { success: true, id: 'honeypot' }
  }

  const db = await getMongoDb()

  const inserted = await db.collection('leads').insertOne({
    ...leadData,
    createdAt: new Date(),
    source: 'lp-flyupmilhas',
  })

  return { success: true, id: inserted.insertedId.toString() }
})
