<script setup lang="ts">
import { loadStripe, type Stripe, type StripeCardElement } from '@stripe/stripe-js'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Pagamento — Fly Up Milhas',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const customerId = route.params.id as string
const config = useRuntimeConfig()

const { data: lead, error: fetchError } = await useFetch(`/api/customers/${customerId}`)
const { data: invoiceData, refresh: refreshInvoices } = await useFetch(`/api/payments/${customerId}`)

const isLoading = ref(false)
const error = ref('')
const step = ref<'list' | 'card-form' | 'success'>('list')
const currentInvoiceId = ref('')
const currentInvoiceAmount = ref(0)
const currentInvoiceDesc = ref('')

let stripe: Stripe | null = null
let cardElement: StripeCardElement | null = null
const clientSecret = ref('')

onMounted(async () => {
  stripe = await loadStripe(config.public.stripePublishableKey)
})

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

async function payInvoice(inv: { _id: string, description: string, amount: number }) {
  currentInvoiceId.value = inv._id
  currentInvoiceAmount.value = inv.amount
  currentInvoiceDesc.value = inv.description
  isLoading.value = true
  error.value = ''

  try {
    const result = await $fetch<{ clientSecret: string }>('/api/payments/create-intent', {
      method: 'POST',
      body: { invoiceId: inv._id },
    })
    clientSecret.value = result.clientSecret
    step.value = 'card-form'
    await nextTick()
    mountCardElement()
  } catch (e: any) {
    if (e?.status === 409) {
      await refreshInvoices()
    } else {
      error.value = 'Erro ao iniciar pagamento. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}

function mountCardElement() {
  if (!stripe || !clientSecret.value) return

  const elements = stripe.elements({
    clientSecret: clientSecret.value,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#0E7490',
        colorBackground: 'rgba(255,255,255,0.08)',
        colorText: '#ffffff',
        colorTextPlaceholder: 'rgba(255,255,255,0.4)',
        borderRadius: '0.5rem',
        fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
      },
      rules: {
        '.Input': { border: '1px solid rgba(255,255,255,0.15)', padding: '12px' },
        '.Input:focus': { border: '1px solid #0E7490', boxShadow: '0 0 0 1px #0E7490' },
      },
    },
  })

  cardElement = elements.create('card', {
    hidePostalCode: true,
    style: { base: { fontSize: '16px' } },
  }) as unknown as StripeCardElement
  cardElement.mount('#card-element')
}

async function confirmCard() {
  if (!stripe || !cardElement) return

  isLoading.value = true
  error.value = ''

  const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret.value, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: lead.value?.name || '',
        email: lead.value?.email || '',
      },
    },
  })

  if (stripeError) {
    error.value = stripeError.message || 'Erro no pagamento. Verifique os dados do cartão.'
    isLoading.value = false
    return
  }

  if (paymentIntent?.status === 'succeeded') {
    step.value = 'success'
  }

  isLoading.value = false
}

function goBack() {
  step.value = 'list'
  error.value = ''
  if (cardElement) {
    cardElement.unmount()
    cardElement = null
  }
}
</script>

