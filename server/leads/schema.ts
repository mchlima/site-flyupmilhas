import { z } from 'zod'

export const LeadSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  whatsapp: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 dígitos (somente números)',
  ),
  gastoMensal: z.string().min(1, 'Campo obrigatório'),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra'], {
    errorMap: () => ({ message: 'Selecione um objetivo válido' }),
  }),
  website: z.string().optional(), // Honeypot — do NOT validate format; presence = bot
})

export type Lead = z.infer<typeof LeadSchema>
