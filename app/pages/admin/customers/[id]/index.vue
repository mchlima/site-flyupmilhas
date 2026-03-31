<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
useSeoMeta({ title: 'Cliente — Fly Up Milhas Admin', robots: 'noindex, nofollow' })

const route = useRoute()
const id = route.params.id as string
const toast = useToast()

const { data: lead, refresh } = await useFetch(`/api/admin/customers/${id}`)
const { data: meetings, refresh: refreshMeetings } = await useFetch(`/api/admin/customers/${id}/meetings`)

const selectedStatus = ref(lead.value?.status || 'lead')

watch(lead, (val) => {
  if (val) selectedStatus.value = val.status || 'lead'
})

const statusItems = CUSTOMER_STATUSES.map(s => ({ label: s.label, value: s.value }))

async function changeStatus(val: string) {
  selectedStatus.value = val
  await $fetch(`/api/admin/customers/${id}/status`, {
    method: 'PATCH',
    body: { status: val },
  })
  await refresh()
  toast.add({ title: 'Status atualizado', color: 'success' })
}

function formatBirthDate(d: string) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const baseUrl = computed(() => import.meta.server ? '' : window.location.origin)
const assessmentUrl = computed(() => `${baseUrl.value}/avaliacao/${id}`)
const paymentUrl = computed(() => `${baseUrl.value}/pagamento/${id}`)
const meetingsUrl = computed(() => `${baseUrl.value}/encontros/${id}`)

function copyLink(url: string, label: string) {
  navigator.clipboard.writeText(url)
  toast.add({ title: `${label} copiado!`, color: 'success' })
}

// Meetings
const meetingStatusLabels: Record<string, { label: string, color: string }> = {
  pending: { label: 'A agendar', color: 'warning' },
  scheduled: { label: 'Agendado', color: 'info' },
  completed: { label: 'Realizado', color: 'success' },
  cancelled: { label: 'Cancelado', color: 'error' },
}

const meetingModalOpen = ref(false)
const editingMeeting = ref<any>(null)
const meetingForm = reactive({
  title: '',
  status: 'scheduled' as string,
  scheduledAt: '',
  meetLink: '',
  notes: '',
  duration: 60,
})

const meetingStatusOptions = [
  { label: 'A agendar', value: 'pending' },
  { label: 'Agendado', value: 'scheduled' },
  { label: 'Realizado', value: 'completed' },
  { label: 'Cancelado', value: 'cancelled' },
]

function openNewMeetingModal() {
  editingMeeting.value = null
  meetingForm.title = ''
  meetingForm.status = 'pending'
  meetingForm.scheduledAt = ''
  meetingForm.meetLink = ''
  meetingForm.notes = ''
  meetingForm.duration = 60
  meetingModalOpen.value = true
}

function openMeetingModal(meeting: any) {
  editingMeeting.value = meeting
  meetingForm.title = meeting.title
  meetingForm.status = meeting.status
  meetingForm.scheduledAt = meeting.scheduledAt ? new Date(meeting.scheduledAt).toISOString().slice(0, 16) : ''
  meetingForm.meetLink = meeting.meetLink || ''
  meetingForm.notes = meeting.notes || ''
  meetingForm.duration = meeting.duration || 60
  meetingModalOpen.value = true
}

async function saveMeeting() {
  if (!meetingForm.title.trim()) {
    toast.add({ title: 'Informe o título do encontro', color: 'error' })
    return
  }

  try {
    if (editingMeeting.value) {
      await $fetch(`/api/admin/customers/${id}/meetings/${editingMeeting.value._id}`, {
        method: 'PUT',
        body: {
          title: meetingForm.title,
          status: meetingForm.status,
          scheduledAt: meetingForm.scheduledAt || null,
          meetLink: meetingForm.meetLink,
          notes: meetingForm.notes,
          duration: meetingForm.duration,
        },
      })
    } else {
      await $fetch(`/api/admin/customers/${id}/meetings`, {
        method: 'POST',
        body: { title: meetingForm.title },
      })
    }
    toast.add({ title: editingMeeting.value ? 'Encontro atualizado' : 'Encontro criado', color: 'success' })
    meetingModalOpen.value = false
    await refreshMeetings()
  } catch {
    toast.add({ title: 'Erro ao salvar', color: 'error' })
  }
}

function formatMeetingDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Refund
const refundModalOpen = ref(false)
const refundPaymentId = ref('')
const refundType = ref<'full' | 'partial'>('full')
const refundAmount = ref('')
const refundReason = ref('')
const refundLoading = ref(false)

const selectedPayment = computed(() => {
  if (!lead.value?.invoices) return null
  for (const inv of lead.value.invoices) {
    const found = inv.payments?.find((p: any) => p._id === refundPaymentId.value)
    if (found) return found
  }
  return null
})

const refundableCents = computed(() => {
  if (!selectedPayment.value) return 0
  return selectedPayment.value.amount - selectedPayment.value.amountRefunded
})

const refundableFormatted = computed(() => {
  return `R$ ${(refundableCents.value / 100).toFixed(2).replace('.', ',')}`
})

function openRefundModal(paymentId: string) {
  refundPaymentId.value = paymentId
  refundType.value = 'full'
  refundReason.value = ''
  refundModalOpen.value = true
}

watch(refundType, (val) => {
  if (val === 'full') {
    refundAmount.value = (refundableCents.value / 100).toFixed(2).replace('.', ',')
  } else {
    refundAmount.value = ''
  }
})

watch(refundModalOpen, (open) => {
  if (open) {
    refundAmount.value = (refundableCents.value / 100).toFixed(2).replace('.', ',')
  }
})

async function submitRefund() {
  const cents = Math.round(parseFloat(refundAmount.value.replace(',', '.')) * 100)

  if (isNaN(cents) || cents <= 0) {
    toast.add({ title: 'Informe um valor válido', color: 'error' })
    return
  }

  if (cents > refundableCents.value) {
    toast.add({ title: `Valor excede o disponível (${refundableFormatted.value})`, color: 'error' })
    return
  }

  if (!refundReason.value.trim()) {
    toast.add({ title: 'Informe o motivo do estorno', color: 'error' })
    return
  }

  refundLoading.value = true
  try {
    await $fetch(`/api/admin/customers/${id}/refund`, {
      method: 'POST',
      body: { paymentId: refundPaymentId.value, amount: cents, reason: refundReason.value },
    })
    toast.add({ title: 'Estorno realizado', color: 'success' })
    refundModalOpen.value = false
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Erro ao estornar', color: 'error' })
  } finally {
    refundLoading.value = false
  }
}

function formatCurrency(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
}

// Invoices
const invoiceModalOpen = ref(false)
const invoiceDesc = ref('')
const invoiceAmount = ref('')
const invoiceLoading = ref(false)
const { data: settings } = await useFetch('/api/admin/settings')

const invoicePresets = computed(() => {
  const planName = (settings.value?.['plan.name'] as string) || 'Mentoria Fly Up Milhas'
  const planPrice = (settings.value?.['plan.price'] as number) || 20000
  return [
    { label: planName, amount: planPrice },
  ]
})

function selectPreset(preset: { label: string, amount: number }) {
  invoiceDesc.value = preset.label
  invoiceAmount.value = (preset.amount / 100).toFixed(2).replace('.', ',')
}

async function createInvoice() {
  const cents = Math.round(parseFloat(invoiceAmount.value.replace(',', '.')) * 100)
  if (isNaN(cents) || cents < 100) {
    toast.add({ title: 'Valor mínimo: R$ 1,00', color: 'error' })
    return
  }
  if (!invoiceDesc.value.trim()) {
    toast.add({ title: 'Informe a descrição', color: 'error' })
    return
  }

  invoiceLoading.value = true
  try {
    await $fetch(`/api/admin/customers/${id}/invoices`, {
      method: 'POST',
      body: { description: invoiceDesc.value, amount: cents },
    })
    toast.add({ title: 'Fatura criada', color: 'success' })
    invoiceModalOpen.value = false
    invoiceDesc.value = ''
    invoiceAmount.value = ''
    await refresh()
  } catch (e: any) {
    toast.add({ title: e?.data?.statusMessage || 'Erro ao criar fatura', color: 'error' })
  } finally {
    invoiceLoading.value = false
  }
}

