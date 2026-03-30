import { z } from 'zod'
import { Customer } from '../../../models/Customer'

const CreateCustomerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),
  birthDate: z.string().max(10).optional(),
  state: z.string().max(50).optional(),
  city: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = CreateCustomerSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()
  const customer = await Customer.create({
    ...result.data,
    source: 'admin-manual',
  })

  return { success: true, id: customer._id.toString() }
})
