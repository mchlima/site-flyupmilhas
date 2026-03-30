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
  <div class="login-page">
    <div class="login-card">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          style="height: 2.5rem; width: auto; margin: 0 auto 1rem;"
        />
        <h1 style="font-size: 1.25rem; font-weight: 700; color: #0F172A;">Área Administrativa</h1>
      </div>

      <div
        v-if="error"
        style="margin-bottom: 1rem; padding: 0.75rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; color: #dc2626; font-size: 0.875rem; text-align: center;"
        role="alert"
      >
        {{ error }}
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <div class="login-field">
          <label class="login-label" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="login-input"
            placeholder="seu@email.com"
          />
        </div>

        <div class="login-field">
          <label class="login-label" for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="login-input"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" :disabled="isLoading" class="login-btn">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 24rem;
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.login-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.login-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: white;
  outline: none;
  transition: border-color 0.15s ease;
}

.login-input:focus {
  border-color: #1D4ED8;
  box-shadow: 0 0 0 2px rgba(29,78,216,0.15);
}

.login-btn {
  width: 100%;
  padding: 0.625rem;
  background: #1D4ED8;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.login-btn:hover { background: #1e40af; }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