async function cancelInvoice(invoiceId: string) {
  try {
    await $fetch(`/api/admin/customers/${id}/invoices/${invoiceId}`, {
      method: 'PATCH',
      body: { status: 'cancelled' },
    })
    toast.add({ title: 'Fatura cancelada', color: 'success' })
    await refresh()
  } catch {
    toast.add({ title: 'Erro ao cancelar', color: 'error' })
  }
}
</script>

<template>
  <div v-if="lead">
    <!-- Header -->
    <div class="mb-6">
      <NuxtLink to="/admin/customers" class="text-[0.8rem] text-[var(--ui-text-muted)] no-underline">&larr; Voltar para clientes</NuxtLink>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-2">
        <div class="flex items-center gap-3">
          <UAvatar :text="lead.name.charAt(0)" size="lg" />
          <div>
            <h1 class="text-2xl font-bold text-[var(--ui-text)] leading-tight">{{ lead.name }}</h1>
            <span class="text-[0.8rem] text-[var(--ui-text-muted)]">{{ lead.email }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <UButton :to="`/admin/customers/${id}/edit`" label="Editar" color="neutral" variant="outline" icon="i-heroicons-pencil-square" />
          <UButton
            v-if="lead.hasAssessment"
            :to="`/admin/customers/${id}/assessment`"
            label="Ver avaliação"
            color="primary"
            icon="i-heroicons-clipboard-document-check"
          />
        </div>
      </div>
    </div>

    <!-- Informações do cliente -->
    <UCard>
      <template #header>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-identification" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-[0.9rem]">Informações do cliente</span>
          </div>
          <USelect
            :model-value="selectedStatus"
            :items="statusItems"
            value-key="value"
            label-key="label"
            size="sm"
            class="min-w-[160px]"
            @update:model-value="changeStatus($event as string)"
          />
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Nome</div>
          <div class="font-medium text-[var(--ui-text)] break-words">{{ lead.name }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Email</div>
          <div class="font-medium text-[var(--ui-text)] break-words">{{ lead.email }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Telefone</div>
          <div class="font-medium text-[var(--ui-text)]">{{ lead.phone }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Data de nascimento</div>
          <div class="font-medium text-[var(--ui-text)]">{{ lead.birthDate ? formatBirthDate(lead.birthDate) : '—' }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Estado</div>
          <div class="font-medium text-[var(--ui-text)]">{{ lead.state ? BRAZILIAN_STATES.find(s => s.value === lead.state)?.label || lead.state : '—' }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Cidade</div>
          <div class="font-medium text-[var(--ui-text)]">{{ lead.city || '—' }}</div>
        </div>
        <div class="min-w-0">
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Origem</div>
          <div class="font-medium text-[var(--ui-text)]">{{ lead.source }}</div>
        </div>
        <div>
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Criado em</div>
          <div class="font-medium text-[var(--ui-text)]">{{ formatDate(lead.createdAt) }}</div>
        </div>
        <div>
          <div class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)] mb-1">Atualizado em</div>
          <div class="font-medium text-[var(--ui-text)]">{{ formatDate(lead.updatedAt) }}</div>
        </div>
      </div>

      <!-- Avaliação -->
      <div class="mt-5 pt-4 border-t border-[var(--ui-border)] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <span class="text-[0.7rem] uppercase tracking-wide text-[var(--ui-text-muted)]">Avaliação</span>
          <UBadge v-if="lead.hasAssessment" color="success" variant="subtle" size="xs">Preenchida</UBadge>
          <UBadge v-else color="warning" variant="subtle" size="xs">Aguardando</UBadge>
        </div>
        <div class="flex items-center gap-1.5">
          <code class="text-[0.6rem] break-all py-1 px-2 bg-[var(--ui-bg-elevated)] rounded border border-[var(--ui-border)] max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{{ assessmentUrl }}</code>
          <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(assessmentUrl, 'Link da avaliação')" />
        </div>
      </div>
    </UCard>

    <!-- Encontros -->
    <UCard class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-video-camera" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-[0.9rem]">Encontros</span>
          </div>
          <UButton label="Novo encontro" color="primary" variant="outline" size="xs" icon="i-heroicons-plus" @click="openNewMeetingModal" />
        </div>
      </template>

      <!-- Link dos encontros -->
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--ui-border)]">
        <span class="text-[0.7rem] text-[var(--ui-text-muted)] whitespace-nowrap">Link:</span>
        <code class="text-[0.65rem] break-all flex-1 py-1.5 px-2 bg-[var(--ui-bg-elevated)] rounded border border-[var(--ui-border)]">{{ meetingsUrl }}</code>
        <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(meetingsUrl, 'Link dos encontros')" />
      </div>

      <div v-if="meetings?.length" class="flex flex-col gap-2">
        <div
          v-for="(m, i) in meetings"
          :key="m._id"
          class="flex items-center gap-3 p-2.5 border border-[var(--ui-border)] rounded-lg cursor-pointer hover:bg-[var(--ui-bg-elevated)] transition-colors"
          @click="openMeetingModal(m)"
        >
          <!-- Number -->
          <div class="size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white" :style="{ background: `var(--ui-color-${meetingStatusLabels[m.status]?.color || 'neutral'}-500)` }">
            {{ i + 1 }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium text-[var(--ui-text)]">{{ m.title }}</span>
              <UBadge :color="meetingStatusLabels[m.status]?.color || 'neutral'" variant="subtle" size="xs">
                {{ meetingStatusLabels[m.status]?.label || m.status }}
              </UBadge>
            </div>
            <div v-if="m.scheduledAt" class="text-xs text-[var(--ui-text-muted)] mt-0.5">
              {{ formatMeetingDate(m.scheduledAt) }} · {{ m.duration }} min
            </div>
          </div>

          <!-- Meet link indicator -->
          <UIcon v-if="m.meetLink" name="i-heroicons-video-camera" class="size-3.5 text-[var(--ui-text-muted)]" />
          <UIcon name="i-heroicons-chevron-right" class="size-3.5 text-[var(--ui-text-muted)]" />
        </div>
      </div>

      <div v-if="!meetings?.length" class="text-[var(--ui-text-muted)] text-sm">
        Nenhum encontro criado.
      </div>
    </UCard>

    <!-- Meeting modal -->
    <UModal v-model:open="meetingModalOpen">
      <template #content>
        <div class="p-6">
          <h2 class="text-lg font-bold text-[var(--ui-text)] mb-5">{{ editingMeeting ? 'Editar encontro' : 'Novo encontro' }}</h2>

          <div class="flex flex-col gap-4">
            <UFormField label="Título">
              <UInput v-model="meetingForm.title" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField label="Status">
                <USelect
                  v-model="meetingForm.status"
                  :items="meetingStatusOptions"
                  value-key="value"
                  label-key="label"
                  size="lg"
                />
              </UFormField>

              <UFormField label="Duração (minutos)">
                <UInput v-model.number="meetingForm.duration" type="number" size="lg" :ui="{ root: 'w-full' }" />
              </UFormField>
            </div>

            <UFormField label="Data e hora">
              <UInput v-model="meetingForm.scheduledAt" type="datetime-local" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Link da reunião (Google Meet, Zoom, etc)">
              <UInput v-model="meetingForm.meetLink" placeholder="https://meet.google.com/abc-defg-hij" size="lg" icon="i-heroicons-video-camera" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Observações">
              <UTextarea v-model="meetingForm.notes" :rows="2" placeholder="Anotações sobre o encontro..." size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="meetingModalOpen = false" />
            <UButton label="Salvar" color="primary" icon="i-heroicons-check" @click="saveMeeting" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Financeiro (Faturas + Pagamentos + Estornos) -->
    <UCard class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-banknotes" class="size-[1.1rem] text-[var(--ui-color-primary-500)]" />
            <span class="font-semibold text-[0.9rem]">Financeiro</span>
          </div>
          <UButton label="Nova fatura" color="primary" variant="outline" size="xs" icon="i-heroicons-plus" @click="invoiceModalOpen = true" />
        </div>
      </template>

      <!-- Link de pagamento -->
      <div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--ui-border)]">
        <span class="text-[0.7rem] text-[var(--ui-text-muted)] whitespace-nowrap">Link:</span>
        <code class="text-[0.65rem] break-all flex-1 py-1.5 px-2 bg-[var(--ui-bg-elevated)] rounded border border-[var(--ui-border)]">{{ paymentUrl }}</code>
        <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(paymentUrl, 'Link de pagamento')" />
      </div>

      <div v-if="lead.invoices?.length" class="flex flex-col gap-3">
        <div v-for="inv in lead.invoices" :key="inv._id" class="border border-[var(--ui-border)] rounded-lg overflow-hidden">
          <!-- Invoice header -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-2.5 bg-[var(--ui-bg-elevated)]">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <UBadge v-if="inv.status === 'paid'" color="success" variant="subtle" size="xs">Paga</UBadge>
              <UBadge v-else-if="inv.status === 'pending'" color="warning" variant="subtle" size="xs">Pendente</UBadge>
              <UBadge v-else color="neutral" variant="subtle" size="xs">Cancelada</UBadge>
              <span class="text-sm text-[var(--ui-text)] overflow-hidden text-ellipsis whitespace-nowrap">{{ inv.description }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-sm font-semibold text-[var(--ui-text)]">{{ formatCurrency(inv.amount) }}</span>
              <span class="text-[0.65rem] text-[var(--ui-text-muted)]">{{ new Date(inv.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) }}</span>
              <UButton v-if="inv.status === 'pending'" icon="i-heroicons-x-mark" color="error" variant="ghost" size="xs" @click="cancelInvoice(inv._id)" />
            </div>
          </div>

          <!-- Payments -->
          <div v-if="inv.payments?.length" class="px-3 py-2">
            <div v-for="p in inv.payments" :key="p._id" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-2 border-t border-[var(--ui-border)]">
              <div class="flex items-center gap-2.5 flex-1 min-w-0">
                <UIcon v-if="p.method === 'pix'" name="i-heroicons-qr-code" class="size-[1.1rem] text-[#32bcad] shrink-0" />
                <UIcon v-else name="i-heroicons-credit-card" class="size-[1.1rem] text-[var(--ui-text-muted)] shrink-0" />

                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <UBadge v-if="p.status === 'paid'" color="success" variant="subtle" size="xs">Pago</UBadge>
                    <UBadge v-else-if="p.status === 'pending'" color="warning" variant="subtle" size="xs">Pendente</UBadge>
                    <UBadge v-else-if="p.status === 'failed'" color="error" variant="subtle" size="xs">Falhou</UBadge>
                    <UBadge v-else-if="p.status === 'cancelled'" color="neutral" variant="subtle" size="xs">Cancelado</UBadge>
                    <UBadge v-else-if="p.status === 'partially_refunded'" color="warning" variant="subtle" size="xs">Est. parcial</UBadge>
                    <UBadge v-else-if="p.status === 'refunded'" color="error" variant="subtle" size="xs">Estornado</UBadge>
                    <UBadge v-else color="neutral" variant="subtle" size="xs">{{ p.status }}</UBadge>
                    <span class="text-sm font-semibold text-[var(--ui-text)]">{{ formatCurrency(p.amount) }}</span>
                    <span v-if="p.installmentCount > 1" class="text-[0.7rem] text-[var(--ui-text-muted)]">em {{ p.installmentCount }}x de {{ formatCurrency(p.installmentValue) }}</span>
                  </div>
                  <div class="text-[0.7rem] text-[var(--ui-text-muted)] mt-0.5">
                    <template v-if="p.method === 'card'">
                      <span v-if="p.cardBrand" class="font-medium">{{ p.cardBrand }}</span>
                      <template v-if="p.cardLastDigits"> •••• {{ p.cardLastDigits }}</template>
                      <template v-if="p.cardHolderName"> · {{ p.cardHolderName }}</template>
                      <template v-if="p.cardExpiry"> · {{ p.cardExpiry }}</template>
                    </template>
                    <template v-else>PIX</template>
                    <template v-if="p.amountRefunded > 0">
                      <span class="text-[var(--ui-color-error-500)]"> · Estornado: {{ formatCurrency(p.amountRefunded) }}</span>
                    </template>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-[0.65rem] text-[var(--ui-text-muted)] whitespace-nowrap">{{ p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt) }}</span>
                <UButton
                  v-if="p.status === 'paid' || p.status === 'partially_refunded'"
                  icon="i-heroicons-arrow-uturn-left"
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="openRefundModal(p._id)"
                />
              </div>
            </div>

            <!-- Refunds -->
            <template v-for="p in inv.payments" :key="`refunds-${p._id}`">
              <div v-if="p.refunds?.length" class="pl-7 mb-1">
                <div v-for="(r, ri) in p.refunds" :key="ri" class="flex items-center gap-2 text-[0.65rem] text-[var(--ui-text-muted)] py-0.5">
                  <UIcon name="i-heroicons-arrow-uturn-left" class="size-2.5" />
                  <span>{{ formatCurrency(r.amount) }}</span>
                  <span v-if="r.reason">— {{ r.reason }}</span>
                  <span class="ml-auto">{{ new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div v-else class="text-[var(--ui-text-muted)] text-sm">
        Nenhuma fatura criada
      </div>
    </UCard>

    <!-- Invoice modal -->
    <UModal v-model:open="invoiceModalOpen">
      <template #content>
        <div class="p-6">
          <h2 class="text-lg font-bold text-[var(--ui-text)] mb-5">Nova fatura</h2>

          <div class="flex flex-wrap gap-2 mb-5">
            <UButton
              v-for="preset in invoicePresets"
              :key="preset.label"
              :label="`${preset.label} (${formatCurrency(preset.amount)})`"
              color="neutral"
              variant="outline"
              size="sm"
              @click="selectPreset(preset)"
            />
          </div>

          <div class="flex flex-col gap-4">
            <UFormField label="Descrição" required>
              <UInput v-model="invoiceDesc" placeholder="Ex: Mentoria VIP, Extensão, Multa..." size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Valor (R$)" required>
              <UInput v-model="invoiceAmount" placeholder="200,00" size="lg" icon="i-heroicons-currency-dollar" :ui="{ root: 'w-full' }" />
            </UFormField>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="invoiceModalOpen = false" />
            <UButton label="Criar fatura" color="primary" icon="i-heroicons-plus" :loading="invoiceLoading" @click="createInvoice" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Refund modal -->
    <UModal v-model:open="refundModalOpen">
      <template #content>
        <div class="p-6">
          <h2 class="text-lg font-bold text-[var(--ui-text)] mb-5">Estornar pagamento</h2>

          <!-- Type -->
          <div class="flex gap-2 mb-5">
            <UButton
              label="Total"
              :color="refundType === 'full' ? 'error' : 'neutral'"
              :variant="refundType === 'full' ? 'soft' : 'outline'"
              size="lg"
              class="flex-1"
              @click="refundType = 'full'"
            />
            <UButton
              label="Parcial"
              :color="refundType === 'partial' ? 'error' : 'neutral'"
              :variant="refundType === 'partial' ? 'soft' : 'outline'"
              size="lg"
              class="flex-1"
              @click="refundType = 'partial'"
            />
          </div>

          <!-- Amount -->
          <UFormField label="Valor (R$)" required class="mb-4">
            <UInput
              v-model="refundAmount"
              placeholder="0,00"
              size="lg"
              icon="i-heroicons-currency-dollar"
              :disabled="refundType === 'full'"
              :ui="{ root: 'w-full' }"
            />
            <template v-if="lead.payment?.amountRefunded > 0" #help>
              Disponível: {{ refundableFormatted }}
            </template>
          </UFormField>

          <!-- Reason -->
          <UFormField label="Motivo" required class="mb-6">
            <UTextarea v-model="refundReason" :rows="2" placeholder="Motivo do estorno..." size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div class="flex gap-3 justify-end">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="refundModalOpen = false" />
            <UButton
              label="Confirmar estorno"
              color="error"
              icon="i-heroicons-arrow-uturn-left"
              :loading="refundLoading"
              @click="submitRefund"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
