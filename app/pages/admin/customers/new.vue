<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Novo Cliente — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  state: '',
  city: '',
})

const isLoading = ref(false)

const stateRef = computed(() => form.state)
const { cities, loading: citiesLoading } = useBrazilianCities(stateRef)

watch(() => form.state, (newVal, oldVal) => {
  if (oldVal && newVal !== oldVal) form.city = ''
})

async function onSubmit() {
  isLoading.value = true
  try {
    const result = await $fetch<{ id: string }>('/api/admin/customers', {
      method: 'POST',
      body: form,
    })
    toast.add({ title: 'Cliente criado com sucesso', color: 'success' })
    await navigateTo(`/admin/customers/${result.id}`)
  } catch {
    toast.add({ title: 'Erro ao criar cliente', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div style="max-width: 640px;">
    <!-- Header -->
    <div style="margin-bottom: 1.5rem;">
      <NuxtLink to="/admin/customers" style="font-size: 0.8rem; color: var(--ui-text-muted); text-decoration: none;">&larr; Voltar</NuxtLink>
      <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text); margin-top: 0.5rem;">Novo Cliente</h1>
      <span style="font-size: 0.85rem; color: var(--ui-text-muted);">Adicionar cliente manualmente</span>
    </div>

    <form @submit.prevent="onSubmit">
      <!-- Contato -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-user" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Contato</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <UFormField label="Nome completo" name="name" required>
            <UInput v-model="form.name" placeholder="Nome completo" icon="i-heroicons-user" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <UFormField label="Email" name="email" required>
              <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" icon="i-heroicons-envelope" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Telefone (WhatsApp)" name="phone" required>
              <UInput v-model="form.phone" placeholder="11999999999" icon="i-heroicons-phone" size="lg" inputmode="numeric" :ui="{ root: 'w-full' }" />
            </UFormField>
          </div>
        </div>
      </UCard>

      <!-- Dados pessoais -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-identification" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Dados pessoais</span>
            <UBadge color="neutral" variant="subtle" size="xs">Opcional</UBadge>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <UFormField label="Data de nascimento" name="birthDate">
            <UInput v-model="form.birthDate" type="date" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <UFormField label="Estado" name="state">
              <UInputMenu
                v-model="form.state"
                :items="BRAZILIAN_STATES"
                value-key="value"
                label-key="label"
                placeholder="Selecione"
                size="lg"
              />
            </UFormField>

            <UFormField v-if="form.state" label="Cidade" name="city">
              <UInputMenu
                v-model="form.city"
                :items="cities"
                :loading="citiesLoading"
                placeholder="Selecione"
                size="lg"
              />
            </UFormField>
          </div>
        </div>
      </UCard>

      <!-- Actions -->
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <UButton to="/admin/customers" label="Cancelar" color="neutral" variant="ghost" />
        <UButton type="submit" label="Criar cliente" color="primary" icon="i-heroicons-plus" :loading="isLoading" />
      </div>
    </form>
  </div>
</template>
