import type { FastifyInstance } from 'fastify'
import { LeadSchema } from './schema.js'

export async function leadsRoutes(fastify: FastifyInstance) {
  fastify.post('/leads', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute',
        keyGenerator: (req: { ip: string }) => req.ip,
        errorResponseBuilder: (_req: unknown, context: { after: string }) => ({
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Muitas tentativas. Tente novamente em ${context.after}.`,
        }),
      },
    },
  }, async (request, reply) => {
    const result = LeadSchema.safeParse(request.body)

    if (!result.success) {
      return reply.status(400).send({ error: result.error.flatten() })
    }

    const { website, ...leadData } = result.data

    // Honeypot: if website field is filled, silently return success but don't store (per D-13)
    if (website) {
      fastify.log.info('Honeypot triggered — discarding lead submission')
      return reply.status(200).send({ success: true, id: 'honeypot' })
    }

    const db = fastify.mongo.db
    if (!db) {
      fastify.log.error('MongoDB not connected')
      return reply.status(500).send({ error: 'Database unavailable' })
    }

    const inserted = await db.collection('leads').insertOne({
      ...leadData,
      createdAt: new Date(),
      source: 'lp-flyupmilhas',
    })

    return reply.status(200).send({ success: true, id: inserted.insertedId.toString() })
  })
}
