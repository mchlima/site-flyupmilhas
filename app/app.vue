<script setup lang="ts">
// SEO meta tags — @nuxtjs/seo auto-imports useSeoMeta and useSchemaOrg
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

// LocalBusiness schema.org structured data (per D-16, INFR-03)
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
</script>

<template>
  <UApp>
    <AppHeader />
    <main id="main-content" class="pt-16">
      <SectionHero />
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
        <SectionLeadForm />
      </section>
    </main>
    <AppFooter />
    <BackToTop />
  </UApp>
</template>
