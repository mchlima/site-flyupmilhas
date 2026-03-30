import { Customer } from '../../../models/Customer'
import { Assessment } from '../../../models/Assessment'
import { Payment } from '../../../models/Payment'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const status = query.status as string | undefined
  const search = query.search as string | undefined
  const assessment = query.assessment as string | undefined
  const payment = query.payment as string | undefined
  const dateFrom = query.dateFrom as string | undefined
  const dateTo = query.dateTo as string | undefined

  await connectDb()

  const filter: Record<string, unknown> = {}

  if (status && status !== 'all') {
    filter.status = status
  }

  if (search) {
    const regex = { $regex: search, $options: 'i' }
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }]
  }

  // Date filter - parse as local dates
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {}
    if (dateFrom) {
      const [y, m, d] = dateFrom.split('-').map(Number)
      dateFilter.$gte = new Date(y, m - 1, d, 0, 0, 0, 0)
    }
    if (dateTo) {
      const [y, m, d] = dateTo.split('-').map(Number)
      dateFilter.$lte = new Date(y, m - 1, d, 23, 59, 59, 999)
    }
    filter.createdAt = dateFilter
  }

  // Pre-fetch IDs for assessment/payment filters
  const needsIdFilter = (assessment && assessment !== 'all') || (payment && payment !== 'all')

  if (needsIdFilter) {
    // Get base matching customers first
    const baseCustomers = await Customer.find(filter).select('_id').lean()
    const baseIds = baseCustomers.map(c => c._id.toString())

    // Assessment filter
    let idsAfterAssessment = baseIds
    if (assessment === 'yes' || assessment === 'no') {
      const assessmentsFound = await Assessment.find({ customerId: { $in: baseIds } }).select('customerId').lean()
      const withAssessment = new Set(assessmentsFound.map(a => a.customerId.toString()))

      idsAfterAssessment = assessment === 'yes'
        ? baseIds.filter(id => withAssessment.has(id))
        : baseIds.filter(id => !withAssessment.has(id))
    }

    // Payment filter
    let idsAfterPayment = idsAfterAssessment
    if (payment && payment !== 'all') {
      if (payment === 'none') {
        // Customers with NO payments at all
        const anyPayments = await Payment.find({ customerId: { $in: idsAfterAssessment } }).select('customerId').lean()
        const withAnyPayment = new Set(anyPayments.map(p => p.customerId.toString()))
        idsAfterPayment = idsAfterAssessment.filter(id => !withAnyPayment.has(id))
      } else {
        // Customers with payment of specific status
        const matchingPayments = await Payment.find({
          customerId: { $in: idsAfterAssessment },
          status: payment,
        }).select('customerId').lean()
        const withStatus = new Set(matchingPayments.map(p => p.customerId.toString()))
        idsAfterPayment = idsAfterAssessment.filter(id => withStatus.has(id))
      }
    }

    filter._id = { $in: idsAfterPayment }
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Customer.countDocuments(filter),
  ])

  // Enrich results
  const customerIds = customers.map(c => c._id)

  const [assessments, payments] = await Promise.all([
    Assessment.find({ customerId: { $in: customerIds } }).select('customerId').lean(),
    Payment.find({ customerId: { $in: customerIds } }).sort({ createdAt: -1 }).select('customerId status').lean(),
  ])

  const assessmentCustomerIds = new Set(assessments.map(a => a.customerId.toString()))
  const paymentByCustomer = new Map<string, string>()
  for (const p of payments) {
    const cid = p.customerId.toString()
    if (!paymentByCustomer.has(cid)) paymentByCustomer.set(cid, p.status)
  }

  const customersWithExtra = customers.map(c => ({
    ...c,
    _id: c._id.toString(),
    hasAssessment: assessmentCustomerIds.has(c._id.toString()),
    paymentStatus: paymentByCustomer.get(c._id.toString()) || null,
  }))

  return {
    customers: customersWithExtra,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
})
