<script setup lang="ts">
const { scrollTo } = useScroll()

const items = [
  { text: 'Como funcionam os <strong>principais programas de milhas</strong>', icon: 'i-heroicons-light-bulb' },
  { text: 'Formas inteligentes de <strong>acumular pontos</strong> sem gastar mais', icon: 'i-heroicons-arrow-trending-up' },
  { text: 'Quando vale (ou não) <strong>transferir pontos</strong>', icon: 'i-heroicons-arrows-right-left' },
  { text: 'Como encontrar <strong>passagens com milhas</strong> pagando muito menos', icon: 'i-heroicons-ticket' },
  { text: '<strong>Erros comuns</strong> que fazem as pessoas perderem milhas', icon: 'i-heroicons-exclamation-triangle' },
  { text: 'Estratégias para <strong>viagens nacionais e internacionais</strong>', icon: 'i-heroicons-globe-americas' },
  { text: 'Como usar o <strong>cartão de crédito</strong> a seu favor', icon: 'i-heroicons-credit-card' },
  { text: '<strong>Organização e planejamento</strong> de viagens com antecedência', icon: 'i-heroicons-calendar-days' },
]
</script>

<template>
  <section id="conteudo-programatico" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

      <!-- Left block: title, description, CTA -->
      <div class="flex flex-col gap-6">
        <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-[var(--color-brand-primary)]">
          Sem promessas milagrosas
        </h2>
        <p class="text-[var(--color-brand-text-muted)] leading-relaxed">
          O que você vai aprender na prática: um método simples e prático para você usar milhas do jeito certo e realmente economizar em viagens.
        </p>
        <div>
          <button
            class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg cursor-pointer transition-colors"
            @click="scrollTo('formulario')"
          >
            Quero entender melhor
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
          <span class="text-[var(--color-brand-text)]" v-html="item.text"></span>
        </div>
      </div>

    </div>
  </section>
</template>
