import { getSetting } from '../../models/Setting'

export default defineEventHandler(async () => {
  const [maxInstallments, price, name, description] = await Promise.all([
    getSetting('payment.maxInstallments', 12),
    getSetting('plan.price', 20000),
    getSetting('plan.name', 'Mentoria Fly Up Milhas'),
    getSetting('plan.description', '3 encontros online + suporte via WhatsApp'),
  ])
  return { maxInstallments, price, name, description }
})
