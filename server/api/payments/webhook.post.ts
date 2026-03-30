import { Customer } from '../../models/Customer'
import { Invoice } from '../../models/Invoice'
import { Payment } from '../../models/Payment'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = getStripe()

  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!body || !signature) {
    throw createError({ statusCode: 400, statusMessage: 'Missing body or signature' })
  }

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid signature' })
  }

  await connectDb()

  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object
    const payment = await Payment.findOne({ stripeSessionId: paymentIntent.id })

    if (payment && payment.status !== 'paid') {
      payment.status = 'paid'
      payment.stripePaymentIntentId = paymentIntent.id
      payment.paidAt = new Date()
      await payment.save()

      // Mark invoice as paid
      if (payment.invoiceId) {
        await Invoice.findByIdAndUpdate(payment.invoiceId, { status: 'paid', paidAt: new Date() })
      }

      // Update customer status
      await Customer.findByIdAndUpdate(payment.customerId, { status: 'paid' })
    }
  }

  if (stripeEvent.type === 'payment_intent.payment_failed') {
    const paymentIntent = stripeEvent.data.object
    await Payment.findOneAndUpdate(
      { stripeSessionId: paymentIntent.id },
      { status: 'failed' },
    )
  }

  return { received: true }
})
