import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer } from '../../models/Customer'
import { Invoice } from '../../models/Invoice'
import { Payment } from '../../models/Payment'

const CreateIntentSchema = z.object({
  invoiceId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), 'Invalid ID'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = CreateIntentSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  const { invoiceId } = result.data

  await connectDb()

  const invoice = await Invoice.findById(invoiceId).lean()
  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  if (invoice.status === 'paid') {
    throw createError({ statusCode: 409, statusMessage: 'Invoice already paid' })
  }

  if (invoice.status === 'cancelled') {
    throw createError({ statusCode: 400, statusMessage: 'Invoice cancelled' })
  }

  const customer = await Customer.findById(invoice.customerId).lean()
  if (!customer) {
    throw createError({ statusCode: 404, statusMessage: 'Customer not found' })
  }

  const stripe = getStripe()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: invoice.amount,
    currency: 'brl',
    payment_method_types: ['card'],
    description: invoice.description,
    metadata: { customerId: invoice.customerId.toString(), invoiceId },
    receipt_email: customer.email,
  })

  await Payment.create({
    customerId: invoice.customerId,
    invoiceId,
    stripeSessionId: paymentIntent.id,
    amount: invoice.amount,
    currency: 'brl',
    method: 'card',
    status: 'pending',
  })

  return { clientSecret: paymentIntent.client_secret }
})
