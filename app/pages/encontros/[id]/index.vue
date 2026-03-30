<script setup lang="ts">
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Meus Encontros — Fly Up Milhas',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const customerId = route.params.id as string

const { data, error: fetchError } = await useFetch(`/api/meetings/${customerId}`)

function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusConfig: Record<string, { label: string, color: string, icon: string }> = {
  pending: { label: 'A agendar', color: '#f59e0b', icon: 'i-heroicons-clock' },
  scheduled: { label: 'Agendado', color: '#3b82f6', icon: 'i-heroicons-calendar' },
  completed: { label: 'Realizado', color: '#22c55e', icon: 'i-heroicons-check-circle' },
}
</script>

<template>
  <div class="meetings-page">
    <div class="meetings-container">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img
          src="~/assets/img/logo-fly-up-milhas.webp"
          alt="Fly Up Milhas"
          style="height: 2.5rem; width: auto; margin: 0 auto;"
        />
      </div>

      <!-- Error -->
      <div v-if="fetchError" style="text-align: center; padding: 2rem;">
        <UIcon name="i-heroicons-exclamation-triangle" style="width: 3rem; height: 3rem; color: #f87171; margin-bottom: 1rem;" />
        <p style="font-size: 1.125rem; font-weight: 600; color: white;">Link inválido</p>
      </div>

      <!-- Meetings -->
      <template v-else-if="data">
        <h1 style="font-size: 1.5rem; font-weight: 700; color: white; text-align: center; margin-bottom: 0.5rem;">
          Seus Encontros
        </h1>
        <p style="color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 2rem;">
          Olá, {{ data.customerName?.split(' ')[0] }}! Aqui estão seus encontros da mentoria.
        </p>

        <div v-if="data.meetings?.length" style="display: flex; flex-direction: column; gap: 1rem;">
          <div
            v-for="(meeting, i) in data.meetings"
            :key="meeting.type"
            class="meeting-card"
          >
            <!-- Number -->
            <div class="meeting-number" :style="{ background: statusConfig[meeting.status]?.color || '#6b7280' }">
              {{ i + 1 }}
            </div>

            <div style="flex: 1;">
              <!-- Type + status -->
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-weight: 600; color: white; font-size: 1rem;">{{ meeting.title }}</span>
                <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem;" :style="{ color: statusConfig[meeting.status]?.color }">
                  <UIcon :name="statusConfig[meeting.status]?.icon || 'i-heroicons-clock'" style="width: 0.9rem; height: 0.9rem;" />
                  {{ statusConfig[meeting.status]?.label }}
                </div>
              </div>

              <!-- Scheduled -->
              <template v-if="meeting.status === 'scheduled'">
                <p v-if="meeting.scheduledAt" style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 0.5rem;">
                  <UIcon name="i-heroicons-calendar" style="width: 0.85rem; height: 0.85rem; vertical-align: -2px;" />
                  {{ formatDateTime(meeting.scheduledAt) }}
                </p>
                <p v-else style="color: rgba(255,255,255,0.5); font-size: 0.85rem; margin-bottom: 0.5rem;">
                  Data a confirmar                 </p>

                <a
                  v-if="meeting.meetLink"
                  :href="meeting.meetLink"
                  target="_blank"
                  rel="noopener"
                  class="meeting-join-btn"
                >
                  <UIcon name="i-heroicons-video-camera" style="width: 1rem; height: 1rem;" />
                  Entrar na reunião
                </a>
                <p v-else style="color: rgba(255,255,255,0.4); font-size: 0.8rem;">
                  Link da reunião será enviado em breve.
                </p>
              </template>

              <!-- Pending -->
              <p v-else-if="meeting.status === 'pending'" style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">
                Aguardando agendamento — entraremos em contato pelo WhatsApp.
              </p>

              <!-- Completed -->
              <p v-else-if="meeting.status === 'completed'" style="color: rgba(255,255,255,0.5); font-size: 0.85rem;">
                Encontro realizado{{ meeting.scheduledAt ? ' em ' + formatDateTime(meeting.scheduledAt) : '' }}
              </p>
            </div>
          </div>
        </div>

        <div v-else style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.6);">
          Nenhum encontro agendado ainda.
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.meetings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.meetings-container {
  width: 100%;
  max-width: 32rem;
}

.meeting-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.75rem;
}

.meeting-number {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.meeting-join-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-brand-cta);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.15s;
}

.meeting-join-btn:hover {
  background: var(--color-brand-cta-hover);
}
</style>
