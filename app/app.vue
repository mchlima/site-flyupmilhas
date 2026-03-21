<script setup lang="ts">
// SEO meta tags — @nuxtjs/seo auto-imports useSeoMeta and useSchemaOrg
useSeoMeta({
  title: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
  description: 'Consultoria personalizada para acumular milhas e voar em classe executiva gastando menos.',
  ogTitle: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
  ogDescription: 'Consultoria personalizada para acumular milhas e voar em classe executiva gastando menos.',
  ogImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogType: 'website',
  ogUrl: 'https://flyupmilhas.com.br',
  ogLocale: 'pt_BR',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
  twitterDescription: 'Consultoria personalizada para acumular milhas e voar em classe executiva.',
  twitterImage: 'https://cdn.flyupmilhas.com.br/og-image.jpg',
})

// LocalBusiness schema.org structured data (per D-16, INFR-03)
useSchemaOrg([
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    name: 'Fly Up Milhas',
    description: 'Consultoria VIP em acúmulo e emissão estratégica de milhas aéreas',
    url: 'https://flyupmilhas.com.br',
    priceRange: 'R$200',
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
      <SectionMethod />
      <SectionSocialProof />
      <SectionPrice />
      <SectionFAQ />
      <section id="formulario" aria-label="Formulário de consultoria" class="py-16 px-6 bg-transparent">
        <SectionLeadForm />
      </section>
    </main>
    <AppFooter />
  </UApp>
</template>
