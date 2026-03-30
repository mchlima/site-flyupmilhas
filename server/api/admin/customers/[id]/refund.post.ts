import mongoose from 'mongoose'
import { z } from 'zod'
import { Payment } from '../../../../models/Payment'
import { Customer } from '../../../../models/Customer'

const RefundSchema = z.object({
  paymentId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), 'Invalid payment ID'),
  amount: z.number().min(1, 'Valor mínimo: R$ 0,01'),
  reason: z.string().min(1, 'Motivo é obrigatório').max(500),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })
  }

  const body = await readBody(event)
  const result = RefundSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  const { paymentId, amount, reason } = result.data

  await connectDb()

  const payment = await Payment.findOne({
    _id: paymentId,
    customerId: id,
    status: { $in: ['paid', 'partially_refunded'] },
  })

  if (!payment) {
    throw createError({ statusCode: 404, statusMessage: 'No refundable payment found' })
  }

  // Validate: amount must not exceed original payment
  if (amount > payment.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: `Valor excede o total do pagamento (R$ ${(payment.amount / 100).toFixed(2)})`,
    })
  }

  // Validate: sum of all refunds + new amount must not exceed total
  const totalRefunded = payment.refunds.reduce((sum, r) => sum + r.amount, 0)
  const refundable = payment.amount - totalRefunded

  if (refundable <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pagamento já foi totalmente estornado',
    })
  }

  if (amount > refundable) {
    throw createError({
      statusCode: 400,
      statusMessage: `Valor excede o disponível para estorno. Já estornado: R$ ${(totalRefunded / 100).toFixed(2)} — Disponível: R$ ${(refundable / 100).toFixed(2)}`,
    })
  }

  // Process refund via Asaas
  let refundResult: any
  try {
    refundResult = await asaasApi(`/payments/${payment.externalId}/refund`, {
      method: 'POST',
      body: {
        value: amount / 100,
        description: reason,
      },
    })
  } catch (asaasError: any) {
    // If individual refund fails (e.g. installment), record locally
    const errorMsg = asaasError?.data?.errors?.[0]?.description || ''
    if (errorMsg.includes('individualmente')) {
      // Installment payment — refund must be done in Asaas dashboard
      // Record locally for tracking
      refundResult = { id: `local_${Date.now()}` }
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: errorMsg || 'Erro ao processar estorno no gateway',
      })
    }
  }

  // Update payment
  const newAmountRefunded = payment.amountRefunded + amount
  const isFullRefund = newAmountRefunded >= payment.amount

  payment.amountRefunded = newAmountRefunded
  payment.status = isFullRefund ? 'refunded' : 'partially_refunded'
  payment.refunds.push({
    externalId: refundResult.id || `refund_${Date.now()}`,
    amount,
    reason: reason || '',
    createdAt: new Date(),
  })
  await payment.save()

  // Update customer status if full refund
  if (isFullRefund) {
    await Customer.findByIdAndUpdate(id, { status: 'awaiting-payment' })
  }

  return {
    success: true,
    refundId: refundResult.id,
    amountRefunded: newAmountRefunded,
    status: payment.status,
  }
})
