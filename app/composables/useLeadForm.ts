// app/composables/useLeadForm.ts
import { z } from 'zod'

// Mirror server/leads/schema.ts EXACTLY — field names and enum values are the backend contract
export const LeadFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  whatsapp: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 dígitos (somente números)',
  ),
  gastoMensal: z.string().min(1, 'Campo obrigatório'),
  objetivo: z.enum(['executiva', 'economia', 'renda-extra'], {
    errorMap: () => ({ message: 'Selecione um objetivo válido' }),
  }),
  website: z.string().optional(), // Honeypot — include in POST body; backend handles silently
})

export type LeadFormData = z.infer<typeof LeadFormSchema>

export function useLeadForm() {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig()

  async function submit(data: LeadFormData): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`${config.public.apiBase}/leads`, {
        method: 'POST',
        body: data,
      })
      isSuccess.value = true
    }
    catch (err: unknown) {
      if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as { status: number }).status
        if (status === 429) {
          error.value = 'Muitas tentativas. Tente novamente em 1 minuto.'
        }
        else if (status === 400) {
          error.value = 'Dados inválidos. Verifique os campos e tente novamente.'
        }
        else {
          error.value = 'Erro de conexão. Tente novamente.'
        }
      }
      else {
        error.value = 'Erro de conexão. Tente novamente.'
      }
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, isSuccess, error, submit }
}
