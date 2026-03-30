import { Customer } from '../../models/Customer'
import { Invoice } from '../../models/Invoice'
import { Payment } from '../../models/Payment'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Verify webhook token if configured
  const token = getHeader(event, 'asaas-access-token')
  if (config.asaasWebhookToken && token !== config.asaasWebhookToken) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid webhook token' })
  }

  if (!body?.event || !body?.payment) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  await connectDb()

  const chargeId = body.payment.id

  if (body.event === 'PAYMENT_CONFIRMED' || body.event === 'PAYMENT_RECEIVED') {
    const payment = await Payment.findOne({ externalId: chargeId })

    if (payment && payment.status !== 'paid') {
      payment.status = 'paid'
      payment.paidAt = new Date()
      await payment.save()

      if (payment.invoiceId) {
        await Invoice.findByIdAndUpdate(payment.invoiceId, { status: 'paid', paidAt: new Date() })
      }

      await Customer.findByIdAndUpdate(payment.customerId, { status: 'paid' })
    }
  }

  if (body.event === 'PAYMENT_OVERDUE' || body.event === 'PAYMENT_DELETED' || body.event === 'PAYMENT_REPROVED_BY_RISK_ANALYSIS') {
    await Payment.findOneAndUpdate(
      { externalId: chargeId },
      { status: 'failed' },
    )
  }

  if (body.event === 'PAYMENT_REFUNDED') {
    await Payment.findOneAndUpdate(
      { externalId: chargeId },
      { status: 'refunded' },
    )
  }

  return { received: true }
})
