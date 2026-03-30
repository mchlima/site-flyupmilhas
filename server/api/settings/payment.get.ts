import { getSetting } from '../../models/Setting'

export default defineEventHandler(async () => {
  const maxInstallments = await getSetting('payment.maxInstallments', 12)
  return { maxInstallments }
})
