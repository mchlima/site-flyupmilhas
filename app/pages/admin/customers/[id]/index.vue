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
    <div style="margin-bottom: 1.5rem;">
      <NuxtLink to="/admin/customers" style="font-size: 0.8rem; color: #64748b; text-decoration: none;">&larr; Voltar para clientes</NuxtLink>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <UAvatar :text="lead.name.charAt(0)" size="lg" />
          <div>
            <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--ui-text); line-height: 1.2;">{{ lead.name }}</h1>
            <span style="font-size: 0.8rem; color: #64748b;">{{ lead.email }}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
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
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-identification" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.9rem;">Informações do cliente</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <USelect
              :model-value="selectedStatus"
              :items="statusItems"
              value-key="value"
              label-key="label"
              size="sm"
              style="min-width: 160px;"
              @update:model-value="changeStatus($event as string)"
            />
          </div>
        </div>
      </template>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Nome</div>
          <div style="font-weight: 500; color: var(--ui-text); overflow-wrap: break-word;">{{ lead.name }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Email</div>
          <div style="font-weight: 500; color: var(--ui-text); overflow-wrap: break-word;">{{ lead.email }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Telefone</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ lead.phone }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Data de nascimento</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ lead.birthDate ? formatBirthDate(lead.birthDate) : '—' }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Estado</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ lead.state ? BRAZILIAN_STATES.find(s => s.value === lead.state)?.label || lead.state : '—' }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Cidade</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ lead.city || '—' }}</div>
        </div>
        <div style="min-width: 0;">
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Origem</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ lead.source }}</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Criado em</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ formatDate(lead.createdAt) }}</div>
        </div>
        <div>
          <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted); margin-bottom: 0.25rem;">Atualizado em</div>
          <div style="font-weight: 500; color: var(--ui-text);">{{ formatDate(lead.updatedAt) }}</div>
        </div>
      </div>

      <!-- Avaliação -->
      <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--ui-border); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ui-text-muted);">Avaliação</span>
          <UBadge v-if="lead.hasAssessment" color="success" variant="subtle" size="xs">Preenchida</UBadge>
          <UBadge v-else color="warning" variant="subtle" size="xs">Aguardando</UBadge>
        </div>
        <div style="display: flex; align-items: center; gap: 0.375rem;">
          <code style="font-size: 0.6rem; word-break: break-all; padding: 0.25rem 0.5rem; background: var(--ui-bg-elevated); border-radius: 0.25rem; border: 1px solid var(--ui-border); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ assessmentUrl }}</code>
          <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(assessmentUrl, 'Link da avaliação')" />
        </div>
      </div>
    </UCard>

    <!-- Encontros -->
    <UCard style="margin-top: 1rem;">
      <template #header>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-video-camera" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.9rem;">Encontros</span>
          </div>
          <UButton label="Novo encontro" color="primary" variant="outline" size="xs" icon="i-heroicons-plus" @click="openNewMeetingModal" />
        </div>
      </template>

      <!-- Link dos encontros -->
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--ui-border);">
        <span style="font-size: 0.7rem; color: var(--ui-text-muted); white-space: nowrap;">Link:</span>
        <code style="font-size: 0.65rem; word-break: break-all; flex: 1; padding: 0.375rem 0.5rem; background: var(--ui-bg-elevated); border-radius: 0.25rem; border: 1px solid var(--ui-border);">{{ meetingsUrl }}</code>
        <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(meetingsUrl, 'Link dos encontros')" />
      </div>

      <div v-if="meetings?.length" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div
          v-for="(m, i) in meetings"
          :key="m._id"
          style="display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border: 1px solid var(--ui-border); border-radius: 0.5rem; cursor: pointer;"
          @click="openMeetingModal(m)"
        >
          <!-- Number -->
          <div style="width: 1.75rem; height: 1.75rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;" :style="{ background: `var(--ui-color-${meetingStatusLabels[m.status]?.color || 'neutral'}-500)`, color: 'white' }">
            {{ i + 1 }}
          </div>

          <!-- Info -->
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.85rem; font-weight: 500; color: var(--ui-text);">{{ m.title }}</span>
              <UBadge :color="meetingStatusLabels[m.status]?.color || 'neutral'" variant="subtle" size="xs">
                {{ meetingStatusLabels[m.status]?.label || m.status }}
              </UBadge>
            </div>
            <div v-if="m.scheduledAt" style="font-size: 0.75rem; color: var(--ui-text-muted); margin-top: 0.125rem;">
              {{ formatMeetingDate(m.scheduledAt) }} · {{ m.duration }} min
            </div>
          </div>

          <!-- Meet link indicator -->
          <UIcon v-if="m.meetLink" name="i-heroicons-video-camera" style="width: 0.85rem; height: 0.85rem; color: var(--ui-text-muted);" />
          <UIcon name="i-heroicons-chevron-right" style="width: 0.85rem; height: 0.85rem; color: var(--ui-text-muted);" />
        </div>
      </div>

      <div v-if="!meetings?.length" style="color: var(--ui-text-muted); font-size: 0.85rem;">
        Nenhum encontro criado.
      </div>
    </UCard>

    <!-- Meeting modal -->
    <UModal v-model:open="meetingModalOpen">
      <template #content>
        <div style="padding: 1.5rem;">
          <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--ui-text); margin-bottom: 1.25rem;">{{ editingMeeting ? 'Editar encontro' : 'Novo encontro' }}</h2>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <UFormField label="Título">
              <UInput v-model="meetingForm.title" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Status">
              <USelect
                v-model="meetingForm.status"
                :items="meetingStatusOptions"
                value-key="value"
                label-key="label"
                size="lg"
              />
            </UFormField>

            <UFormField label="Data e hora">
              <UInput v-model="meetingForm.scheduledAt" type="datetime-local" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Link da reunião (Google Meet, Zoom, etc)">
              <UInput v-model="meetingForm.meetLink" placeholder="https://meet.google.com/abc-defg-hij" size="lg" icon="i-heroicons-video-camera" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Duração (minutos)">
              <UInput v-model.number="meetingForm.duration" type="number" size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Observações">
              <UTextarea v-model="meetingForm.notes" :rows="2" placeholder="Anotações sobre o encontro..." size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="meetingModalOpen = false" />
            <UButton label="Salvar" color="primary" icon="i-heroicons-check" @click="saveMeeting" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Financeiro (Faturas + Pagamentos + Estornos) -->
    <UCard style="margin-top: 1rem;">
      <template #header>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <UIcon name="i-heroicons-banknotes" style="width: 1.1rem; height: 1.1rem; color: var(--ui-color-primary-500);" />
            <span style="font-weight: 600; font-size: 0.9rem;">Financeiro</span>
          </div>
          <UButton label="Nova fatura" color="primary" variant="outline" size="xs" icon="i-heroicons-plus" @click="invoiceModalOpen = true" />
        </div>
      </template>

      <!-- Link de pagamento -->
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--ui-border);">
        <span style="font-size: 0.7rem; color: var(--ui-text-muted); white-space: nowrap;">Link:</span>
        <code style="font-size: 0.65rem; word-break: break-all; flex: 1; padding: 0.375rem 0.5rem; background: var(--ui-bg-elevated); border-radius: 0.25rem; border: 1px solid var(--ui-border);">{{ paymentUrl }}</code>
        <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="xs" @click="copyLink(paymentUrl, 'Link de pagamento')" />
      </div>

      <div v-if="lead.invoices?.length" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div v-for="inv in lead.invoices" :key="inv._id" style="border: 1px solid var(--ui-border); border-radius: 0.5rem; overflow: hidden;">
          <!-- Invoice header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.75rem; background: var(--ui-bg-elevated);">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
              <UBadge v-if="inv.status === 'paid'" color="success" variant="subtle" size="xs">Paga</UBadge>
              <UBadge v-else-if="inv.status === 'pending'" color="warning" variant="subtle" size="xs">Pendente</UBadge>
              <UBadge v-else color="neutral" variant="subtle" size="xs">Cancelada</UBadge>
              <span style="font-size: 0.85rem; color: var(--ui-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ inv.description }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
              <span style="font-size: 0.85rem; font-weight: 600; color: var(--ui-text);">{{ formatCurrency(inv.amount) }}</span>
              <span style="font-size: 0.65rem; color: var(--ui-text-muted);">{{ new Date(inv.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) }}</span>
              <UButton v-if="inv.status === 'pending'" icon="i-heroicons-x-mark" color="error" variant="ghost" size="xs" @click="cancelInvoice(inv._id)" />
            </div>
          </div>

          <!-- Payments -->
          <div v-if="inv.payments?.length" style="padding: 0.5rem 0.75rem;">
            <div v-for="p in inv.payments" :key="p._id" style="padding: 0.375rem 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <UIcon name="i-heroicons-credit-card" style="width: 0.8rem; height: 0.8rem; color: var(--ui-text-muted);" />
                  <UBadge v-if="p.status === 'paid'" color="success" variant="subtle" size="xs">Pago</UBadge>
                  <UBadge v-else-if="p.status === 'pending'" color="warning" variant="subtle" size="xs">Pendente</UBadge>
                  <UBadge v-else-if="p.status === 'failed'" color="error" variant="subtle" size="xs">Falhou</UBadge>
                  <UBadge v-else-if="p.status === 'partially_refunded'" color="warning" variant="subtle" size="xs">Est. parcial</UBadge>
                  <UBadge v-else-if="p.status === 'refunded'" color="error" variant="subtle" size="xs">Estornado</UBadge>
                  <UBadge v-else color="neutral" variant="subtle" size="xs">{{ p.status }}</UBadge>
                  <span style="font-size: 0.75rem; color: var(--ui-text-muted);">
                    {{ p.method === 'card' ? 'Cartão' : 'PIX' }} · {{ formatCurrency(p.amount) }}
                    <template v-if="p.amountRefunded > 0"> · Est: {{ formatCurrency(p.amountRefunded) }}</template>
                  </span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.375rem;">
                  <span style="font-size: 0.65rem; color: var(--ui-text-muted);">{{ p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt) }}</span>
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
              <div v-if="p.refunds?.length" style="padding-left: 1.5rem; margin-top: 0.25rem;">
                <div v-for="(r, ri) in p.refunds" :key="ri" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; color: var(--ui-text-muted); padding: 0.125rem 0;">
                  <UIcon name="i-heroicons-arrow-uturn-left" style="width: 0.6rem; height: 0.6rem;" />
                  <span>{{ formatCurrency(r.amount) }}</span>
                  <span v-if="r.reason">— {{ r.reason }}</span>
                  <span style="margin-left: auto;">{{ new Date(r.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else style="color: var(--ui-text-muted); font-size: 0.85rem;">
        Nenhuma fatura criada
      </div>
    </UCard>

    <!-- Invoice modal -->
    <UModal v-model:open="invoiceModalOpen">
      <template #content>
        <div style="padding: 1.5rem;">
          <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--ui-text); margin-bottom: 1.25rem;">Nova fatura</h2>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
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

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <UFormField label="Descrição" required>
              <UInput v-model="invoiceDesc" placeholder="Ex: Mentoria VIP, Extensão, Multa..." size="lg" :ui="{ root: 'w-full' }" />
            </UFormField>

            <UFormField label="Valor (R$)" required>
              <UInput v-model="invoiceAmount" placeholder="200,00" size="lg" icon="i-heroicons-currency-dollar" :ui="{ root: 'w-full' }" />
            </UFormField>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem;">
            <UButton label="Cancelar" color="neutral" variant="ghost" @click="invoiceModalOpen = false" />
            <UButton label="Criar fatura" color="primary" icon="i-heroicons-plus" :loading="invoiceLoading" @click="createInvoice" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Refund modal -->
    <UModal v-model:open="refundModalOpen">
      <template #content>
        <div style="padding: 1.5rem;">
          <h2 style="font-size: 1.125rem; font-weight: 700; color: var(--ui-text); margin-bottom: 1.25rem;">Estornar pagamento</h2>

          <!-- Type -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <UButton
              label="Total"
              :color="refundType === 'full' ? 'error' : 'neutral'"
              :variant="refundType === 'full' ? 'soft' : 'outline'"
              size="lg"
              style="flex: 1;"
              @click="refundType = 'full'"
            />
            <UButton
              label="Parcial"
              :color="refundType === 'partial' ? 'error' : 'neutral'"
              :variant="refundType === 'partial' ? 'soft' : 'outline'"
              size="lg"
              style="flex: 1;"
              @click="refundType = 'partial'"
            />
          </div>

          <!-- Amount -->
          <UFormField label="Valor (R$)" required style="margin-bottom: 1rem;">
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
          <UFormField label="Motivo" required style="margin-bottom: 1.5rem;">
            <UTextarea v-model="refundReason" :rows="2" placeholder="Motivo do estorno..." size="lg" :ui="{ root: 'w-full' }" />
          </UFormField>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
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
