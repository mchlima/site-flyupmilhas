<script setup lang="ts">
const faqItems = [
  {
    label: 'Funciona para quem gasta pouco no cartão?',
    content: 'Sim. Mesmo com R$1.500/mês em gastos, é possível acumular milhas suficientes para voos nacionais em menos de 1 ano. Na nossa reunião mapeamos seu perfil e definimos o ritmo ideal para o seu objetivo.',
  },
  {
    label: 'Preciso ter cartão premium para participar?',
    content: 'Não. Trabalho com cartões de diferentes categorias. O objetivo é otimizar o que você já tem e, se fizer sentido, indicar upgrades que compensem financeiramente.',
  },
  {
    label: 'E se eu não gostar da consultoria?',
    content: 'A primeira reunião é um diagnóstico detalhado. Se ao final dela você sentir que não foi o que esperava, conversamos — meu objetivo é que você saia com um plano claro e acionável.',
  },
  {
    label: 'Como funciona a reunião online?',
    content: 'Fazemos via Google Meet ou WhatsApp Video. Dura em média 1 hora. Você compartilha sua tela para vermos os programas juntos, e eu monto sua estratégia em tempo real.',
  },
  {
    label: 'Quanto tempo leva para ver resultado?',
    content: 'Depende do seu ritmo de gastos e objetivo. Resultados em milhas acumuladas aparecem no primeiro mês. Emissão de passagens executivas geralmente acontece entre 3 e 12 meses após a estratégia implementada.',
  },
  // TODO: replace with real Q&A from Marcio — add 1-2 more as needed
]
</script>

<template>
  <section
    id="faq"
    class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6"
  >
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-brand-primary)] text-center mb-4">
        Perguntas Frequentes
      </h2>
      <p class="text-[var(--color-brand-text-muted)] text-center mb-12">
        Tire suas dúvidas antes de decidir
      </p>

      <UAccordion :items="faqItems" />
    </div>
  </section>
</template>
