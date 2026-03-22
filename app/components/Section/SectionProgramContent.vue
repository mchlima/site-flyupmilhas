<script setup lang="ts">
const { scrollTo } = useScroll()

const items = [
  { text: 'Como funcionam os principais programas de milhas', icon: 'i-heroicons-light-bulb' },
  { text: 'Formas inteligentes de acumular pontos sem gastar mais', icon: 'i-heroicons-arrow-trending-up' },
  { text: 'Quando vale (ou não) transferir pontos', icon: 'i-heroicons-arrows-right-left' },
  { text: 'Como encontrar passagens com milhas pagando muito menos', icon: 'i-heroicons-ticket' },
  { text: 'Erros comuns que fazem as pessoas perderem milhas', icon: 'i-heroicons-exclamation-triangle' },
  { text: 'Estratégias para viagens nacionais e internacionais', icon: 'i-heroicons-globe-americas' },
  { text: 'Como usar o cartão de crédito a seu favor', icon: 'i-heroicons-credit-card' },
  { text: 'Organização e planejamento de viagens com antecedência', icon: 'i-heroicons-calendar-days' },
]
</script>

<template>
  <section id="conteudo-programatico" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

      <!-- Left block: title, description, CTA -->
      <div class="flex flex-col gap-6">
        <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)]">
          O que você vai aprender na prática
        </h2>
        <p class="text-[var(--color-brand-text-muted)] leading-relaxed">
          Aqui você não recebe promessas irreais. Você aprende o que funciona, quando funciona e como aplicar na sua realidade.
        </p>
        <div>
          <button
            class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg cursor-pointer transition-colors"
            @click="scrollTo('formulario')"
          >
            Quero dar o primeiro passo
          </button>
        </div>
      </div>

      <!-- Right block: 8 learning items -->
      <div class="flex flex-col gap-4">
        <div
          v-for="item in items"
          :key="item.text"
          class="flex items-start gap-3"
        >
          <UIcon :name="item.icon" class="w-6 h-6 text-[var(--color-brand-cta)] shrink-0 mt-0.5" />
          <span class="text-[var(--color-brand-text)]">{{ item.text }}</span>
        </div>
      </div>

    </div>
  </section>
</template>
