import mongoose from 'mongoose'
import { z } from 'zod'
import { Assessment } from '../../../../models/Assessment'

const UpdateAssessmentSchema = z.object({
  hasPrograms: z.enum(['yes', 'no']).optional(),
  programs: z.array(z.string()).optional(),
  knowledgeLevel: z.enum(['none', 'basic', 'moderate', 'good', 'advanced']).optional(),
  goals: z.array(z.string()).optional(),
  destination: z.string().optional(),
  creditCards: z.string().optional(),
  monthlySpending: z.enum(['up-to-1000', '1001-2500', '2501-5000', '5001-10000', 'above-10000', 'unknown']).optional(),
  timeframe: z.enum(['short', 'medium', 'long']).optional(),
  monthlyInvestment: z.enum(['up-to-200', '200-500', '500-1000', '1000-2000', 'above-2000']).optional(),
  mainChallenge: z.string().optional(),
  expectations: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = UpdateAssessmentSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  await connectDb()
  const assessment = await Assessment.findOneAndUpdate(
    { customerId: id },
    result.data,
    { new: true },
  ).lean()

  if (!assessment) {
    throw createError({ statusCode: 404, statusMessage: 'Assessment not found' })
  }

  return { ...assessment, _id: assessment._id.toString(), customerId: assessment.customerId.toString() }
})
