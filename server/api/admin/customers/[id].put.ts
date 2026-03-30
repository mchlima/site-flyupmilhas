import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer } from '../../../models/Customer'

const UpdateCustomerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10,11}$/).optional(),
  birthDate: z.string().max(10).optional(),
  state: z.string().max(50).optional(),
  city: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = UpdateCustomerSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()
  const customer = await Customer.findByIdAndUpdate(id, result.data, { new: true }).lean()

  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  return { ...customer, _id: customer._id.toString() }
})
