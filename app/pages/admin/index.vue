<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Dashboard — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const { data: stats } = await useFetch('/api/admin/stats')

const statCards = computed(() => [
  { label: 'Total de clientes', value: stats.value?.totalCustomers || 0, icon: 'i-heroicons-users', color: 'primary' as const },
  { label: 'Esta semana', value: stats.value?.customersThisWeek || 0, icon: 'i-heroicons-calendar', color: 'info' as const },
  { label: 'Avaliações', value: stats.value?.totalAssessments || 0, icon: 'i-heroicons-clipboard-document-check', color: 'warning' as const },
  { label: 'Pagamentos', value: stats.value?.totalPaid || 0, icon: 'i-heroicons-credit-card', color: 'success' as const },
  { label: 'Receita', value: `R$ ${((stats.value?.totalRevenue || 0) / 100).toFixed(2)}`, icon: 'i-heroicons-banknotes', color: 'success' as const },
])

const statusRows = computed(() => {
  const counts = stats.value?.statusCounts || {}
  return CUSTOMER_STATUSES.map(s => ({
    ...s,
    count: counts[s.value] || 0,
  }))
})
</script>

<template>
  <div>
    <div style="margin-bottom: 0.5rem;">
      <h1 style="font-size: 1.5rem; font-weight: 700; color: #0F172A;">Dashboard</h1>
      <p style="font-size: 0.875rem; color: #64748b;">Visão geral dos clientes e mentorias</p>
    </div>

    <div class="dash-grid">
      <UCard v-for="card in statCards" :key="card.label">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <UIcon :name="card.icon" style="width: 1.5rem; height: 1.5rem; opacity: 0.6;" />
          <div>
            <div style="font-size: 0.75rem; color: var(--ui-text-muted);">{{ card.label }}</div>
            <div style="font-size: 1.75rem; font-weight: 800; line-height: 1.2;">{{ card.value }}</div>
          </div>
        </div>
      </UCard>
    </div>

    <UCard style="margin-top: 1.5rem;">
      <template #header>
        <span style="font-weight: 600;">Clientes por status</span>
      </template>

      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div
          v-for="row in statusRows"
          :key="row.value"
          style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;"
        >
          <UBadge :color="row.color" variant="subtle" size="sm">{{ row.label }}</UBadge>
          <span style="font-weight: 700; font-size: 0.9rem;">{{ row.count }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style>
.dash-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
