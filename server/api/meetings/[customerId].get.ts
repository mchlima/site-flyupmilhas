import mongoose from 'mongoose'
import { Customer } from '../../models/Customer'
import { Meeting } from '../../models/Meeting'

export default defineEventHandler(async (event) => {
  const customerId = getRouterParam(event, 'customerId')

  if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()

  const customer = await Customer.findById(customerId).select('name').lean()
  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const meetings = await Meeting.find({ customerId }).sort({ order: 1 }).lean()

  return {
    customerName: customer.name,
    meetings: meetings
      .filter(m => m.status !== 'cancelled')
      .map(m => ({
        title: m.title,
        status: m.status,
        scheduledAt: m.scheduledAt,
        duration: m.duration,
        meetLink: m.status === 'scheduled' ? m.meetLink : '',
      })),
  }
})
