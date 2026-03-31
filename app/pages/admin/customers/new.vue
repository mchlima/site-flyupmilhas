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
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin/customers" class="text-[0.8rem] text-[var(--ui-text-muted)] no-underline">&larr; Voltar</NuxtLink>
      <h1 class="text-2xl font-bold text-[var(--ui-text)] mt-2">Novo Cliente</h1>
      <span class="text-sm text-[var(--ui-text-muted)]">Adicionar cliente manualmente</span>
    </div>

    <form @submit.prevent="onSubmit">
      <!-- Contato -->
      <UCard class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-sm">Contato</span>
          </div>
        </template>

        <div class="flex flex-col gap-6">
          <UFormField label="Nome completo" name="name" required>
            <UInput v-model="form.name" placeholder="Nome completo" icon="i-heroicons-user" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      <UCard class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-identification" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-sm">Dados pessoais</span>
            <UBadge color="neutral" variant="subtle" size="xs">Opcional</UBadge>
          </div>
        </template>

        <div class="flex flex-col gap-6">
          <UFormField label="Data de nascimento" name="birthDate">
            <UInput v-model="form.birthDate" type="date" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      <div class="flex gap-3 justify-end">
        <UButton to="/admin/customers" label="Cancelar" color="neutral" variant="ghost" />
        <UButton type="submit" label="Criar cliente" color="primary" icon="i-heroicons-plus" :loading="isLoading" />
      </div>
    </form>
  </div>
</template>
