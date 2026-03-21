<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section
    id="preco"
    class="bg-[var(--color-brand-primary)] py-12 md:py-24 px-6"
  >
    <div class="max-w-3xl mx-auto text-center">
      <!-- Pre-heading -->
      <p class="text-[var(--color-brand-cta)] text-sm font-semibold uppercase tracking-widest mb-4">
        Investimento
      </p>

      <!-- Value anchor (D-21) -->
      <p class="text-white/70 text-lg mb-2">
        Passagens executivas que custam R$3.000+ emitidas por uma fração do preço
      </p>

      <!-- Price display (D-20) -->
      <div class="flex items-end justify-center gap-1 mb-2">
        <span class="text-2xl text-white/60 font-light">R$</span>
        <span class="text-7xl md:text-8xl font-bold text-white leading-none">200</span>
      </div>

      <!-- Price clarification -->
      <p class="text-white/60 text-sm mt-2 mb-8">
        pagamento único — sem mensalidade, sem surpresas
      </p>

      <!-- What's included summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div class="text-center text-white/80 text-sm">
          2 reuniões online
        </div>
        <div class="text-center text-white/80 text-sm">
          1 mês acompanhamento
        </div>
        <div class="text-center text-white/80 text-sm">
          Plano personalizado
        </div>
      </div>

      <!-- CTA Button (D-20, D-03, D-22) -->
      <button
        class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-10 py-4 rounded-lg text-lg cursor-pointer transition-colors"
        @click="scrollTo('formulario')"
      >
        Quero minha Consultoria
      </button>
    </div>
  </section>
</template>
