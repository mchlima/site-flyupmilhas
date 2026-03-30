<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Avaliações — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const search = ref('')
const page = ref(1)

const queryParams = computed(() => ({
  page: page.value,
  limit: 20,
  ...(search.value && { search: search.value }),
}))

const { data } = await useFetch('/api/admin/assessments', {
  query: queryParams,
  watch: [queryParams],
})

const knowledgeLabels: Record<string, string> = {
  none: 'Nenhum', basic: 'Básico', moderate: 'Moderado', good: 'Bom', advanced: 'Avançado',
}

const spendingLabels: Record<string, string> = {
  'up-to-1000': 'Até R$ 1k', '1001-2500': 'R$ 1k–2,5k', '2501-5000': 'R$ 2,5k–5k',
  '5001-10000': 'R$ 5k–10k', 'above-10000': 'Acima de R$ 10k', unknown: 'Não informado',
}

const timeframeLabels: Record<string, string> = {
  short: 'Curto', medium: 'Médio', long: 'Longo',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

let searchTimeout: ReturnType<typeof setTimeout>
function onSearch(val: string) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    search.value = val
    page.value = 1
  }, 400)
}

const columns = [
  { id: 'customerName', accessorKey: 'customerName', header: 'Cliente' },
  { id: 'knowledgeLevel', accessorKey: 'knowledgeLevel', header: 'Nível' },
  { id: 'monthlySpending', accessorKey: 'monthlySpending', header: 'Gastos' },
  { id: 'timeframe', accessorKey: 'timeframe', header: 'Prazo' },
  { id: 'createdAt', accessorKey: 'createdAt', header: 'Data' },
  { id: 'actions', header: '' },
]
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text);">Avaliações</h1>
        <p style="font-size: 0.875rem; color: var(--ui-text-muted);">{{ data?.total || 0 }} avaliações</p>
      </div>
    </div>

    <UCard :ui="{ body: 'p-0' }">
      <div style="padding: 0.75rem; border-bottom: 1px solid var(--ui-border);">
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Buscar por nome, email ou telefone do cliente..."
          :model-value="search"
          @update:model-value="onSearch($event as string)"
        />
      </div>

      <UTable :columns="columns" :data="data?.assessments || []">
        <template #customerName-cell="{ row }">
          <NuxtLink :to="`/admin/customers/${row.original.customerId}`" style="text-decoration: none;">
            <div style="font-weight: 500; color: var(--ui-text);">{{ row.original.customerName }}</div>
            <div style="font-size: 0.7rem; color: var(--ui-text-muted);">{{ row.original.customerEmail }}</div>
          </NuxtLink>
        </template>

        <template #knowledgeLevel-cell="{ row }">
          <UBadge color="info" variant="subtle" size="xs">{{ knowledgeLabels[row.original.knowledgeLevel] || row.original.knowledgeLevel }}</UBadge>
        </template>

        <template #monthlySpending-cell="{ row }">
          <span style="font-size: 0.8rem; color: var(--ui-text-muted);">{{ spendingLabels[row.original.monthlySpending] || row.original.monthlySpending }}</span>
        </template>

        <template #timeframe-cell="{ row }">
          <span style="font-size: 0.8rem; color: var(--ui-text-muted);">{{ timeframeLabels[row.original.timeframe] || row.original.timeframe }}</span>
        </template>

        <template #createdAt-cell="{ row }">
          <span style="font-size: 0.8rem; color: var(--ui-text-muted);">{{ formatDate(row.original.createdAt) }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div style="display: flex; gap: 0.25rem;">
            <UButton
              :to="`/admin/customers/${row.original.customerId}/assessment`"
              icon="i-heroicons-eye"
              color="neutral"
              variant="ghost"
              size="xs"
            />
            <UButton
              :to="`/admin/customers/${row.original.customerId}`"
              icon="i-heroicons-chevron-right"
              color="neutral"
              variant="ghost"
              size="xs"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <div v-if="data && data.totalPages > 1" style="display: flex; justify-content: center; margin-top: 1rem;">
      <UPagination
        v-model="page"
        :total="data.total"
        :items-per-page="20"
      />
    </div>
  </div>
</template>
