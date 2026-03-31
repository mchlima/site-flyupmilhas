<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Configurações — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const toast = useToast()

const { data: settings, refresh } = await useFetch('/api/admin/settings')

const form = reactive({
  name: '',
  description: '',
  priceDisplay: '',
  maxInstallments: 12,
})

watch(settings, (val) => {
  if (val) {
    form.name = (val['plan.name'] as string) || 'Mentoria Fly Up Milhas'
    form.description = (val['plan.description'] as string) || '3 encontros online + suporte via WhatsApp'
    const cents = (val['plan.price'] as number) || 20000
    form.priceDisplay = (cents / 100).toFixed(2).replace('.', ',')
    form.maxInstallments = (val['payment.maxInstallments'] as number) || 12
  }
}, { immediate: true })

const isLoading = ref(false)

function parsePriceToCents(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.')
  return Math.round(parseFloat(cleaned) * 100)
}

async function onSubmit() {
  const cents = parsePriceToCents(form.priceDisplay)
  if (isNaN(cents) || cents < 100) {
    toast.add({ title: 'Preço inválido (mínimo R$ 1,00)', color: 'error' })
    return
  }

  isLoading.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        'plan.price': cents,
        'plan.name': form.name,
        'plan.description': form.description,
        'payment.maxInstallments': form.maxInstallments,
      },
    })
    toast.add({ title: 'Configurações salvas', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Erro ao salvar', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--ui-text)]">Configurações</h1>
      <p class="text-sm text-[var(--ui-text-muted)]">Gerencie o plano e preços da mentoria</p>
    </div>

    <form @submit.prevent="onSubmit">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-sm">Plano da mentoria</span>
          </div>
        </template>

        <div class="flex flex-col gap-6">
          <UFormField label="Nome do plano">
            <UInput v-model="form.name" placeholder="Mentoria Fly Up Milhas" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <UFormField label="Descrição">
            <UTextarea v-model="form.description" :rows="2" placeholder="Descrição curta do plano" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <UFormField label="Preço (R$)">
              <UInput v-model="form.priceDisplay" placeholder="200,00" size="lg" icon="i-heroicons-currency-dollar" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Máximo de parcelas no cartão" help="De 1 (somente à vista) até 12 parcelas">
              <USelect
                v-model="form.maxInstallments"
                :items="Array.from({ length: 12 }, (_, i) => ({ label: i === 0 ? '1x (à vista)' : `${i + 1}x`, value: i + 1 }))"
                value-key="value"
                label-key="label"
                size="lg"
              />
            </UFormField>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton type="submit" label="Salvar configurações" color="primary" icon="i-heroicons-check" :loading="isLoading" />
          </div>
        </template>
      </UCard>
    </form>
  </div>
</template>
