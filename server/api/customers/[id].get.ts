import mongoose from 'mongoose'
import { Customer } from '../../models/Customer'
import { Assessment } from '../../models/Assessment'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()
  const customer = await Customer.findById(id).select('name email').lean()

  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const hasAssessment = await Assessment.exists({ customerId: id })

  return { id: customer._id.toString(), name: customer.name, email: customer.email, hasAssessment: !!hasAssessment }
})
