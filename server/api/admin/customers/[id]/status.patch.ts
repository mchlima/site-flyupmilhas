import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer, CUSTOMER_STATUS_VALUES } from '../../../../models/Customer'

const StatusSchema = z.object({
  status: z.enum(CUSTOMER_STATUS_VALUES),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = StatusSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()
  const customer = await Customer.findByIdAndUpdate(id, { status: result.data.status }, { new: true }).lean()

  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  return { ...customer, _id: customer._id.toString() }
})
