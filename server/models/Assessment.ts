import mongoose, { Schema, type Document, type Types } from 'mongoose'

export interface IAssessment extends Document {
  customerId: Types.ObjectId
  hasPrograms: 'yes' | 'no'
  programs: string[]
  knowledgeLevel: string
  goals: string[]
  destination: string
  creditCards: string
  monthlySpending: string
  timeframe: string
  monthlyInvestment: string
  mainChallenge: string
  expectations: string
  createdAt: Date
}

const AssessmentSchema = new Schema<IAssessment>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  hasPrograms: { type: String, enum: ['yes', 'no'], required: true },
  programs: { type: [String], default: [] },
  knowledgeLevel: { type: String, required: true },
  goals: { type: [String], required: true },
  destination: { type: String, default: '' },
  creditCards: { type: String, default: '' },
  monthlySpending: { type: String, required: true },
  timeframe: { type: String, required: true },
  monthlyInvestment: { type: String, required: true },
  mainChallenge: { type: String, default: '' },
  expectations: { type: String, default: '' },
}, { timestamps: true })

export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema)
