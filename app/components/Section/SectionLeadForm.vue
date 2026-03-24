<script setup lang="ts">
import { LeadFormSchema, useLeadForm } from '~/composables/useLeadForm'

// WhatsApp CTA URL — TODO: Replace 55XXXXXXXXXXX with real WhatsApp number before launch
const WHATSAPP_URL = 'https://wa.me/55XXXXXXXXXXX?text=Ola%2C%20quero%20saber%20mais%20sobre%20a%20mentoria%20Fly%20Up%20Milhas.'

const { isLoading, isSuccess, error, submit } = useLeadForm()

// Form reactive state — matches LeadFormData shape (nome, email, whatsapp, website)
const state = reactive({
  nome: '',
  email: '',
  whatsapp: '', // raw digits only — validated by Zod regex /^\d{10,11}$/
  website: '', // honeypot — empty for humans, bots fill it
})

// Separate display value for masked WhatsApp input
const whatsappDisplay = ref('')

function onWhatsappInput(event: Event) {
  const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
  let formatted = digits
  if (digits.length > 10) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  else if (digits.length > 6) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  else if (digits.length > 2) {
    formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  whatsappDisplay.value = formatted
  state.whatsapp = digits // raw digits for Zod validation and submission
}

async function onSubmit() {
  await submit({
    nome: state.nome,
    email: state.email,
    whatsapp: state.whatsapp,
    website: state.website,
  })
}
</script>

<template>
  <div class="max-w-xl mx-auto py-4">
      <!-- Section heading (D-02) -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">
          Comece sua mentoria agora
        </h2>
        <p class="text-white/80">
          Preencha o formulário e entraremos em contato em até 24h pelo WhatsApp.
        </p>
      </div>

      <!-- SUCCESS STATE -->
      <div v-if="isSuccess" class="text-center py-8">
        <UIcon
          name="i-heroicons-check-circle"
          class="w-16 h-16 text-green-400 mx-auto mb-4"
        />
        <p class="text-xl font-semibold text-white mb-2">
          Recebemos! Entraremos em contato pelo WhatsApp para agendar seu primeiro encontro.
        </p>
        <p class="text-white/80 mb-6">
          Fique de olho no WhatsApp — ou fale agora mesmo:
        </p>
        <!-- WhatsApp CTA in success state -->
        <a
          :href="WHATSAPP_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Falar no WhatsApp
        </a>
      </div>

      <!-- FORM STATE -->
      <div v-else>
        <!-- Error banner — shown when composable error is set -->
        <div
          v-if="error"
          class="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- UForm uses LeadFormSchema for blur + submit validation -->
        <UForm :schema="LeadFormSchema" :state="state" class="space-y-6" @submit="onSubmit">

          <!-- Nome (field 1) -->
          <UFormField name="nome">
            <template #label>
              <span class="text-white">Seu nome</span>
            </template>
            <UInput
              v-model="state.nome"
              placeholder="Seu nome completo"
              autocomplete="name"
              class="w-full bg-white"
              :ui="{ base: 'bg-white border border-gray-300' }"
            />
          </UFormField>

          <!-- E-mail (field 2) -->
          <UFormField name="email">
            <template #label>
              <span class="text-white">E-mail</span>
            </template>
            <UInput
              v-model="state.email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="email"
              class="w-full bg-white"
              :ui="{ base: 'bg-white border border-gray-300' }"
            />
          </UFormField>

          <!-- WhatsApp with phone mask (field 3) — inputmode="numeric" for mobile keyboard -->
          <UFormField name="whatsapp">
            <template #label>
              <span class="text-white">WhatsApp</span>
            </template>
            <UInput
              :model-value="whatsappDisplay"
              inputmode="numeric"
              placeholder="(11) 99999-9999"
              autocomplete="tel"
              class="w-full bg-white"
              :ui="{ base: 'bg-white border border-gray-300' }"
              @input="onWhatsappInput"
            />
          </UFormField>

          <!-- Honeypot — display:none hides from humans; bots fill it -->
          <div style="display: none;" aria-hidden="true">
            <label for="website">Website</label>
            <input
              id="website"
              v-model="state.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <!-- Submit button — plain button to avoid UButton internal styling conflicts (D-07) -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold rounded-lg text-base text-center flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Quero comecar minha mentoria</span>
          </button>
        </UForm>

        <!-- Security badge — outside UForm per D-03/D-05 -->
        <div class="flex items-center justify-center gap-2 mt-4 text-white/60 text-sm">
          <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
          <span>Seus dados estao seguros</span>
        </div>

        <!-- WhatsApp CTA below form -->
        <div class="mt-4">
          <a
            :href="WHATSAPP_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
  </div>
</template>
