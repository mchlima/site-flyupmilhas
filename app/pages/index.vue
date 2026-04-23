<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const isComingSoon = computed(() => Boolean(config.public.comingSoon))

// Coming-soon: minimal meta, noindex. Real landing: full SEO stack.
if (isComingSoon.value) {
  useSeoMeta({
    title: 'Fly Up Milhas — Em breve',
    description: 'Algo novo está decolando. Volte em breve.',
    robots: 'noindex, nofollow',
    ogTitle: 'Fly Up Milhas — Em breve',
    ogDescription: 'Algo novo está decolando. Volte em breve.',
  })
}
else {
  useSeoMeta({
    title: 'Fly Up Milhas — Mentoria em Milhas Aéreas',
    description: 'Mentoria para aprender a acumular milhas e voar em classe executiva gastando menos.',
    ogTitle: 'Fly Up Milhas — Mentoria em Milhas Aéreas',
    ogDescription: 'Mentoria para aprender a acumular milhas e voar em classe executiva gastando menos.',
    ogImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogType: 'website',
    ogUrl: 'https://flyupmilhas.com.br',
    ogLocale: 'pt_BR',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Fly Up Milhas — Mentoria em Milhas Aéreas',
    twitterDescription: 'Mentoria para aprender a acumular milhas e voar em classe executiva.',
    twitterImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
  })

  useSchemaOrg([
    defineLocalBusiness({
      '@type': 'ProfessionalService',
      name: 'Fly Up Milhas',
      description: 'Mentoria em acúmulo e emissão estratégica de milhas aéreas',
      url: 'https://flyupmilhas.com.br',
      areaServed: {
        '@type': 'Country',
        name: 'Brasil',
      },
      knowsAbout: ['milhas aéreas', 'passagens executivas', 'programas de fidelidade'],
    }),
  ])
}
</script>

<template>
  <ComingSoon v-if="isComingSoon" />
  <div v-else>
    <AppHeader />
    <main id="main-content" class="pt-16">
      <SectionHero />
      <SectionMarketTicker />
      <SectionAbout />
      <SectionProgramContent />
      <SectionForWhom />
      <SectionMethod />
      <SectionProvas />
      <SectionSocialProof />
      <SectionPrice />
      <SectionGuarantee />
      <SectionFAQ />
      <section id="formulario" aria-label="Formulário de mentoria" class="gradient-form py-16 px-6">
        <SectionCustomerForm />
      </section>
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>
