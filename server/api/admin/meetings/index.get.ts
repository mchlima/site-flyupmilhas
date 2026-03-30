import { Meeting } from '../../../models/Meeting'
import { Customer } from '../../../models/Customer'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))
  const status = query.status as string | undefined
  const search = query.search as string | undefined
  const dateFrom = query.dateFrom as string | undefined
  const dateTo = query.dateTo as string | undefined

  await connectDb()

  const meetingFilter: Record<string, unknown> = {}

  if (status && status !== 'all') {
    meetingFilter.status = status
  }

  // Date filter — match on scheduledAt OR createdAt
  if (dateFrom || dateTo) {
    const buildDateFilter = () => {
      const df: Record<string, Date> = {}
      if (dateFrom) {
        const [y, m, d] = dateFrom.split('-').map(Number)
        df.$gte = new Date(y, m - 1, d, 0, 0, 0, 0)
      }
      if (dateTo) {
        const [y, m, d] = dateTo.split('-').map(Number)
        df.$lte = new Date(y, m - 1, d, 23, 59, 59, 999)
      }
      return df
    }
    const df = buildDateFilter()
    meetingFilter.$or = [
      { scheduledAt: df },
      { scheduledAt: null, createdAt: df },
    ]
  }

  // Search by customer name/email/phone
  let customerIdFilter: string[] | null = null
  if (search) {
    const regex = { $regex: search, $options: 'i' }
    const customers = await Customer.find({
      $or: [{ name: regex }, { email: regex }, { phone: regex }],
    }).select('_id').lean()
    customerIdFilter = customers.map(c => c._id.toString())

    if (customerIdFilter.length === 0) {
      return { meetings: [], total: 0, page, totalPages: 0 }
    }

    meetingFilter.customerId = { $in: customerIdFilter }
  }

  const [meetings, total] = await Promise.all([
    Meeting.find(meetingFilter)
      .sort({ scheduledAt: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Meeting.countDocuments(meetingFilter),
  ])

  // Fetch customer names
  const customerIds = [...new Set(meetings.map(m => m.customerId.toString()))]
  const customers = await Customer.find({ _id: { $in: customerIds } }).select('name email phone').lean()
  const customerMap = new Map(customers.map(c => [c._id.toString(), c]))

  const meetingsWithCustomer = meetings.map(m => {
    const customer = customerMap.get(m.customerId.toString())
    return {
      _id: m._id.toString(),
      customerId: m.customerId.toString(),
      title: m.title,
      order: m.order,
      status: m.status,
      scheduledAt: m.scheduledAt,
      duration: m.duration,
      meetLink: m.meetLink,
      createdAt: m.createdAt,
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
    }
  })

  return {
    meetings: meetingsWithCustomer,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
})
