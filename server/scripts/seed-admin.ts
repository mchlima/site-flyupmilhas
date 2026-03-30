// Run: npx tsx server/scripts/seed-admin.ts
// Reads NUXT_MONGODB_URI and NUXT_MONGODB_DATABASE from .env

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import mongoose from 'mongoose'
import { scrypt, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'

// Load .env manually (no dotenv dependency)
const envPath = resolve(import.meta.dirname || '.', '../../.env')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx)
    const value = trimmed.slice(eqIdx + 1)
    if (!process.env[key]) process.env[key] = value
  }
} catch { /* .env not found, rely on env vars */ }

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

async function main() {
  const uri = process.env.NUXT_MONGODB_URI
  if (!uri) {
    console.error('NUXT_MONGODB_URI not set in .env or environment')
    process.exit(1)
  }

  const dbName = process.env.NUXT_MONGODB_DATABASE || 'flyupmilhas'
  await mongoose.connect(uri, { dbName })

  const email = 'admin@flyupmilhas.com.br'
  const password = 'admin123'

  const hash = await hashPassword(password)

  await mongoose.connection.collection('users').updateOne(
    { email },
    { $set: { email, passwordHash: hash, name: 'Admin', createdAt: new Date(), updatedAt: new Date() } },
    { upsert: true },
  )

  console.log(`Admin user created/updated: ${email} / ${password}`)
  console.log('CHANGE THE PASSWORD AFTER FIRST LOGIN')

  await mongoose.disconnect()
}

main()
