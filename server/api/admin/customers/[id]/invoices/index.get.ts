import mongoose from 'mongoose'
import { Invoice } from '../../../../../models/Invoice'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()
  const invoices = await Invoice.find({ customerId: id }).sort({ createdAt: -1 }).lean()

  return invoices.map(inv => ({
    ...inv,
    _id: inv._id.toString(),
    customerId: inv.customerId.toString(),
    createdBy: inv.createdBy?.toString() || '',
  }))
})
