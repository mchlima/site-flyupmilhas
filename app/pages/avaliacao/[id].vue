<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Avaliação Inicial — Fly Up Milhas',
  description: 'Preencha a avaliação inicial para personalizarmos sua mentoria de milhas.',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const customerId = route.params.id as string

// Fetch lead data
const { data: lead, error: fetchError } = await useFetch(`/api/customers/${customerId}`)

const AssessmentFormSchema = z.object({
  birthDate: z.string().min(10, 'Informe sua data de nascimento'),
  state: z.string().min(2, 'Informe seu estado'),
  city: z.string().optional(),
  hasPrograms: z.enum(['yes', 'no'], { required_error: 'Selecione uma opção' }),
  programs: z.array(z.string()).optional(),
  knowledgeLevel: z.enum(['none', 'basic', 'moderate', 'good', 'advanced'], { required_error: 'Selecione seu nível' }),
  goals: z.array(z.string()).min(1, 'Selecione ao menos um objetivo'),
  destination: z.string().optional(),
  creditCards: z.string().optional(),
  monthlySpending: z.enum(['up-to-1000', '1001-2500', '2501-5000', '5001-10000', 'above-10000', 'unknown'], { required_error: 'Selecione uma faixa' }),
  timeframe: z.enum(['short', 'medium', 'long'], { required_error: 'Selecione um prazo' }),
  monthlyInvestment: z.enum(['up-to-200', '200-500', '500-1000', '1000-2000', 'above-2000'], { required_error: 'Selecione uma faixa' }),
  mainChallenge: z.string().optional(),
  expectations: z.string().optional(),
})

const state = reactive({
  birthDate: '',
  state: '',
  city: '',
  hasPrograms: '' as 'yes' | 'no' | '',
  programs: [] as string[],
  knowledgeLevel: '' as string,
  goals: [] as string[],
  destination: '',
  creditCards: '',
  monthlySpending: '' as string,
  timeframe: '' as string,
  monthlyInvestment: '' as string,
  mainChallenge: '',
  expectations: '',
})

const isLoading = ref(false)
const isSuccess = ref(false)
const submitError = ref<string | null>(null)

const programOptions = [
  { label: 'Latam Pass', value: 'latam-pass' },
  { label: 'Azul (TudoAzul)', value: 'azul' },
  { label: 'Smiles (GOL)', value: 'smiles' },
  { label: 'Livelo', value: 'livelo' },
  { label: 'Esfera', value: 'esfera' },
  { label: 'Outro', value: 'other' },
]

const knowledgeLevelOptions = [
  { label: 'Nenhum conhecimento', value: 'none' },
  { label: 'Conheço o básico', value: 'basic' },
  { label: 'Conheço moderadamente', value: 'moderate' },
  { label: 'Conheço bem', value: 'good' },
  { label: 'Sou avançado', value: 'advanced' },
]

const goalOptions = [
  { label: 'Viajar pagando menos', value: 'travel-cheaper' },
  { label: 'Aprender a acumular mais milhas', value: 'accumulate' },
  { label: 'Organizar e não perder milhas', value: 'organize' },
  { label: 'Montar planejamento para viagens específicas', value: 'trip-planning' },
  { label: 'Outro', value: 'other' },
]

const spendingOptions = [
  { label: 'Até R$ 1.000', value: 'up-to-1000' },
  { label: 'R$ 1.001 – R$ 2.500', value: '1001-2500' },
  { label: 'R$ 2.501 – R$ 5.000', value: '2501-5000' },
  { label: 'R$ 5.001 – R$ 10.000', value: '5001-10000' },
  { label: 'Acima de R$ 10.000', value: 'above-10000' },
  { label: 'Não sei informar', value: 'unknown' },
]

const timeframeOptions = [
  { label: 'Curto prazo (0–3 meses)', value: 'short' },
  { label: 'Médio prazo (3–12 meses)', value: 'medium' },
  { label: 'Longo prazo (acima de 12 meses)', value: 'long' },
]

const investmentOptions = [
  { label: 'Até R$ 200', value: 'up-to-200' },
  { label: 'R$ 200 – R$ 500', value: '200-500' },
  { label: 'R$ 500 – R$ 1.000', value: '500-1000' },
  { label: 'R$ 1.000 – R$ 2.000', value: '1000-2000' },
  { label: 'Acima de R$ 2.000', value: 'above-2000' },
]

const stateRef = computed(() => state.state)
const { cities, loading: citiesLoading } = useBrazilianCities(stateRef)

// Reset city when state changes
watch(() => state.state, () => {
  state.city = ''
})

function toggleCheckbox(arr: string[], value: string) {
  const idx = arr.indexOf(value)
  if (idx === -1) arr.push(value)
  else arr.splice(idx, 1)
}

