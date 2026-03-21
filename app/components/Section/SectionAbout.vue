<script setup lang="ts">
const { scrollTo } = useScroll()
</script>

<template>
  <section id="sobre" class="bg-white py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-4">
        Sobre a Fly Up Milhas
      </h2>
      <p class="text-[var(--color-brand-text-muted)] text-center mb-10">
        Especialistas em transformar gastos do dia a dia em voos executivos e renda extra
      </p>

      <!-- Bento grid layout per D-22 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        <!-- Hero card: spans 2 cols on md+, navy background per D-06 -->
        <div class="md:col-span-2 rounded-xl bg-[var(--color-brand-primary)] text-white p-8">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">
            Viaje mais. Gaste menos. Ganhe com as suas milhas.
          </h3>
          <p class="text-white/80 leading-relaxed">
            <!-- TODO: replace with final copy from Marcio -->
            A Fly Up Milhas existe para transformar seus gastos do dia a dia em passagens executivas e renda extra. Trabalhamos com estratégias personalizadas para cada perfil — seja você um profissional que viaja a trabalho, uma família buscando economia, ou alguém interessado em gerar renda com milhas.
          </p>
        </div>

        <!-- Value prop 1: Viagens Executivas — 1x1 white card per D-07 -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-paper-airplane" class="w-8 h-8 text-[var(--color-brand-primary)] mb-3" />
          <h3 class="text-base font-bold text-[var(--color-brand-primary)] mb-2">Viagens Executivas</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Voe de classe executiva para Europa, Ásia e Américas pagando uma fração do preço de tabela.
          </p>
        </div>

        <!-- Value prop 2: Economia Familiar — 1x1 white card -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-banknotes" class="w-8 h-8 text-[var(--color-brand-primary)] mb-3" />
          <h3 class="text-base font-bold text-[var(--color-brand-primary)] mb-2">Economia Familiar</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Transforme gastos do dia a dia em milhas e economize milhares de reais em passagens para toda a família.
          </p>
        </div>

        <!-- Value prop 3: Renda Extra — 1x1 white card, SAME SIZE as other two per CONT-02, D-20 -->
        <div class="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <UIcon name="i-heroicons-banknotes" class="w-8 h-8 text-[var(--color-brand-cta)] mb-3" />
          <h3 class="text-base font-bold text-[var(--color-brand-primary)] mb-2">Renda Extra com Milhas</h3>
          <p class="text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
            Aprenda a gerar renda extra comprando e vendendo milhas de forma estratégica e segura.
          </p>
        </div>

      </div>

      <!-- CTA below grid -->
      <div class="text-center mt-8">
        <button
          class="bg-[var(--color-brand-cta)] hover:bg-[var(--color-brand-cta-hover)] text-white font-semibold px-8 py-4 rounded-lg text-lg cursor-pointer transition-colors"
          @click="scrollTo('formulario')"
        >
          Quero minha Consultoria
        </button>
      </div>
    </div>
  </section>
</template>
