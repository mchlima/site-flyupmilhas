import mongoose from 'mongoose'
import { Meeting } from '../../../../../models/Meeting'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()
  const meetings = await Meeting.find({ customerId: id }).sort({ type: 1 }).lean()

  return meetings.map(m => ({
    ...m,
    _id: m._id.toString(),
    customerId: m.customerId.toString(),
  }))
})
