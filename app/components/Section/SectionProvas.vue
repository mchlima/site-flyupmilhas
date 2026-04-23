<script setup lang="ts">
import prova1 from '~/assets/img/provas/prova1.webp'
import prova2 from '~/assets/img/provas/prova2.webp'
import prova3 from '~/assets/img/provas/prova3.webp'
import prova4 from '~/assets/img/provas/prova4.webp'
import prova5 from '~/assets/img/provas/prova5.webp'

const cards = [
  {
    tag: 'Europa',
    companhia: 'Latam',
    rota: 'São Paulo → Lisboa',
    info: 'Direto',
    classe: 'Classe econômica — Latam Pass',
    duracao: '9h40 de voo',
    milhas: '57.903 milhas + taxas',
    equivalente: 'R$ 1.254',
    economia: '55,98%',
    imagem: prova1,
  },
  {
    tag: 'Europa',
    companhia: 'Latam',
    rota: 'São Paulo → Madrid',
    info: 'Direto',
    classe: 'Classe econômica — Latam Pass',
    duracao: '10h de voo',
    milhas: '50.303 milhas + taxas',
    equivalente: 'R$ 1.100',
    economia: '70%',
    imagem: prova2,
  },
  {
    tag: 'EUA',
    companhia: 'Latam',
    rota: 'Belo Horizonte → Orlando',
    info: '1 parada',
    classe: 'Classe econômica — Latam Pass',
    duracao: '12h35 de voo',
    milhas: '30.474 milhas + taxas',
    equivalente: 'R$ 660',
    economia: 'até 80%',
    imagem: prova3,
  },
  {
    tag: 'Nacional',
    companhia: 'Latam',
    rota: 'Brasília → Rio de Janeiro',
    info: 'Direto',
    classe: 'Classe econômica — Latam Pass',
    duracao: '1h40 de voo',
    milhas: '6.372 pontos + taxas',
    equivalente: 'R$ 95',
    economia: 'até 56%',
    imagem: prova4,
  },
  {
    tag: 'Nacional',
    companhia: 'Azul',
    rota: 'Recife → Maceió',
    info: 'Direto',
    classe: 'Classe econômica — Azul Fidelidade',
    duracao: '50 min de voo',
    milhas: '8.000 milhas + taxas',
    equivalente: 'R$ 120',
    economia: 'até 94%',
    imagem: prova5,
  },
]
</script>

<template>
  <section id="provas" class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Section heading -->
      <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-brand-primary text-center mb-4">
        <strong>Exemplos reais de passagens emitidas com milhas</strong>
      </h2>
      <p class="text-center text-brand-text-muted mb-12 max-w-lg mx-auto">
        Veja na prática como é possível pagar muito menos usando milhas.
      </p>

      <!-- Cards carousel -->
      <UCarousel
        v-slot="{ item }"
        :items="cards"
        :ui="{ item: 'basis-full lg:basis-1/3 pl-4' }"
        arrows
        dots
        class="lg:-mx-4"
      >
        <div
          class="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
        >
          <!-- Proof image -->
          <img
            :src="item.imagem"
            :alt="`Comprovante: ${item.rota}`"
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            class="w-full h-auto object-contain"
          />

          <!-- Card content -->
          <div class="p-5 flex flex-col flex-1">
            <!-- Tags -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-brand-primary">
                {{ item.tag }}
              </span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-brand-text-muted">
                {{ item.companhia }}
              </span>
            </div>

            <!-- Route -->
            <h3 class="text-lg font-semibold text-brand-primary mb-1">
              {{ item.rota }}
            </h3>

            <!-- Flight details -->
            <div class="text-sm text-brand-text-muted space-y-0.5 mb-4">
              <p>{{ item.classe }}</p>
              <p>{{ item.duracao }} · {{ item.info }}</p>
            </div>

            <!-- Miles & savings -->
            <div class="mt-auto pt-4 border-t border-gray-100">
              <p class="text-sm font-bold text-brand-primary">
                {{ item.milhas }}
              </p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-sm text-brand-text-muted">
                  Equivalente: <strong class="text-brand-text">{{ item.equivalente }}</strong>
                </span>
                <span class="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  -{{ item.economia }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </UCarousel>

      <!-- Impact phrase -->
      <p class="text-center text-brand-text-muted mt-12 max-w-2xl mx-auto leading-relaxed">
        Esses são apenas alguns exemplos. Com a estratégia certa, é possível encontrar oportunidades
        ainda melhores, inclusive para voos internacionais e classe executiva.
      </p>

      <!-- Disclaimer -->
      <p class="text-center text-xs text-brand-text-muted/60 mt-4 italic">
        Valores variam conforme data e disponibilidade.
      </p>
    </div>
  </section>
</template>
