import mongoose, { Schema, type Document } from 'mongoose'

export const CUSTOMER_STATUS_VALUES = [
  'lead',
  'qualified',
  'paid',
  'in-mentoring',
  'completed',
  'cancelled',
] as const

export type CustomerStatus = typeof CUSTOMER_STATUS_VALUES[number]

export interface ICustomer extends Document {
  name: string
  email: string
  phone: string
  birthDate: string
  state: string
  city: string
  status: CustomerStatus
  source: string
  createdAt: Date
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  birthDate: { type: String, default: '' },
  state: { type: String, default: '' },
  city: { type: String, default: '' },
  status: { type: String, enum: CUSTOMER_STATUS_VALUES, default: 'lead' },
  source: { type: String, default: 'lp-flyupmilhas' },
  cpfCnpj: { type: String, default: '' },
  asaasCustomerId: { type: String, default: '' },
}, { timestamps: true })

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema, 'customers')
