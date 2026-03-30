import { Assessment } from '../../../models/Assessment'
import { Customer } from '../../../models/Customer'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const search = query.search as string | undefined

  await connectDb()

  const filter: Record<string, unknown> = {}

  if (search) {
    const regex = { $regex: search, $options: 'i' }
    const customers = await Customer.find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }],
    }).select('_id').lean()

    const customerIds = customers.map(c => c._id.toString())

    if (customerIds.length === 0) {
      return { assessments: [], total: 0, page, totalPages: 0 }
    }

    filter.customerId = { $in: customerIds }
  }

  const [assessments, total] = await Promise.all([
    Assessment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Assessment.countDocuments(filter),
  ])

  const customerIds = [...new Set(assessments.map(a => a.customerId.toString()))]
  const customers = await Customer.find({ _id: { $in: customerIds } }).select('name email phone').lean()
  const customerMap = new Map(customers.map(c => [c._id.toString(), c]))

  const assessmentsWithCustomer = assessments.map(a => {
    const customer = customerMap.get(a.customerId.toString())
    return {
      _id: a._id.toString(),
      customerId: a.customerId.toString(),
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      knowledgeLevel: a.knowledgeLevel,
      goals: a.goals,
      monthlySpending: a.monthlySpending,
      timeframe: a.timeframe,
      createdAt: a.createdAt,
    }
  })

  return {
    assessments: assessmentsWithCustomer,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
})
