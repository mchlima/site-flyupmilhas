import { z } from 'zod'

export const LeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Informe um e-mail valido'),
  whatsapp: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 digitos (somente numeros)',
  ),
  website: z.string().optional(), // Honeypot — do NOT validate format; presence = bot
})

export type Lead = z.infer<typeof LeadSchema>
