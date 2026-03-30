<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Editar Cliente — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const route = useRoute()
const id = route.params.id as string
const toast = useToast()

const { data: lead } = await useFetch(`/api/admin/customers/${id}`)

const form = reactive({
  name: lead.value?.name || '',
  email: lead.value?.email || '',
  phone: lead.value?.phone || '',
  birthDate: lead.value?.birthDate || '',
  state: lead.value?.state || '',
  city: lead.value?.city || '',
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
    await $fetch(`/api/admin/customers/${id}`, { method: 'PUT', body: form })
    toast.add({ title: 'Cliente atualizado', color: 'success' })
    await navigateTo(`/admin/customers/${id}`)
  } catch {
    toast.add({ title: 'Erro ao salvar', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div style="max-width: 640px;">
    <!-- Header -->
    <div style="margin-bottom: 1.5rem;">
      <NuxtLink :to="`/admin/customers/${id}`" style="font-size: 0.8rem; color: var(--ui-text-muted); text-decoration: none;">&larr; Voltar</NuxtLink>
      <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text); margin-top: 0.5rem;">Editar Cliente</h1>
      <span style="font-size: 0.85rem; color: var(--ui-text-muted);">{{ lead?.name }}</span>
    </div>

    <UCard>
      <form style="display: flex; flex-direction: column; gap: 1.5rem;" @submit.prevent="onSubmit">
        <UFormField label="Nome completo" name="name">
          <UInput v-model="form.name" placeholder="Nome completo" icon="i-heroicons-user" size="lg" :ui="{ root: 'w-full' }" />
        </UFormField>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <UFormField label="Email" name="email">
            <UInput v-model="form.email" type="email" placeholder="email@exemplo.com" icon="i-heroicons-envelope" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <UFormField label="Telefone (WhatsApp)" name="phone">
            <UInput v-model="form.phone" placeholder="11999999999" icon="i-heroicons-phone" size="lg" inputmode="numeric" :ui="{ root: 'w-full' }" />
          </UFormField>
        </div>

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

        <USeparator />

        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <UButton :to="`/admin/customers/${id}`" label="Cancelar" color="neutral" variant="ghost" />
          <UButton type="submit" label="Salvar alterações" color="primary" icon="i-heroicons-check" :loading="isLoading" />
        </div>
      </form>
    </UCard>
  </div>
</template>
