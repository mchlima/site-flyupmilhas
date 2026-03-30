import { Customer } from '../../models/Customer'
import { Assessment } from '../../models/Assessment'
import { Payment } from '../../models/Payment'
import { Meeting } from '../../models/Meeting'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const dateFrom = query.dateFrom as string | undefined
  const dateTo = query.dateTo as string | undefined

  await connectDb()

  // Build date filter
  const dateFilter: Record<string, Date> = {}
  if (dateFrom) {
    const [y, m, d] = dateFrom.split('-').map(Number)
    dateFilter.$gte = new Date(y, m - 1, d, 0, 0, 0, 0)
  }
  if (dateTo) {
    const [y, m, d] = dateTo.split('-').map(Number)
    dateFilter.$lte = new Date(y, m - 1, d, 23, 59, 59, 999)
  }

  const hasDateFilter = Object.keys(dateFilter).length > 0
  const customerDateFilter = hasDateFilter ? { createdAt: dateFilter } : {}
  const paymentDateFilter = hasDateFilter ? { status: 'paid', paidAt: dateFilter } : { status: 'paid' }

  const [
    totalCustomers,
    totalAssessments,
    byStatus,
    customersThisMonth,
    customersThisWeek,
    totalPaid,
    revenueAgg,
    totalRefundedAgg,
    totalMeetings,
    completedMeetings,
    scheduledMeetings,
  ] = await Promise.all([
    Customer.countDocuments(customerDateFilter),
    Assessment.countDocuments(hasDateFilter ? { createdAt: dateFilter } : {}),
    Customer.aggregate([
      ...(hasDateFilter ? [{ $match: { createdAt: dateFilter } }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Customer.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
    Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Payment.countDocuments(paymentDateFilter),
    Payment.aggregate([
      { $match: paymentDateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Payment.aggregate([
      { $match: paymentDateFilter },
      { $group: { _id: null, total: { $sum: '$amountRefunded' } } },
    ]),
    Meeting.countDocuments(hasDateFilter ? { createdAt: dateFilter } : {}),
    Meeting.countDocuments(hasDateFilter ? { status: 'completed', createdAt: dateFilter } : { status: 'completed' }),
    Meeting.countDocuments(hasDateFilter ? { status: 'scheduled', createdAt: dateFilter } : { status: 'scheduled' }),
  ])

  const statusCounts: Record<string, number> = {}
  for (const item of byStatus) {
    statusCounts[item._id || 'lead'] = item.count
  }

  const grossRevenue = revenueAgg[0]?.total || 0
  const totalRefunded = totalRefundedAgg[0]?.total || 0

  return {
    totalCustomers,
    totalAssessments,
    customersThisMonth,
    customersThisWeek,
    statusCounts,
    totalPaid,
    grossRevenue,
    totalRefunded,
    netRevenue: grossRevenue - totalRefunded,
    totalMeetings,
    completedMeetings,
    scheduledMeetings,
  }
})
