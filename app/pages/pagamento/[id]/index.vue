<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Pagamento — Fly Up Milhas',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const customerId = route.params.id as string

const { data: lead, error: fetchError } = await useFetch(`/api/customers/${customerId}`)
const { data: invoiceData, refresh: refreshInvoices } = await useFetch(`/api/payments/${customerId}`)
const { data: paymentSettings } = await useFetch('/api/settings/payment')

const isLoading = ref(false)
const error = ref('')
const step = ref<'list' | 'method' | 'card-form' | 'pix-qr' | 'success'>('list')
const currentInvoiceId = ref('')
const currentInvoiceAmount = ref(0)
const currentInvoiceDesc = ref('')
const selectedMethod = ref<'CREDIT_CARD' | 'PIX'>('CREDIT_CARD')
const selectedInstallments = ref(1)

// PIX data
const pixImage = ref('')
const pixPayload = ref('')
const pixCopied = ref(false)

// Card form
const card = reactive({
  holderName: '',
  number: '',
  expiryMonth: '',
  expiryYear: '',
  ccv: '',
})

const holder = reactive({
  name: '',
  email: '',
  cpfCnpj: '',
  phone: '',
  postalCode: '',
  addressNumber: '',
})

function onCpfInput(e: Event) {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
  let formatted = digits
  if (digits.length > 9) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  else if (digits.length > 6) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  else if (digits.length > 3) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`
  holder.cpfCnpj = formatted
}

function onPhoneInput(e: Event) {
  const digits = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
  let formatted = digits
  if (digits.length > 10) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  else if (digits.length > 6) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  else if (digits.length > 2) formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  holder.phone = formatted
}

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

const installmentOptions = computed(() => {
  const amount = currentInvoiceAmount.value
  const configMax = paymentSettings.value?.maxInstallments || 12
  const maxInstallments = Math.min(configMax, Math.floor(amount / 500))
  const options = []
  for (let i = 1; i <= Math.max(1, maxInstallments); i++) {
    options.push({
      count: i,
      label: i === 1 ? 'À vista' : `${i}x`,
      perInstallment: Math.ceil(amount / i),
    })
  }
  return options
})

function selectInvoice(inv: { _id: string, description: string, amount: number }) {
  currentInvoiceId.value = inv._id
  currentInvoiceAmount.value = inv.amount
  currentInvoiceDesc.value = inv.description
  selectedInstallments.value = 1
  selectedMethod.value = 'CREDIT_CARD'
  error.value = ''

  // Pre-fill holder info
  if (lead.value) {
    holder.name = lead.value.name || ''
    holder.email = lead.value.email || ''
    holder.phone = lead.value.phone || ''
    card.holderName = lead.value.name || ''
  }

  step.value = 'method'
}

function selectMethodAndContinue() {
  if (!holder.cpfCnpj || holder.cpfCnpj.replace(/\D/g, '').length < 11) {
    error.value = 'Informe seu CPF para continuar.'
    return
  }
  error.value = ''

  if (selectedMethod.value === 'CREDIT_CARD') {
    step.value = 'card-form'
  } else {
    payWithPix()
  }
}

async function payWithPix() {
  isLoading.value = true
  error.value = ''

  try {
    const result = await $fetch<any>('/api/payments/create-charge', {
      method: 'POST',
      body: {
        invoiceId: currentInvoiceId.value,
        method: 'PIX',
        cpfCnpj: holder.cpfCnpj.replace(/\D/g, ''),
      },
    })

    if (result.paid) {
      step.value = 'success'
    } else if (result.pix) {
      pixImage.value = `data:image/png;base64,${result.pix.encodedImage}`
      pixPayload.value = result.pix.payload
      step.value = 'pix-qr'
    }
  } catch (e: any) {
    if (e?.status === 409) {
      await refreshInvoices()
      step.value = 'list'
    } else {
      error.value = e?.data?.statusMessage || 'Erro ao gerar PIX.'
    }
  } finally {
    isLoading.value = false
  }
}

async function payWithCard() {
  if (!card.number || !card.expiryMonth || !card.expiryYear || !card.ccv || !card.holderName) {
    error.value = 'Preencha todos os dados do cartão.'
    return
  }
  if (!holder.cpfCnpj) {
    error.value = 'Preencha o CPF.'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const result = await $fetch<any>('/api/payments/create-charge', {
      method: 'POST',
      body: {
        invoiceId: currentInvoiceId.value,
        method: 'CREDIT_CARD',
        installmentCount: selectedInstallments.value,
        creditCard: {
          holderName: card.holderName,
          number: card.number.replace(/\s/g, ''),
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          ccv: card.ccv,
        },
        creditCardHolderInfo: {
          name: holder.name,
          email: holder.email,
          cpfCnpj: holder.cpfCnpj.replace(/\D/g, ''),
          phone: holder.phone.replace(/\D/g, ''),
          postalCode: holder.postalCode.replace(/\D/g, ''),
          addressNumber: holder.addressNumber,
        },
      },
    })

    if (result.paid) {
      step.value = 'success'
    } else {
      error.value = 'Pagamento não confirmado. Verifique os dados e tente novamente.'
    }
  } catch (e: any) {
    if (e?.status === 409) {
      await refreshInvoices()
      step.value = 'list'
    } else {
      error.value = e?.data?.statusMessage || 'Erro no pagamento. Verifique os dados do cartão.'
    }
  } finally {
    isLoading.value = false
  }
}

function copyPix() {
  navigator.clipboard.writeText(pixPayload.value)
  pixCopied.value = true
  setTimeout(() => { pixCopied.value = false }, 3000)
}

function goBack() {
  if (step.value === 'card-form' || step.value === 'pix-qr') {
    step.value = 'method'
    error.value = ''
    return
  }
  if (step.value === 'method') {
    step.value = 'list'
    error.value = ''
    return
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

      <!-- Error: not found -->
      <div v-if="fetchError" style="text-align: center; padding: 2rem;">
        <UIcon name="i-heroicons-exclamation-triangle" style="width: 3rem; height: 3rem; color: #f87171; margin-bottom: 1rem;" />
        <p style="font-size: 1.125rem; font-weight: 600; color: white;">Link inválido</p>
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
        <p style="color: rgba(255,255,255,0.8); margin-top: 0.5rem;">{{ lead.name?.split(' ')[0] }}, você não possui faturas pendentes.</p>
      </div>

      <!-- Payment flow -->
      <template v-else-if="lead">
        <p style="color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; text-align: center;">
          Olá, <strong style="color: white;">{{ lead.name?.split(' ')[0] }}</strong>!
        </p>

        <div v-if="error" style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(239,68,68,0.2); border: 1px solid rgba(248,113,113,0.3); border-radius: 0.5rem; color: #fca5a5; font-size: 0.875rem; text-align: center;" role="alert">
          {{ error }}
        </div>

        <!-- STEP: Invoice list -->
        <template v-if="step === 'list'">
          <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.75rem;">Faturas pendentes</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div v-for="inv in invoiceData?.pending" :key="inv._id" class="pay-invoice">
              <div style="flex: 1;">
                <p style="font-weight: 600; font-size: 0.95rem; color: white;">{{ inv.description }}</p>
                <p style="font-size: 1.25rem; font-weight: 800; color: white; margin-top: 0.25rem;">{{ formatCurrency(inv.amount) }}</p>
              </div>
              <button class="pay-invoice-btn" @click="selectInvoice(inv)">Pagar</button>
            </div>
          </div>
        </template>

        <!-- STEP: Method selection -->
        <template v-if="step === 'method'">
          <button style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; margin-bottom: 1rem; padding: 0;" @click="goBack">&larr; Voltar</button>

          <div class="pay-product">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p style="font-weight: 600; font-size: 0.95rem; color: white;">{{ currentInvoiceDesc }}</p>
              <p style="font-size: 1.25rem; font-weight: 800; color: white;">{{ formatCurrency(currentInvoiceAmount) }}</p>
            </div>
          </div>

          <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.75rem;">Forma de pagamento</p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
            <label class="pay-method" :class="{ 'pay-method--selected': selectedMethod === 'CREDIT_CARD' }">
              <input v-model="selectedMethod" type="radio" value="CREDIT_CARD" style="display: none;" />
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <UIcon name="i-heroicons-credit-card" style="width: 1.5rem; height: 1.5rem;" />
                <div>
                  <p style="font-weight: 600; font-size: 0.9rem;">Cartão de crédito</p>
                  <p style="font-size: 0.75rem; opacity: 0.7;">Até {{ installmentOptions.length }}x sem juros</p>
                </div>
              </div>
            </label>

            <label class="pay-method" :class="{ 'pay-method--selected': selectedMethod === 'PIX' }">
              <input v-model="selectedMethod" type="radio" value="PIX" style="display: none;" />
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <UIcon name="i-heroicons-qr-code" style="width: 1.5rem; height: 1.5rem;" />
                <div>
                  <p style="font-weight: 600; font-size: 0.9rem;">PIX</p>
                  <p style="font-size: 0.75rem; opacity: 0.7;">Aprovação instantânea</p>
                </div>
              </div>
            </label>
          </div>

          <div style="margin-bottom: 1rem;">
            <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">CPF</p>
            <input :value="holder.cpfCnpj" type="text" placeholder="000.000.000-00" inputmode="numeric" maxlength="14" class="pay-input" @input="onCpfInput" />
          </div>

          <button :disabled="isLoading" class="pay-btn" @click="selectMethodAndContinue">
            <span v-if="isLoading">Processando...</span>
            <span v-else>Continuar</span>
          </button>
        </template>

        <!-- STEP: Card form -->
        <template v-if="step === 'card-form'">
          <button style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; margin-bottom: 1rem; padding: 0;" @click="goBack">&larr; Voltar</button>

          <div class="pay-product">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p style="font-weight: 600; font-size: 0.95rem; color: white;">{{ currentInvoiceDesc }}</p>
              <p style="font-size: 1.25rem; font-weight: 800; color: white;">{{ formatCurrency(currentInvoiceAmount) }}</p>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9);">Dados do cartão</p>

            <input v-model="card.holderName" type="text" placeholder="Nome impresso no cartão" class="pay-input" />
            <input v-model="card.number" type="text" placeholder="Número do cartão" inputmode="numeric" class="pay-input" />
            <div style="display: flex; gap: 0.5rem;">
              <input v-model="card.expiryMonth" type="text" placeholder="Mês (MM)" maxlength="2" inputmode="numeric" class="pay-input" style="flex: 1;" />
              <input v-model="card.expiryYear" type="text" placeholder="Ano (AAAA)" maxlength="4" inputmode="numeric" class="pay-input" style="flex: 1;" />
              <input v-model="card.ccv" type="text" placeholder="CVV" maxlength="4" inputmode="numeric" class="pay-input" style="flex: 1;" />
            </div>

            <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-top: 0.5rem;">Dados do titular</p>

            <input :value="holder.cpfCnpj" type="text" placeholder="CPF: 000.000.000-00" inputmode="numeric" maxlength="14" class="pay-input" @input="onCpfInput" />
            <div style="display: flex; gap: 0.5rem;">
              <input :value="holder.phone" type="text" placeholder="(11) 99999-9999" inputmode="numeric" maxlength="15" class="pay-input" style="flex: 1;" @input="onPhoneInput" />
              <input v-model="holder.postalCode" type="text" placeholder="CEP" inputmode="numeric" maxlength="9" class="pay-input" style="flex: 1;" />
              <input v-model="holder.addressNumber" type="text" placeholder="Nº" class="pay-input" style="width: 70px;" />
            </div>

            <!-- Installments -->
            <div v-if="installmentOptions.length > 1" style="margin-top: 0.5rem;">
              <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">Parcelamento</p>
              <select v-model="selectedInstallments" class="pay-input">
                <option v-for="opt in installmentOptions" :key="opt.count" :value="opt.count">
                  {{ opt.count === 1 ? `À vista - ${formatCurrency(currentInvoiceAmount)}` : `${opt.count}x de ${formatCurrency(opt.perInstallment)}` }}
                </option>
              </select>
            </div>
          </div>

          <!-- Total -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.06); border-radius: 0.5rem;">
            <span style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">
              {{ selectedInstallments === 1 ? 'Total à vista' : `${selectedInstallments}x de ${formatCurrency(Math.ceil(currentInvoiceAmount / selectedInstallments))}` }}
            </span>
            <span style="font-size: 1.1rem; font-weight: 800; color: white;">{{ formatCurrency(currentInvoiceAmount) }}</span>
          </div>

          <button :disabled="isLoading" class="pay-btn" style="margin-top: 1rem;" @click="payWithCard">
            <span v-if="isLoading">Processando pagamento...</span>
            <span v-else>Pagar</span>
          </button>
        </template>

        <!-- STEP: PIX QR Code -->
        <template v-if="step === 'pix-qr'">
          <button style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 0.8rem; cursor: pointer; margin-bottom: 1rem; padding: 0;" @click="goBack">&larr; Voltar</button>

          <div style="text-align: center;">
            <p style="font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 1rem;">Escaneie o QR Code ou copie o código</p>

            <div style="background: white; border-radius: 0.75rem; padding: 1.5rem; display: inline-block; margin-bottom: 1rem;">
              <img :src="pixImage" alt="QR Code PIX" style="width: 200px; height: 200px;" />
            </div>

            <div style="margin-bottom: 1rem;">
              <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; padding: 0.75rem; word-break: break-all; font-size: 0.65rem; color: rgba(255,255,255,0.6); max-height: 3rem; overflow: hidden;">
                {{ pixPayload }}
              </div>
            </div>

            <button class="pay-btn" @click="copyPix">
              {{ pixCopied ? 'Copiado!' : 'Copiar código PIX' }}
            </button>

            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 1rem;">
              Após o pagamento, a confirmação é automática.
            </p>
          </div>
        </template>

        <!-- Security -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; color: rgba(255,255,255,0.5); font-size: 0.75rem;">
          <UIcon name="i-heroicons-lock-closed" style="width: 0.875rem; height: 0.875rem;" />
          <span>Pagamento seguro</span>
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

.pay-container { width: 100%; max-width: 28rem; }

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
}
.pay-invoice-btn:hover { background: var(--color-brand-cta-hover); }

.pay-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.pay-method:hover { background: rgba(255,255,255,0.1); }
.pay-method--selected { border-color: var(--color-brand-cta); background: rgba(14,116,144,0.15); color: white; }

.pay-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.5rem;
  color: white;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}
.pay-input:focus { border-color: var(--color-brand-cta); }
.pay-input::placeholder { color: rgba(255,255,255,0.35); }
select.pay-input option { background: #1e293b; color: white; }

.pay-installment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  font-size: 0.875rem;
}
.pay-installment:hover { background: rgba(255,255,255,0.1); }
.pay-installment--selected { border-color: var(--color-brand-cta); background: rgba(14,116,144,0.15); color: white; }

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
