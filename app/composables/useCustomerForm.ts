// app/composables/useCustomerForm.ts
import { z } from 'zod'

export const CustomerFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Informe um e-mail valido'),
  phone: z.string().regex(
    /^\d{10,11}$/,
    'WhatsApp deve conter 10 ou 11 dígitos (somente números)',
  ),
  website: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof CustomerFormSchema>

export function useCustomerForm() {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)
  async function submit(data: CustomerFormData): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await $fetch('/api/customers', {
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
