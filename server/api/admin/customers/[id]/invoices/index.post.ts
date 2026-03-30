import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer } from '../../../../../models/Customer'
import { Invoice } from '../../../../../models/Invoice'

const CreateInvoiceSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(500),
  amount: z.number().min(100, 'Valor mínimo: R$ 1,00'),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = CreateInvoiceSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()

  const customer = await Customer.findById(id).lean()
  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const user = event.context.user
  const invoice = await Invoice.create({
    customerId: id,
    description: result.data.description,
    amount: result.data.amount,
    createdBy: user?.userId,
  })

  return { success: true, id: invoice._id.toString() }
})