<template>
  <div class="pay-page">
    <div class="pay-container">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          style="height: 2.5rem; width: auto; margin: 0 auto;"
        />
      </div>

      <!-- Error: lead not found -->
      <div v-if="fetchError" style="text-align: center; padding: 2rem;">
        <UIcon name="i-heroicons-exclamation-triangle" style="width: 3rem; height: 3rem; color: #f87171; margin-bottom: 1rem;" />
        <p style="font-size: 1.125rem; font-weight: 600; color: white;">Link inválido</p>
        <p style="color: rgba(255,255,255,0.7); margin-top: 0.5rem;">Verifique o link recebido ou entre em contato pelo WhatsApp.</p>
      </div>

      <!-- Success -->
      <div v-else-if="step === 'success'" style="text-align: center; padding: 2rem;">
        <UIcon name="i-heroicons-check-circle" style="width: 4rem; height: 4rem; color: #4ade80; margin-bottom: 1rem;" />
        <p style="font-size: 1.25rem; font-weight: 700; color: white;">Pagamento confirmado!</p>
        <p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">
          {{ lead?.name?.split(' ')[0] }}, seu pagamento de {{ formatCurrency(currentInvoiceAmount) }} foi recebido.
        </p>
      </div>

      <!-- No pending invoices -->
      <div v-else-if="lead && (!invoiceData?.pending?.length)" style="text-align: center; padding: 2rem;">
        <UIcon name="i-heroicons-check-circle" style="width: 4rem; height: 4rem; color: #4ade80; margin-bottom: 1rem;" />
        <p style="font-size: 1.25rem; font-weight: 700; color: white;">Tudo certo!</p>
        <p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">
          {{ lead.name?.split(' ')[0] }}, você não possui faturas pendentes.
        </p>
      </div>

      <!-- Payment flow -->
      <template v-else-if="lead">
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; text-align: center;">
          Olá, <strong style="color: white;">{{ lead.name?.split(' ')[0] }}</strong>!
        </p>

        <!-- Error -->
        <div
          v-if="error"
          style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(239,68,68,0.2); border: 1px solid rgba(248,113,113,0.3); border-radius: 0.5rem; color: #fca5a5; font-size: 0.875rem; text-align: center;"
          role="alert"
        >
          {{ error }}
        </div>

        <!-- STEP: Invoice list -->
        <template v-if="step === 'list'">
          <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.75rem;">Faturas pendentes</p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div
              v-for="inv in invoiceData?.pending"
              :key="inv._id"
              class="pay-invoice"
            >
              <div style="flex: 1;">
                <p style="font-weight: 600; font-size: 0.95rem; color: white;">{{ inv.description }}</p>
                <p style="font-size: 1.25rem; font-weight: 800; color: white; margin-top: 0.25rem;">{{ formatCurrency(inv.amount) }}</p>
              </div>
              <button class="pay-invoice-btn" :disabled="isLoading" @click="payInvoice(inv)">
                Pagar
              </button>
            </div>
          </div>
        </template>

        <!-- STEP: Card form -->
        <template v-if="step === 'card-form'">
          <button style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; margin-bottom: 1rem; padding: 0;" @click="goBack">
            &larr; Voltar
          </button>

          <div class="pay-product">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p style="font-weight: 600; font-size: 0.95rem; color: white;">{{ currentInvoiceDesc }}</p>
              <p style="font-size: 1.25rem; font-weight: 800; color: white;">{{ formatCurrency(currentInvoiceAmount) }}</p>
            </div>
          </div>

          <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.75rem;">Dados do cartão</p>

          <div id="card-element" class="pay-card-element" />

          <button :disabled="isLoading" class="pay-btn" style="margin-top: 1.5rem;" @click="confirmCard">
            <span v-if="isLoading">Processando...</span>
            <span v-else>Pagar {{ formatCurrency(currentInvoiceAmount) }}</span>
          </button>
        </template>

        <!-- Security -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; color: rgba(255,255,255,0.5); font-size: 0.75rem;">
          <UIcon name="i-heroicons-lock-closed" style="width: 0.875rem; height: 0.875rem;" />
          <span>Pagamento seguro via Stripe</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.pay-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.pay-container {
  width: 100%;
  max-width: 28rem;
}

.pay-product {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.pay-invoice {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.75rem;
}

.pay-invoice-btn {
  padding: 0.5rem 1.25rem;
  background: var(--color-brand-cta);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.pay-invoice-btn:hover { background: var(--color-brand-cta-hover); }
.pay-invoice-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.pay-card-element {
  padding: 1rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.75rem;
}

.pay-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-brand-cta);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.pay-btn:hover { background: var(--color-brand-cta-hover); }
.pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
