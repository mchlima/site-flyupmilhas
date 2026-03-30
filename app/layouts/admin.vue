<script setup lang="ts">
const { user, logout } = useAdminAuth()
const route = useRoute()

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
  <div style="display: flex; min-height: 100vh;">
    <!-- Sidebar -->
    <aside style="width: 240px; background: var(--ui-bg-elevated); border-right: 1px solid var(--ui-border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 30;">
      <!-- Logo -->
      <div style="padding: 1.25rem 1rem; border-bottom: 1px solid var(--ui-border);">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <img
            src="~/assets/img/logo-fly-up-milhas.webp"
            alt="Fly Up Milhas"
            style="height: 1.75rem; width: auto;"
          />
          <UBadge color="primary" variant="subtle" size="xs">Admin</UBadge>
        </div>
      </div>

      <!-- Nav -->
      <div style="flex: 1; padding: 0.5rem;">
        <UNavigationMenu :items="navItems" orientation="vertical" highlight />
      </div>

      <!-- Footer -->
      <div style="padding: 1rem; border-top: 1px solid var(--ui-border); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--ui-text-muted);">
          <UAvatar :text="user?.name?.charAt(0) || 'A'" size="xs" />
          {{ user?.name }}
        </div>
        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="logout"
        />
      </div>
    </aside>

    <!-- Main -->
    <main style="flex: 1; margin-left: 240px; background: var(--ui-bg); min-height: 100vh; padding: 2rem;">
      <slot />
    </main>
  </div>
</template>
