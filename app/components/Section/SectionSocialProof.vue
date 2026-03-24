<script setup lang="ts">
const testimonials = [
  {
    name: 'Ana Paula',
    city: 'São Paulo, SP',
    text: 'Com a mentoria da Fly Up Milhas, consegui emitir dois bilhetes executivos para Lisboa por apenas <strong>58.000 milhas</strong> cada. Pagaria mais de <strong>R$ 12.000</strong> comprando direto. Valeu cada centavo!',
  },
  {
    name: 'Carlos Eduardo',
    city: 'Curitiba, PR',
    text: 'Não sabia nem que tinha milhas suficientes. Em <strong>3 semanas</strong> já tinha as passagens emitidas para <strong>Miami em business class</strong>. Processo todo simples e sem estresse.',
  },
  {
    name: 'Juliana Martins',
    city: 'Belo Horizonte, MG',
    text: 'Sempre achei que milhas era coisa de quem gasta muito no cartão. Com a mentoria, aprendi a juntar <strong>mais de 40.000 milhas em 2 meses</strong> sem mudar meus hábitos. Já estou planejando minha primeira viagem internacional!',
  },
]
</script>

<template>
  <section id="depoimentos" class="bg-white py-12 md:py-24 px-6">
    <div class="max-w-2xl mx-auto">
      <!-- Section heading -->
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-12">
        Casos reais de quem já aplicou
      </h2>

      <!-- WhatsApp-style chat bubbles -->
      <div class="flex flex-col gap-6">
        <div
          v-for="(t, index) in testimonials"
          :key="t.name"
          :class="index % 2 === 0 ? 'ml-0 mr-auto' : 'ml-auto mr-0'"
          class="flex flex-col"
          style="max-width: min(85%, 400px);"
        >
          <!-- Chat bubble -->
          <div
            class="chat-bubble px-4 py-3 rounded-xl text-[var(--color-brand-text)] leading-relaxed"
            :class="index % 2 === 0 ? '' : 'chat-bubble-right'"
            style="background-color: #DCF8C6; word-break: break-word; overflow-wrap: anywhere;"
            v-html="t.text"
          />
          <!-- Name and city below bubble -->
          <div :class="index % 2 === 0 ? 'text-left' : 'text-right'" class="mt-1 px-1">
            <span class="text-sm font-semibold text-[var(--color-brand-primary)]">{{ t.name }}</span>
            <span class="text-xs text-[var(--color-brand-text-muted)] ml-2">{{ t.city }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.chat-bubble {
  position: relative;
}
.chat-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 8px solid #DCF8C6;
}
.chat-bubble-right::before {
  left: auto;
  right: -8px;
  border-right: none;
  border-left: 8px solid #DCF8C6;
}
</style>
