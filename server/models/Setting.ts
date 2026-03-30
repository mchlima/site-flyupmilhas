import mongoose, { Schema, type Document } from 'mongoose'

export interface ISetting extends Document {
  key: string
  value: unknown
}

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true })

export const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema)

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  await connectDb()
  const doc = await Setting.findOne({ key }).lean()
  return doc ? (doc.value as T) : defaultValue
}
