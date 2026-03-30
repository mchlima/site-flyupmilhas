import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IInvoice extends Document {
  customerId: Types.ObjectId
  description: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'cancelled'
  paidAt: Date | null
  createdBy: Types.ObjectId
  createdAt: Date
}

const InvoiceSchema = new Schema<IInvoice>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'brl' },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paidAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema)
