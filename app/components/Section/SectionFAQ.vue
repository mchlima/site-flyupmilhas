<script setup lang="ts">
const faqItems = [
  {
    label: 'Quanto custa a mentoria?',
    content: 'O investimento é de R$ 299,90 no PIX ou até 10x no cartão. Você tem 3 encontros individuais ao longo de 30 dias, suporte via WhatsApp e material de apoio. E se não ficar satisfeito, tem garantia de 7 dias com reembolso total.',
  },
  {
    label: 'Funciona para quem está começando do zero?',
    content: 'Sim, a mentoria foi criada exatamente para isso. Você não precisa entender de milhas, pontos ou programas de fidelidade. No primeiro encontro, mapeamos tudo o que você já tem e montamos sua estratégia do zero.',
  },
  {
    label: 'Preciso ter cartão premium ou renda alta?',
    content: 'Não. Trabalhamos com o que você já tem — qualquer cartão de crédito que acumule pontos já é um ponto de partida. A estratégia é adaptada à sua realidade financeira.',
  },
  {
    label: 'Quanto tempo leva para ver resultado?',
    content: 'Você já sai do primeiro encontro com um plano claro. Resultados em milhas acumuladas aparecem no primeiro mês. Emissões de passagens com economia real acontecem entre 3 e 12 meses, dependendo do seu perfil de gastos e destino desejado.',
  },
  {
    label: 'E se eu não gostar? Tem garantia?',
    content: 'Sim. Você tem 7 dias de garantia incondicional. Se sentir que a mentoria não é para você, devolvemos 100% do valor investido, sem burocracia.',
  },
  {
    label: 'Como funciona o pagamento?',
    content: 'Após preencher o formulário, nossa equipe entra em contato pelo WhatsApp em até 24h para agendar seu primeiro encontro. O pagamento é feito antes do início, via PIX ou cartão de crédito em até 10x.',
  },
]
</script>

<template>
  <section
    id="faq"
    class="bg-[var(--color-brand-bg)] py-12 md:py-24 px-6"
  >
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl md:text-3xl font-semibold tracking-[-0.015em] text-brand-primary text-center mb-4">
        Perguntas Frequentes
      </h2>
      <p class="text-brand-text-muted text-center mb-12">
        Tire suas dúvidas antes de decidir
      </p>

      <div class="space-y-4">
        <UAccordion
          :items="faqItems"
          :ui="{
            trigger: 'group flex-1 flex items-center gap-4 font-semibold text-base py-4 px-5 bg-white rounded-xl min-w-0 text-brand-text focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-primary)]',
            label: 'text-start break-words font-semibold text-base text-brand-text',
            content: 'bg-white rounded-b-xl -mt-2 pt-0'
          }"
        >
          <template #leading="{ index }">
            <span class="text-lg font-bold text-brand-primary tabular-nums shrink-0">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </template>

          <template #content="{ item }">
            <p class="text-brand-text-muted text-sm leading-relaxed pb-4 px-5 pl-14">
              {{ item.content }}
            </p>
          </template>
        </UAccordion>
      </div>
    </div>
  </section>
</template>
