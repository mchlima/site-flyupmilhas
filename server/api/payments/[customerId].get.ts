import mongoose from 'mongoose'
import { Invoice } from '../../models/Invoice'

export default defineEventHandler(async (event) => {
  const customerId = getRouterParam(event, 'customerId')

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()

  const invoices = await Invoice.find({ customerId }).sort({ createdAt: -1 }).lean()

  const pending = invoices.filter(i => i.status === 'pending').map(i => ({
    _id: i._id.toString(),
    description: i.description,
    amount: i.amount,
  }))

  const allPaid = invoices.length > 0 && invoices.every(i => i.status !== 'pending')

  return { pending, allPaid }
})
