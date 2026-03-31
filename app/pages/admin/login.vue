<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({ title: 'Login — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const { login } = useAdminAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function onSubmit() {
  isLoading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  } catch {
    error.value = 'Email ou senha incorretos'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-svh flex items-center justify-center bg-[var(--ui-bg)] px-4 py-8">
    <div class="w-full max-w-sm">
      <!-- Logo + Title -->
      <div class="text-center mb-8">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          class="h-10 w-auto mx-auto mb-4"
        />
        <h1 class="text-xl font-bold text-[var(--ui-text)]">Área Administrativa</h1>
        <p class="text-sm text-[var(--ui-text-muted)] mt-1">Faça login para continuar</p>
      </div>

      <UCard>
        <!-- Error -->
        <div
          v-if="error"
          class="mb-4 p-3 bg-[var(--ui-color-error-50)] border border-[var(--ui-color-error-200)] rounded-lg text-[var(--ui-color-error-500)] text-sm text-center"
          role="alert"
        >
          {{ error }}
        </div>

        <form class="flex flex-col gap-5" @submit.prevent="onSubmit">
          <UFormField label="Email">
            <UInput
              v-model="email"
              type="email"
              required
              autocomplete="email"
              placeholder="seu@email.com"
              icon="i-heroicons-envelope"
              size="lg"
              :ui="{ root: 'w-full' }"
            />
          </UFormField>

          <UFormField label="Senha">
            <UInput
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              icon="i-heroicons-lock-closed"
              size="lg"
              :ui="{ root: 'w-full' }"
            />
          </UFormField>

          <UButton
            type="submit"
            label="Entrar"
            color="primary"
            size="lg"
            block
            :loading="isLoading"
            icon="i-heroicons-arrow-right-on-rectangle"
          />
        </form>
      </UCard>

      <p class="text-center text-xs text-[var(--ui-text-muted)] mt-6">
        Fly Up Milhas &copy; {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>
