<script setup lang="ts">
const { user, logout } = useAdminAuth()
const route = useRoute()

const sidebarCollapsed = ref(true)

const navItems = computed(() => [
  [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-chart-bar-square',
      to: '/admin',
      active: route.path === '/admin',
    },
    {
      label: 'Clientes',
      icon: 'i-heroicons-users',
      to: '/admin/customers',
      active: route.path.startsWith('/admin/customers'),
    },
    {
      label: 'Avaliações',
      icon: 'i-heroicons-clipboard-document-check',
      to: '/admin/assessments',
      active: route.path === '/admin/assessments',
    },
    {
      label: 'Encontros',
      icon: 'i-heroicons-video-camera',
      to: '/admin/meetings',
      active: route.path === '/admin/meetings',
    },
    {
      label: 'Configurações',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin/settings',
      active: route.path === '/admin/settings',
    },
  ],
])
</script>

<template>
  <UDashboardGroup class="bg-[var(--ui-bg)]">
    <UDashboardSidebar
      v-model:collapsed="sidebarCollapsed"
      collapsible
      :collapsed-size="4"
      class="bg-[var(--ui-bg-elevated)]"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center" :class="collapsed ? 'justify-center' : ''">
          <img
            src="~/assets/img/logo-fly-up-milhas.webp"
            alt="Fly Up Milhas"
            :style="collapsed ? 'height: 1.5rem; width: auto;' : 'height: 1.75rem; width: auto;'"
          />
        </div>
      </template>

      <UNavigationMenu :items="navItems" orientation="vertical" highlight />

      <template #footer>
        <UDashboardSidebarCollapse />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Fly Up Milhas">
          <template #right>
            <UDropdownMenu
              :items="[
                [{
                  label: 'Sair',
                  icon: 'i-heroicons-arrow-right-on-rectangle',
                  onSelect: logout,
                }],
              ]"
            >
              <UButton color="neutral" variant="ghost" class="rounded-full p-0">
                <UAvatar :text="user?.name?.charAt(0) || 'A'" size="sm" />
              </UButton>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
