import mongoose from 'mongoose'
import { Customer } from '../../../models/Customer'
import { Assessment } from '../../../models/Assessment'
import { Payment } from '../../../models/Payment'
import { Invoice } from '../../../models/Invoice'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  await connectDb()
  const customer = await Customer.findById(id).lean()

  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const [assessment, invoices, payments] = await Promise.all([
    Assessment.findOne({ customerId: id }).lean(),
    Invoice.find({ customerId: id }).sort({ createdAt: -1 }).lean(),
    Payment.find({ customerId: id }).sort({ createdAt: -1 }).lean(),
  ])

  // Group payments by invoiceId
  const paymentsByInvoice = new Map<string, typeof payments>()
  for (const p of payments) {
    const key = p.invoiceId?.toString() || '_none'
    if (!paymentsByInvoice.has(key)) paymentsByInvoice.set(key, [])
    paymentsByInvoice.get(key)!.push(p)
  }

  const invoicesWithPayments = invoices.map(inv => ({
    _id: inv._id.toString(),
    description: inv.description,
    amount: inv.amount,
    status: inv.status,
    paidAt: inv.paidAt,
    createdAt: inv.createdAt,
    payments: (paymentsByInvoice.get(inv._id.toString()) || []).map(p => ({
      _id: p._id.toString(),
      status: p.status,
      method: p.method,
      amount: p.amount,
      amountRefunded: p.amountRefunded || 0,
      refunds: p.refunds || [],
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    })),
  }))

  return {
    ...customer,
    _id: customer._id.toString(),
    hasAssessment: !!assessment,
    invoices: invoicesWithPayments,
  }
})
