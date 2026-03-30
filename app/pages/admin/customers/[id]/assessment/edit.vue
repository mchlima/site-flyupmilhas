<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Editar Avaliação — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const route = useRoute()
const id = route.params.id as string
const toast = useToast()

const { data: assessment } = await useFetch(`/api/admin/customers/${id}/assessment`)
const { data: lead } = await useFetch(`/api/admin/customers/${id}`)

const form = reactive({
  hasPrograms: assessment.value?.hasPrograms || 'no',
  programs: [...(assessment.value?.programs || [])],
  knowledgeLevel: assessment.value?.knowledgeLevel || 'none',
  goals: [...(assessment.value?.goals || [])],
  destination: assessment.value?.destination || '',
  creditCards: assessment.value?.creditCards || '',
  monthlySpending: assessment.value?.monthlySpending || 'up-to-1000',
  timeframe: assessment.value?.timeframe || 'short',
  monthlyInvestment: assessment.value?.monthlyInvestment || 'up-to-200',
  mainChallenge: assessment.value?.mainChallenge || '',
  expectations: assessment.value?.expectations || '',
})

const isLoading = ref(false)

const hasProgramsItems = [{ label: 'Sim', value: 'yes' }, { label: 'Não', value: 'no' }]
const programItems = ['Latam Pass', 'Azul (TudoAzul)', 'Smiles (GOL)', 'Livelo', 'Esfera', 'Outro']
const programValues = ['latam-pass', 'azul', 'smiles', 'livelo', 'esfera', 'other']
const knowledgeItems = [
  { label: 'Nenhum', value: 'none' }, { label: 'Básico', value: 'basic' }, { label: 'Moderado', value: 'moderate' }, { label: 'Bom', value: 'good' }, { label: 'Avançado', value: 'advanced' },
]
const goalItems = ['Viajar pagando menos', 'Acumular mais milhas', 'Organizar milhas', 'Planejamento de viagens', 'Outro']
const goalValues = ['travel-cheaper', 'accumulate', 'organize', 'trip-planning', 'other']
const spendingItems = [
  { label: 'Até R$ 1.000', value: 'up-to-1000' }, { label: 'R$ 1.001–2.500', value: '1001-2500' }, { label: 'R$ 2.501–5.000', value: '2501-5000' }, { label: 'R$ 5.001–10.000', value: '5001-10000' }, { label: 'Acima de R$ 10.000', value: 'above-10000' }, { label: 'Não sei', value: 'unknown' },
]
const timeframeItems = [
  { label: 'Curto (0–3 meses)', value: 'short' }, { label: 'Médio (3–12 meses)', value: 'medium' }, { label: 'Longo (12+ meses)', value: 'long' },
]
const investmentItems = [
  { label: 'Até R$ 200', value: 'up-to-200' }, { label: 'R$ 200–500', value: '200-500' }, { label: 'R$ 500–1.000', value: '500-1000' }, { label: 'R$ 1.000–2.000', value: '1000-2000' }, { label: 'Acima de R$ 2.000', value: 'above-2000' },
]

function toggleArray(arr: string[], value: string) {
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
}

async function onSubmit() {
  isLoading.value = true
  try {
    await $fetch(`/api/admin/customers/${id}/assessment`, { method: 'PUT', body: form })
    toast.add({ title: 'Avaliação atualizada', color: 'success' })
    await navigateTo(`/admin/customers/${id}/assessment`)
  } catch {
    toast.add({ title: 'Erro ao salvar', color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div style="max-width: 720px;">
    <!-- Header -->
    <div style="margin-bottom: 1.5rem;">
      <NuxtLink :to="`/admin/customers/${id}/assessment`" style="font-size: 0.8rem; color: var(--ui-text-muted); text-decoration: none;">&larr; Voltar</NuxtLink>
      <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text); margin-top: 0.5rem;">Editar Avaliação</h1>
      <span style="font-size: 0.85rem; color: var(--ui-text-muted);">{{ lead?.name }}</span>
    </div>

    <form @submit.prevent="onSubmit">
      <!-- Experiência -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-academic-cap" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Experiência com milhas</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <UFormField label="Participa de programas">
              <USelect v-model="form.hasPrograms" :items="hasProgramsItems" value-key="value" label-key="label" size="lg" />
            </UFormField>

            <UFormField label="Nível de conhecimento">
              <USelect v-model="form.knowledgeLevel" :items="knowledgeItems" value-key="value" label-key="label" size="lg" />
            </UFormField>
          </div>

          <UFormField v-if="form.hasPrograms === 'yes'" label="Programas">
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <UButton
                v-for="(label, i) in programItems"
                :key="programValues[i]"
                :label="label"
                size="sm"
                :color="form.programs.includes(programValues[i]) ? 'primary' : 'neutral'"
                :variant="form.programs.includes(programValues[i]) ? 'solid' : 'outline'"
                @click="toggleArray(form.programs, programValues[i])"
              />
            </div>
          </UFormField>
        </div>
      </UCard>

      <!-- Objetivos -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-globe-alt" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Objetivos e viagens</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <UFormField label="Objetivos">
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <UButton
                v-for="(label, i) in goalItems"
                :key="goalValues[i]"
                :label="label"
                size="sm"
                :color="form.goals.includes(goalValues[i]) ? 'primary' : 'neutral'"
                :variant="form.goals.includes(goalValues[i]) ? 'solid' : 'outline'"
                @click="toggleArray(form.goals, goalValues[i])"
              />
            </div>
          </UFormField>

          <UFormField label="Destino planejado">
            <UTextarea v-model="form.destination" :rows="2" placeholder="Ex: Europa em dezembro..." size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>
        </div>
      </UCard>

      <!-- Financeiro -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-credit-card" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Financeiro</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <UFormField label="Cartões de crédito">
            <UInput v-model="form.creditCards" placeholder="Ex: Nubank, Itaú..." size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <UFormField label="Gastos mensais no cartão">
              <USelect v-model="form.monthlySpending" :items="spendingItems" value-key="value" label-key="label" size="lg" />
            </UFormField>

            <UFormField label="Investimento mensal">
              <USelect v-model="form.monthlyInvestment" :items="investmentItems" value-key="value" label-key="label" size="lg" />
            </UFormField>
          </div>

          <UFormField label="Prazo desejado">
            <USelect v-model="form.timeframe" :items="timeframeItems" value-key="value" label-key="label" size="lg" />
          </UFormField>
        </div>
      </UCard>

      <!-- Expectativas -->
      <UCard style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-chat-bubble-bottom-center-text" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">Expectativas</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <UFormField label="Principal dificuldade">
            <UTextarea v-model="form.mainChallenge" :rows="3" placeholder="Maior dúvida ou desafio com milhas..." size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <UFormField label="Expectativa da mentoria">
            <UTextarea v-model="form.expectations" :rows="3" placeholder="O que seria o resultado ideal?" size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>
        </div>
      </UCard>

      <!-- Actions -->
      <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
        <UButton :to="`/admin/customers/${id}/assessment`" label="Cancelar" color="neutral" variant="ghost" />
        <UButton type="submit" label="Salvar alterações" color="primary" icon="i-heroicons-check" :loading="isLoading" />
      </div>
    </form>
  </div>
</template>
