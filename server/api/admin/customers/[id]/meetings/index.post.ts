import mongoose from 'mongoose'
import { z } from 'zod'
import { Meeting, DEFAULT_MEETINGS } from '../../../../../models/Meeting'

const CreateMeetingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
}).optional()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event).catch(() => null)

  await connectDb()

  if (body?.title) {
    // Add a single extra meeting
    const lastMeeting = await Meeting.findOne({ customerId: id }).sort({ order: -1 }).lean()
    const nextOrder = (lastMeeting?.order || 0) + 1

    await Meeting.create({
      customerId: id,
      title: body.title,
      order: nextOrder,
      status: 'pending',
    })
  } else {
    // Create default 3 meetings if none exist
    const existing = await Meeting.countDocuments({ customerId: id })
    if (existing === 0) {
      await Meeting.insertMany(
        DEFAULT_MEETINGS.map(m => ({
          customerId: id,
          title: m.title,
          order: m.order,
          status: 'pending',
        })),
      )
    }
  }

  const meetings = await Meeting.find({ customerId: id }).sort({ order: 1 }).lean()

  return meetings.map(m => ({
    ...m,
    _id: m._id.toString(),
    customerId: m.customerId.toString(),
  }))
})
