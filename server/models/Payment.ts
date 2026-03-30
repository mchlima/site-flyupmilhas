import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IRefund {
  externalId: string
  amount: number
  reason: string
  createdAt: Date
}

export interface IPayment extends Document {
  customerId: Types.ObjectId
  invoiceId: Types.ObjectId
  externalId: string
  amount: number
  amountRefunded: number
  currency: string
  method: 'card' | 'pix'
  installmentCount: number
  installmentValue: number | null
  cardHolderName: string | null
  cardLastDigits: string | null
  cardExpiry: string | null
  cardBrand: string | null
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired' | 'partially_refunded' | 'refunded'
  refunds: IRefund[]
  paidAt: Date | null
  createdAt: Date
}

const RefundSchema = new Schema<IRefund>({
  externalId: { type: String, default: '' },
  amount: { type: Number, required: true },
  reason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { _id: false })

const PaymentSchema = new Schema<IPayment>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
  externalId: { type: String, required: true },
  amount: { type: Number, required: true },
  amountRefunded: { type: Number, default: 0 },
  currency: { type: String, default: 'brl' },
  method: { type: String, enum: ['card', 'pix'], default: 'card' },
  installmentCount: { type: Number, default: 1 },
  installmentValue: { type: Number, default: null },
  cardHolderName: { type: String, default: null },
  cardLastDigits: { type: String, default: null },
  cardExpiry: { type: String, default: null },
  cardBrand: { type: String, default: null },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'cancelled', 'expired', 'partially_refunded', 'refunded'], default: 'pending' },
  refunds: { type: [RefundSchema], default: [] },
  paidAt: { type: Date, default: null },
}, { timestamps: true })

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
