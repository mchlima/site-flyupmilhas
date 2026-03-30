import { createHmac } from 'node:crypto'

interface JwtPayload {
  userId: string
  email: string
  exp: number
}

function base64url(input: string | Buffer): string {
  const str = typeof input === 'string' ? Buffer.from(input) : input
  return str.toString('base64url')
}

function sign(payload: object, secret: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64url(JSON.stringify(payload))
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}

function verify(token: string, secret: string): JwtPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, body, signature] = parts
  const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')

  if (signature !== expected) return null

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as JwtPayload
  if (payload.exp && Date.now() > payload.exp) return null

  return payload
}

export function signToken(userId: string, email: string): string {
  const config = useRuntimeConfig()
  return sign(
    { userId, email, exp: Date.now() + 24 * 60 * 60 * 1000 },
    config.jwtSecret,
  )
}

export function verifyToken(token: string): { userId: string, email: string } | null {
  const config = useRuntimeConfig()
  return verify(token, config.jwtSecret)
}
