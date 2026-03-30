import mongoose, { Schema, type Document, type Types } from 'mongoose'

export const DEFAULT_MEETINGS = [
  { title: 'Início da mentoria', order: 1 },
  { title: 'Acompanhamento (15 dias)', order: 2 },
  { title: 'Encerramento', order: 3 },
]

export type MeetingStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled'

export interface IMeeting extends Document {
  customerId: Types.ObjectId
  title: string
  order: number
  status: MeetingStatus
  scheduledAt: Date | null
  duration: number
  meetLink: string
  notes: string
  createdAt: Date
}

const MeetingSchema = new Schema<IMeeting>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
  scheduledAt: { type: Date, default: null },
  duration: { type: Number, default: 60 },
  meetLink: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true })

MeetingSchema.index({ customerId: 1, order: 1 })

export const Meeting = mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema)
