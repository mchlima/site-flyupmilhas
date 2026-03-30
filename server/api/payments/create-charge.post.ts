import mongoose from 'mongoose'
import { z } from 'zod'
import { Customer } from '../../models/Customer'
import { Invoice } from '../../models/Invoice'
import { Payment } from '../../models/Payment'
import { getSetting } from '../../models/Setting'

const CreateChargeSchema = z.object({
  invoiceId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), 'Invalid ID'),
  method: z.enum(['CREDIT_CARD', 'PIX']),
  cpfCnpj: z.string().min(11).optional(),
  installmentCount: z.number().min(1).max(12).optional(),
  // Credit card fields (required when method is CREDIT_CARD)
  creditCard: z.object({
    holderName: z.string().min(1),
    number: z.string().min(13),
    expiryMonth: z.string().min(1),
    expiryYear: z.string().min(2),
    ccv: z.string().min(2),
  }).optional(),
  creditCardHolderInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    cpfCnpj: z.string().min(11),
    postalCode: z.string().min(8),
    addressNumber: z.string().min(1),
    phone: z.string().min(10),
  }).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = CreateChargeSchema.safeParse(body)

  if (!result.success) {
    throw createError({ statusCode: 400, data: result.error.flatten() })
  }

  const { invoiceId, method, cpfCnpj, installmentCount, creditCard, creditCardHolderInfo } = result.data

  if (method === 'CREDIT_CARD' && (!creditCard || !creditCardHolderInfo)) {
    throw createError({ statusCode: 400, statusMessage: 'Credit card data required' })
  }

  // Validate installment count against settings
  if (installmentCount && installmentCount > 1) {
    const maxInstallments = await getSetting('payment.maxInstallments', 12)
    if (installmentCount > maxInstallments) {
      throw createError({ statusCode: 400, statusMessage: `Máximo de ${maxInstallments} parcelas permitido` })
    }
  }

  await connectDb()

  const invoice = await Invoice.findById(invoiceId).lean()
  if (!invoice) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  if (invoice.status === 'paid') throw createError({ statusCode: 409, statusMessage: 'Invoice already paid' })
  if (invoice.status === 'cancelled') throw createError({ statusCode: 400, statusMessage: 'Invoice cancelled' })

  const customer = await Customer.findById(invoice.customerId).lean()
  if (!customer) throw createError({ statusCode: 404, statusMessage: 'Customer not found' })

  // Cancel pending payments for this invoice
  const pendingPayments = await Payment.find({ invoiceId, status: 'pending' })
  for (const pp of pendingPayments) {
    await asaasApi(`/payments/${pp.externalId}`, { method: 'DELETE' }).catch(() => {})
    pp.status = 'cancelled'
    await pp.save()
  }

  // Resolve CPF
  const customerCpf = cpfCnpj || creditCardHolderInfo?.cpfCnpj || (customer as any).cpfCnpj || ''
  if (!customerCpf) {
    throw createError({ statusCode: 400, statusMessage: 'CPF é obrigatório para pagamento' })
  }
  const cleanCpf = customerCpf.replace(/\D/g, '')

  // Save CPF on customer if not set
  if (!(customer as any).cpfCnpj) {
    await Customer.findByIdAndUpdate(customer._id, { cpfCnpj: cleanCpf })
  }

  // Ensure customer exists in Asaas
  let asaasCustomerId = (customer as any).asaasCustomerId
  if (!asaasCustomerId) {
    const asaasCustomer = await asaasApi('/customers', {
      method: 'POST',
      body: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpfCnpj: cleanCpf,
        externalReference: customer._id.toString(),
      },
    }) as any
    asaasCustomerId = asaasCustomer.id
    await Customer.findByIdAndUpdate(customer._id, { asaasCustomerId })
  } else {
    // Update CPF on existing Asaas customer if needed
    await asaasApi(`/customers/${asaasCustomerId}`, {
      method: 'POST',
      body: { cpfCnpj: cleanCpf },
    }).catch(() => {})
  }

  // Create charge
  const chargeBody: Record<string, unknown> = {
    customer: asaasCustomerId,
    billingType: method,
    value: invoice.amount / 100, // Asaas uses reais, not centavos
    dueDate: new Date().toISOString().split('T')[0],
    description: invoice.description,
    externalReference: invoiceId,
  }

  if (method === 'CREDIT_CARD') {
    // Ensure expiryYear has 4 digits
    const cardData = { ...creditCard! }
    if (cardData.expiryYear.length === 2) {
      cardData.expiryYear = `20${cardData.expiryYear}`
    }
    chargeBody.creditCard = cardData
    chargeBody.creditCardHolderInfo = creditCardHolderInfo

    if (installmentCount && installmentCount > 1) {
      chargeBody.installmentCount = installmentCount
      chargeBody.totalValue = invoice.amount / 100
    }
  }

  // Prepare card info for persistence
  const paymentMethod = method === 'CREDIT_CARD' ? 'card' : 'pix'
  const actualInstallments = installmentCount && installmentCount > 1 ? installmentCount : 1
  const installmentValue = actualInstallments > 1 ? Math.round(invoice.amount / actualInstallments) : null
  const cardInfo = method === 'CREDIT_CARD' && creditCard ? {
    cardHolderName: creditCard.holderName,
    cardLastDigits: creditCard.number.replace(/\s/g, '').slice(-4),
    cardExpiry: `${creditCard.expiryMonth}/${creditCard.expiryYear}`,
  } : {}

  let charge: any
  try {
    charge = await asaasApi('/payments', {
      method: 'POST',
      body: chargeBody,
    })
  } catch (err: any) {
    const errors = err?.data?.errors || err?.response?._data?.errors
    const message = errors?.[0]?.description || 'Erro ao processar pagamento'

    // Save failed payment for history
    await Payment.create({
      customerId: invoice.customerId,
      invoiceId,
      externalId: `failed_${Date.now()}`,
      amount: invoice.amount,
      currency: 'brl',
      method: paymentMethod,
      installmentCount: actualInstallments,
      installmentValue,
      ...cardInfo,
      status: 'failed',
    })

    throw createError({ statusCode: 400, statusMessage: message })
  }

  const payment = await Payment.create({
    customerId: invoice.customerId,
    invoiceId,
    externalId: charge.id,
    amount: invoice.amount,
    currency: 'brl',
    method: paymentMethod,
    installmentCount: actualInstallments,
    installmentValue,
    ...cardInfo,
    cardBrand: (charge.creditCard?.creditCardBrand || null) as string | null,
    status: charge.status === 'CONFIRMED' || charge.status === 'RECEIVED' ? 'paid' : 'pending',
    ...(charge.status === 'CONFIRMED' || charge.status === 'RECEIVED' ? { paidAt: new Date() } : {}),
  })

  // If card payment was confirmed immediately, update invoice
  if (charge.status === 'CONFIRMED' || charge.status === 'RECEIVED') {
    await Invoice.findByIdAndUpdate(invoiceId, { status: 'paid', paidAt: new Date() })
    await Customer.findByIdAndUpdate(invoice.customerId, { status: 'paid' })
  }

  // For PIX, fetch QR code
  let pixData = null
  if (method === 'PIX') {
    const qrCode = await asaasApi(`/payments/${charge.id}/pixQrCode`) as any
    pixData = {
      encodedImage: qrCode.encodedImage,
      payload: qrCode.payload,
      expirationDate: qrCode.expirationDate,
    }
  }

  return {
    chargeId: charge.id,
    status: charge.status,
    paid: charge.status === 'CONFIRMED' || charge.status === 'RECEIVED',
    installmentCount: installmentCount || 1,
    pix: pixData,
  }
})
