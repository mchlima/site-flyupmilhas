import mongoose from 'mongoose'
import { z } from 'zod'
import { Meeting } from '../../../../../models/Meeting'

const UpdateMeetingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional(),
  scheduledAt: z.string().optional().nullable(),
  meetLink: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  duration: z.number().min(15).max(240).optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const meetingId = getRouterParam(event, 'meetingId')

  if (!id || !meetingId || !mongoose.Types.ObjectId.isValid(meetingId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = UpdateMeetingSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()

  const update: Record<string, unknown> = {}
  if (result.data.title !== undefined) update.title = result.data.title
  if (result.data.status !== undefined) update.status = result.data.status
  if (result.data.scheduledAt !== undefined) update.scheduledAt = result.data.scheduledAt ? new Date(result.data.scheduledAt) : null
  if (result.data.meetLink !== undefined) update.meetLink = result.data.meetLink
  if (result.data.notes !== undefined) update.notes = result.data.notes
  if (result.data.duration !== undefined) update.duration = result.data.duration

  const meeting = await Meeting.findOneAndUpdate(
    { _id: meetingId, customerId: id },
    update,
    { new: true },
  ).lean()

  if (!meeting) {
    throw createError({ statusCode: 404, statusMessage: 'Meeting not found' })
  }

  return { ...meeting, _id: meeting._id.toString(), customerId: meeting.customerId.toString() }
})
