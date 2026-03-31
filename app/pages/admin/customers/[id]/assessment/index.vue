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
  <div class="max-w-3xl">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink :to="`/admin/customers/${id}`" class="text-[0.8rem] text-[var(--ui-text-muted)] no-underline">&larr; Voltar ao cliente</NuxtLink>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
        <h1 class="text-2xl font-bold text-[var(--ui-text)]">Avaliação — {{ lead?.name || '' }}</h1>
        <UButton :to="`/admin/customers/${id}/assessment/edit`" label="Editar" color="neutral" variant="outline" icon="i-heroicons-pencil-square" />
      </div>
    </div>

    <template v-if="assessment">
      <UCard v-for="section in sections" :key="section.title" class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon :name="section.icon" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-sm">{{ section.title }}</span>
          </div>
        </template>

        <div class="flex flex-col gap-5">
          <div v-for="field in section.fields" :key="field.key">
            <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1.5">
              {{ field.label }}
            </div>

            <!-- Badges -->
            <template v-if="field.type === 'badges'">
              <div class="flex flex-wrap gap-1.5">
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
                  class="text-[var(--ui-text-muted)] text-sm"
                >—</span>
              </div>
            </template>

            <!-- Long text -->
            <template v-else-if="field.type === 'long'">
              <div class="text-sm leading-relaxed text-[var(--ui-text)] whitespace-pre-wrap p-3 bg-[var(--ui-bg-elevated)] rounded-md">
                {{ formatValue((assessment as Record<string, unknown>)[field.key]) }}
              </div>
            </template>

            <!-- Default -->
            <template v-else>
              <div class="text-[0.9rem] font-medium text-[var(--ui-text)]">
                {{ formatValue((assessment as Record<string, unknown>)[field.key]) }}
              </div>
            </template>
          </div>
        </div>
      </UCard>
    </template>

    <UCard v-else class="text-center">
      <div class="py-8">
        <UIcon name="i-heroicons-document-magnifying-glass" class="size-10 text-[var(--ui-text-muted)] mb-3" />
        <p class="text-[var(--ui-text-muted)] text-[0.9rem]">Avaliação não encontrada</p>
      </div>
    </UCard>
  </div>
</template>
