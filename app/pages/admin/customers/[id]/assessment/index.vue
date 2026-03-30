<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Avaliação — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const route = useRoute()
const id = route.params.id as string

const { data: assessment } = await useFetch(`/api/admin/customers/${id}/assessment`)
const { data: lead } = await useFetch(`/api/admin/customers/${id}`)

const stateLabels = Object.fromEntries(BRAZILIAN_STATES.map(s => [s.value, s.label]))

const valueLabels: Record<string, string> = {
  ...stateLabels,
  yes: 'Sim', no: 'Não',
  none: 'Nenhum conhecimento', basic: 'Básico', moderate: 'Moderado', good: 'Bom', advanced: 'Avançado',
  'travel-cheaper': 'Viajar pagando menos', accumulate: 'Acumular mais milhas', organize: 'Organizar milhas', 'trip-planning': 'Planejamento de viagens', other: 'Outro',
  'up-to-1000': 'Até R$ 1.000', '1001-2500': 'R$ 1.001–2.500', '2501-5000': 'R$ 2.501–5.000', '5001-10000': 'R$ 5.001–10.000', 'above-10000': 'Acima de R$ 10.000', unknown: 'Não sei informar',
  short: 'Curto prazo (0–3 meses)', medium: 'Médio prazo (3–12 meses)', long: 'Longo prazo (12+ meses)',
  'up-to-200': 'Até R$ 200', '200-500': 'R$ 200–500', '500-1000': 'R$ 500–1.000', '1000-2000': 'R$ 1.000–2.000', 'above-2000': 'Acima de R$ 2.000',
  'latam-pass': 'Latam Pass', azul: 'Azul (TudoAzul)', smiles: 'Smiles (GOL)', livelo: 'Livelo', esfera: 'Esfera',
}

function formatValue(val: unknown): string {
  if (Array.isArray(val)) return val.map(v => valueLabels[v] || v).join(', ') || '—'
  if (typeof val === 'string') return valueLabels[val] || val || '—'
  return '—'
}

function formatValueAsBadges(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(v => valueLabels[v] || v)
  return []
}

interface Field {
  key: string
  label: string
  type?: 'badges' | 'long'
}

interface Section {
  title: string
  icon: string
  fields: Field[]
}

const sections: Section[] = [
  {
    title: 'Experiência com milhas',
    icon: 'i-heroicons-academic-cap',
    fields: [
      { key: 'hasPrograms', label: 'Participa de programas' },
      { key: 'programs', label: 'Programas', type: 'badges' },
      { key: 'knowledgeLevel', label: 'Nível de conhecimento' },
    ],
  },
  {
    title: 'Objetivos e viagens',
    icon: 'i-heroicons-globe-alt',
    fields: [
      { key: 'goals', label: 'Objetivos', type: 'badges' },
      { key: 'destination', label: 'Destino planejado', type: 'long' },
    ],
  },
  {
    title: 'Financeiro',
    icon: 'i-heroicons-credit-card',
    fields: [
      { key: 'creditCards', label: 'Cartões de crédito' },
      { key: 'monthlySpending', label: 'Gastos mensais no cartão' },
      { key: 'monthlyInvestment', label: 'Investimento mensal' },
      { key: 'timeframe', label: 'Prazo desejado' },
    ],
  },
  {
    title: 'Expectativas',
    icon: 'i-heroicons-chat-bubble-bottom-center-text',
    fields: [
      { key: 'mainChallenge', label: 'Principal dificuldade', type: 'long' },
      { key: 'expectations', label: 'Expectativa da mentoria', type: 'long' },
    ],
  },
]
</script>

<template>
  <div style="max-width: 720px;">
    <!-- Header -->
    <div style="margin-bottom: 1.5rem;">
      <NuxtLink :to="`/admin/customers/${id}`" style="font-size: 0.8rem; color: var(--ui-text-muted); text-decoration: none;">&larr; Voltar ao cliente</NuxtLink>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; flex-wrap: wrap; gap: 0.75rem;">
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text);">Avaliação — {{ lead?.name || '' }}</h1>
        <UButton :to="`/admin/customers/${id}/assessment/edit`" label="Editar" color="neutral" variant="outline" icon="i-heroicons-pencil-square" />
      </div>
    </div>

    <template v-if="assessment">
      <UCard v-for="section in sections" :key="section.title" style="margin-bottom: 1rem;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon :name="section.icon" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.875rem;">{{ section.title }}</span>
          </div>
        </template>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div v-for="field in section.fields" :key="field.key">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.375rem;">
              {{ field.label }}
            </div>

            <!-- Badges -->
            <template v-if="field.type === 'badges'">
              <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                <UBadge
                  v-for="item in formatValueAsBadges((assessment as Record<string, unknown>)[field.key])"
                  :key="item"
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  {{ item }}
                </UBadge>
                <span
                  v-if="!((assessment as Record<string, unknown>)[field.key] as string[])?.length"
                  style="color: var(--ui-text-muted); font-size: 0.875rem;"
                >—</span>
              </div>
            </template>

            <!-- Long text -->
            <template v-else-if="field.type === 'long'">
              <div style="font-size: 0.875rem; line-height: 1.6; color: var(--ui-text); white-space: pre-wrap; padding: 0.75rem; background: var(--ui-bg-elevated); border-radius: 0.375rem;">
                {{ formatValue((assessment as Record<string, unknown>)[field.key]) }}
              </div>
            </template>

            <!-- Default -->
            <template v-else>
              <div style="font-size: 0.9rem; font-weight: 500; color: var(--ui-text);">
                {{ formatValue((assessment as Record<string, unknown>)[field.key]) }}
              </div>
            </template>
          </div>
        </div>
      </UCard>
    </template>

    <UCard v-else style="text-align: center;">
      <div style="padding: 2rem;">
        <UIcon name="i-heroicons-document-magnifying-glass" style="width: 2.5rem; height: 2.5rem; color: var(--ui-text-muted); margin-bottom: 0.75rem;" />
        <p style="color: var(--ui-text-muted); font-size: 0.9rem;">Avaliação não encontrada</p>
      </div>
    </UCard>
  </div>
</template>