async function onSubmit() {
  isLoading.value = true
  submitError.value = null

  try {
    await $fetch('/api/assessments', {
      method: 'POST',
      body: {
        customerId,
        ...state,
      },
    })
    isSuccess.value = true
  } catch {
    submitError.value = 'Erro ao enviar. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="avaliacao-page">
    <div class="avaliacao-container">
      <!-- Header -->
      <div class="avaliacao-header">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          width="120"
          height="40"
          style="height: 2.5rem; width: auto; margin-bottom: 1rem;"
        />
        <h1 class="avaliacao-title">Avaliação Inicial</h1>
        <p class="avaliacao-subtitle">
          Leva menos de 3 minutos. Suas respostas nos ajudam a personalizar sua mentoria.
        </p>
      </div>

      <!-- Error: lead not found -->
      <div v-if="fetchError" class="avaliacao-error">
        <UIcon name="i-heroicons-exclamation-triangle" style="width: 3rem; height: 3rem; color: #f87171; margin-bottom: 1rem;" />
        <p style="font-size: 1.125rem; font-weight: 600; color: white; margin-bottom: 0.5rem;">Link inválido ou expirado</p>
        <p style="color: rgba(255,255,255,0.7);">Verifique o link recebido ou entre em contato pelo WhatsApp.</p>
      </div>

      <!-- Already submitted or just submitted -->
      <div v-else-if="isSuccess || lead?.hasAssessment" class="avaliacao-success">
        <UIcon name="i-heroicons-check-circle" style="width: 4rem; height: 4rem; color: #4ade80; margin-bottom: 1rem;" />
        <p style="font-size: 1.25rem; font-weight: 700; color: white; margin-bottom: 0.5rem;">
          {{ isSuccess ? 'Avaliação enviada!' : 'Avaliação já preenchida' }}
        </p>
        <p style="color: rgba(255,255,255,0.8);">
          {{ isSuccess
            ? `Obrigado, ${lead?.name?.split(' ')[0]}! Vamos analisar suas respostas e entrar em contato para agendar sua mentoria.`
            : `${lead?.name?.split(' ')[0]}, você já preencheu esta avaliação. Entraremos em contato em breve.`
          }}
        </p>
      </div>

      <!-- Form -->
      <div v-else-if="lead">
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem;">
          Olá, <strong style="color: white;">{{ lead.name }}</strong>! Preencha abaixo para começarmos.
        </p>

        <div
          v-if="submitError"
          style="margin-bottom: 1rem; padding: 1rem; background: rgba(239,68,68,0.2); border: 1px solid rgba(248,113,113,0.3); border-radius: 0.5rem; color: #fca5a5; font-size: 0.875rem;"
          role="alert"
        >
          {{ submitError }}
        </div>

        <UForm :schema="AssessmentFormSchema" :state="state" class="avaliacao-form" @submit.prevent="onSubmit">

          <!-- Data de nascimento -->
          <UFormField name="birthDate">
            <template #label><span class="field-label">Data de nascimento</span></template>
            <UInput v-model="state.birthDate" type="date" class="w-full" :ui="{ root: 'bg-white rounded-lg', base: 'bg-white text-brand-text placeholder-gray-400 rounded-lg border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand-primary py-3 px-4' }" />
          </UFormField>

          <!-- Estado -->
          <UFormField name="state">
            <template #label><span class="field-label">Estado</span></template>
            <UInputMenu
              v-model="state.state"
              :items="BRAZILIAN_STATES"
              value-key="value"
              label-key="label"
              placeholder="Digite ou selecione seu estado"
              class="w-full"
              :ui="{ root: 'bg-white rounded-lg', base: 'bg-white text-brand-text placeholder-gray-400 rounded-lg border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand-primary py-3 px-4' }"
            />
          </UFormField>

          <!-- Cidade -->
          <UFormField v-if="state.state" name="city">
            <template #label><span class="field-label">Cidade</span></template>
            <UInputMenu
              v-model="state.city"
              :items="cities"
              :loading="citiesLoading"
              placeholder="Digite ou selecione sua cidade"
              class="w-full"
              :ui="{ root: 'bg-white rounded-lg', base: 'bg-white text-brand-text placeholder-gray-400 rounded-lg border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand-primary py-3 px-4' }"
            />
          </UFormField>

          <!-- Participa de programas -->
          <UFormField name="hasPrograms">
            <template #label><span class="field-label">Você já participou ou participa de algum programa de milhas?</span></template>
            <div class="radio-group">
              <label class="radio-option">
                <input v-model="state.hasPrograms" type="radio" value="yes" class="radio-input" />
                <span>Sim</span>
              </label>
              <label class="radio-option">
                <input v-model="state.hasPrograms" type="radio" value="no" class="radio-input" />
                <span>Não</span>
              </label>
            </div>
          </UFormField>

          <!-- Programas (shown if hasPrograms = yes) -->
          <div v-if="state.hasPrograms === 'yes'" class="form-field">
            <span class="field-label">Em quais programas você já possui conta?</span>
            <div class="checkbox-group">
              <label v-for="opt in programOptions" :key="opt.value" class="checkbox-option">
                <input type="checkbox" :checked="state.programs.includes(opt.value)" class="checkbox-input" @change="toggleCheckbox(state.programs, opt.value)" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </div>

          <!-- Nível de conhecimento -->
          <UFormField name="knowledgeLevel">
            <template #label><span class="field-label">Como você avaliaria o seu nível de conhecimento sobre milhas?</span></template>
            <div class="radio-group">
              <label v-for="opt in knowledgeLevelOptions" :key="opt.value" class="radio-option">
                <input v-model="state.knowledgeLevel" type="radio" :value="opt.value" class="radio-input" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <!-- Objetivos -->
          <UFormField name="goals">
            <template #label><span class="field-label">Qual é o seu principal objetivo com milhas?</span></template>
            <div class="checkbox-group">
              <label v-for="opt in goalOptions" :key="opt.value" class="checkbox-option">
                <input type="checkbox" :checked="state.goals.includes(opt.value)" class="checkbox-input" @change="toggleCheckbox(state.goals, opt.value)" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <!-- Destino -->
          <div class="form-field">
            <span class="field-label">Você tem algum destino ou planeja alguma viagem para os próximos 6 a 12 meses?</span>
            <textarea v-model="state.destination" class="textarea-field" rows="3" placeholder="Ex: Quero ir para a Europa em dezembro..." />
          </div>

          <!-- Cartões de crédito -->
          <div class="form-field">
            <span class="field-label">Quais cartões de crédito você usa atualmente?</span>
            <UInput v-model="state.creditCards" placeholder="Ex: Nubank, Itaú Personnalité..." class="w-full" :ui="{ root: 'bg-white rounded-lg', base: 'bg-white text-brand-text placeholder-gray-400 rounded-lg border-0 ring-1 ring-gray-300 focus:ring-2 focus:ring-brand-primary py-3 px-4' }" />
          </div>

          <!-- Média de gastos -->
          <UFormField name="monthlySpending">
            <template #label><span class="field-label">Qual é a média de gastos no seu cartão principal hoje?</span></template>
            <div class="radio-group">
              <label v-for="opt in spendingOptions" :key="opt.value" class="radio-option">
                <input v-model="state.monthlySpending" type="radio" :value="opt.value" class="radio-input" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <!-- Prazo -->
          <UFormField name="timeframe">
            <template #label><span class="field-label">Em quanto tempo você gostaria de atingir resultados com milhas?</span></template>
            <div class="radio-group">
              <label v-for="opt in timeframeOptions" :key="opt.value" class="radio-option">
                <input v-model="state.timeframe" type="radio" :value="opt.value" class="radio-input" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <!-- Investimento mensal -->
          <UFormField name="monthlyInvestment">
            <template #label><span class="field-label">Quanto você estaria disposto a investir mensalmente?</span></template>
            <div class="radio-group">
              <label v-for="opt in investmentOptions" :key="opt.value" class="radio-option">
                <input v-model="state.monthlyInvestment" type="radio" :value="opt.value" class="radio-input" />
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </UFormField>

          <!-- Principal dificuldade -->
          <div class="form-field">
            <span class="field-label">Qual é a sua principal dificuldade quando o assunto é milhas?</span>
            <textarea v-model="state.mainChallenge" class="textarea-field" rows="3" placeholder="Conte-nos sua maior dúvida ou desafio..." />
          </div>

          <!-- Expectativa -->
          <div class="form-field">
            <span class="field-label">O que você espera da mentoria Fly Up Milhas?</span>
            <textarea v-model="state.expectations" class="textarea-field" rows="3" placeholder="O que seria o resultado ideal para você?" />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isLoading"
            class="submit-btn"
          >
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Enviar avaliação</span>
          </button>
        </UForm>

        <!-- LGPD notice -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1rem; color: rgba(255,255,255,0.6); font-size: 0.8rem;">
          <UIcon name="i-heroicons-lock-closed" style="width: 0.875rem; height: 0.875rem;" />
          <span>Seus dados estão protegidos conforme a LGPD</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.avaliacao-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
  padding: 2rem 1rem;
}

.avaliacao-container {
  max-width: 40rem;
  margin: 0 auto;
}

.avaliacao-header {
  text-align: center;
  margin-bottom: 2rem;
}

.avaliacao-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
}

.avaliacao-subtitle {
  color: rgba(255,255,255,0.7);
  font-size: 0.95rem;
}

.avaliacao-error,
.avaliacao-success {
  text-align: center;
  padding: 3rem 1.5rem;
}

.avaliacao-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.5rem;
  color: rgba(255,255,255,0.9);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.radio-option:hover,
.checkbox-option:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
}

.radio-input,
.checkbox-input {
  accent-color: var(--color-brand-cta);
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.textarea-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  color: #1a1a1a;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  box-shadow: 0 0 0 1px #d1d5db;
  font-family: inherit;
}

.textarea-field:focus {
  box-shadow: 0 0 0 2px var(--color-brand-primary);
}

.textarea-field::placeholder {
  color: #9ca3af;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-brand-cta);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: var(--color-brand-cta-hover);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
