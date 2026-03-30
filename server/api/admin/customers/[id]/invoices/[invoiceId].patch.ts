import mongoose from 'mongoose'
import { z } from 'zod'
import { Invoice } from '../../../../../models/Invoice'

const UpdateSchema = z.object({
  status: z.enum(['cancelled']),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const invoiceId = getRouterParam(event, 'invoiceId')

  if (!id || !invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = UpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()
  const invoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId, customerId: id, status: 'pending' },
    { status: result.data.status },
    { new: true },
  )

  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found or not pending' })
  }

  return { success: true }
})
