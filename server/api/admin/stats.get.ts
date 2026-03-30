import { Customer } from '../../models/Customer'
import { Assessment } from '../../models/Assessment'
import { Payment } from '../../models/Payment'

export default defineEventHandler(async () => {
  await connectDb()

  const [totalCustomers, totalAssessments, byStatus, thisMonth, thisWeek, totalPaid, totalRevenue] = await Promise.all([
    Customer.countDocuments(),
    Assessment.countDocuments(),
    Customer.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Customer.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
    Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Payment.countDocuments({ status: 'paid' }),
    Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ])

  const statusCounts: Record<string, number> = {}
  for (const item of byStatus) {
    statusCounts[item._id || 'lead'] = item.count
  }

  return {
    totalCustomers,
    totalAssessments,
    customersThisMonth: thisMonth,
    customersThisWeek: thisWeek,
    statusCounts,
    totalPaid,
    totalRevenue: totalRevenue[0]?.total || 0,
  }
})
