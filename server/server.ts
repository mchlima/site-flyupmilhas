import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import mongodb from '@fastify/mongodb'
import { leadsRoutes } from './leads/index.js'

const fastify = Fastify({ logger: true })

// 1. CORS — register before routes (per D-11)
await fastify.register(cors, {
  origin: [
    'https://flyupmilhas.com.br',
    'https://www.flyupmilhas.com.br',
    // Add staging URL via env: process.env.CORS_STAGING_URL
    ...(process.env.CORS_STAGING_URL ? [process.env.CORS_STAGING_URL] : []),
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
})

// 2. Rate limiting — global: false, scope per-route (per D-12)
await fastify.register(rateLimit, {
  global: false,
})

// 3. MongoDB native driver (per BACK-01)
await fastify.register(mongodb, {
  forceClose: true,
  url: process.env.MONGODB_URI,
  database: process.env.LEADS_DB_NAME || 'flyupmilhas',
})

// 4. Routes
await fastify.register(leadsRoutes)

// Start server
const port = Number(process.env.PORT) || 3001
await fastify.listen({ port, host: '0.0.0.0' })
