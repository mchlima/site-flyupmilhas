import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer } from '../models/Customer'
import { Assessment } from '../models/Assessment'

const AssessmentSchema = z.object({
  customerId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), 'Invalid ID'),
  // Customer fields
  birthDate: z.string().min(10, 'Informe sua data de nascimento').max(10),
  state: z.string().min(2, 'Informe seu estado').max(50),
  city: z.string().optional(),
  // Assessment fields
  hasPrograms: z.enum(['yes', 'no']),
  programs: z.array(z.string()).optional(),
  knowledgeLevel: z.enum([
    'none',
    'basic',
    'moderate',
    'good',
    'advanced',
  ]),
  goals: z.array(z.string()).min(1, 'Selecione ao menos um objetivo'),
  destination: z.string().optional(),
  creditCards: z.string().optional(),
  monthlySpending: z.enum([
    'up-to-1000',
    '1001-2500',
    '2501-5000',
    '5001-10000',
    'above-10000',
    'unknown',
  ]),
  timeframe: z.enum([
    'short',
    'medium',
    'long',
  ]),
  monthlyInvestment: z.enum([
    'up-to-200',
    '200-500',
    '500-1000',
    '1000-2000',
    'above-2000',
  ]),
  mainChallenge: z.string().optional(),
  expectations: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = AssessmentSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      data: result.error.flatten(),
    })
  }

  const { customerId, birthDate, state, city, ...assessmentData } = result.data

  await connectDb()

  const customer = await Customer.findById(customerId).lean()
  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const existing = await Assessment.exists({ customerId })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Assessment already submitted' })
  }

  // Update customer with personal data + status
  await Customer.findByIdAndUpdate(customerId, {
    birthDate,
    state,
    city: city || '',
    status: 'qualified',
  })

  // Create assessment with remaining data
  const assessment = await Assessment.create({
    customerId,
    ...assessmentData,
  })

  return { success: true, id: assessment._id.toString() }
})
