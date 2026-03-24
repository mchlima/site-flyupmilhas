<script setup lang="ts">
const { scrollTo } = useScroll()

const benefits = [
  { text: '3 encontros estratégicos (início, meio e fim)', icon: 'i-heroicons-video-camera' },
  { text: 'Suporte direto via WhatsApp', icon: 'i-heroicons-chat-bubble-left-right' },
  { text: 'Material prático para aplicação imediata', icon: 'i-heroicons-document-text' },
  { text: 'Plano personalizado para seu perfil', icon: 'i-heroicons-user-circle' },
]
</script>

<template>
  <section
    id="preco"
    class="bg-[var(--color-brand-primary)] py-12 md:py-24 px-6"
  >
    <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

      <!-- LEFT column: benefits list -->
      <div class="flex flex-col gap-6">
        <h2 class="text-2xl md:text-3xl font-bold text-white">
          Tudo o que você recebe na mentoria
        </h2>
        <div class="space-y-4">
          <div v-for="b in benefits" :key="b.text" class="flex items-start gap-3">
            <UIcon :name="b.icon" class="w-6 h-6 text-[var(--color-brand-cta)] shrink-0 mt-0.5" />
            <span class="text-white/90 text-base">{{ b.text }}</span>
          </div>
        </div>
      </div>

      <!-- RIGHT column: price card + guarantee -->
      <div>
        <!-- Price card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
          <p class="text-[var(--color-brand-text-muted)] text-sm font-medium mb-2">
            Comece hoje sua jornada com milhas
          </p>
          <p class="text-4xl md:text-5xl font-bold text-[var(--color-brand-primary)] mb-1">
            R$ 299,90
          </p>
          <p class="text-[var(--color-brand-text-muted)] text-base mb-6">
            no PIX ou até 10x no cartão
          </p>
          <button
            class="w-full bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
            @click="scrollTo('formulario')"
          >
            Quero entrar na mentoria
          </button>
        </div>

        <!-- Guarantee block -->
        <div class="mt-6 flex items-center gap-3 text-white/80">
          <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-[var(--color-brand-cta)] shrink-0" />
          <div>
            <p class="font-semibold text-white">Garantia de 7 dias</p>
            <p class="text-sm text-white/70">Se não fizer sentido pra você, devolvemos 100% do valor.</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
