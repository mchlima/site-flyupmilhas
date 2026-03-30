interface AdminUser {
  email: string
  name: string
}

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin-user', () => null)

  async function fetchUser() {
    try {
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined

      user.value = await $fetch<AdminUser>('/api/auth/me', { headers })
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const result = await $fetch<{ user: AdminUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = result.user
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    window.location.href = '/admin/login'
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, fetchUser, login, logout, isAuthenticated }
}
