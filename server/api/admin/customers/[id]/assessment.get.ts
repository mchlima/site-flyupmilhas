import mongoose from 'mongoose'
import { Assessment } from '../../../../models/Assessment'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()
  const assessment = await Assessment.findOne({ customerId: id }).lean()

  if (!assessment) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  return { ...assessment, _id: assessment._id.toString(), customerId: assessment.customerId.toString() }
})
