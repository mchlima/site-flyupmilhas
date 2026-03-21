// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],

  ssr: true,

  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  site: {
    url: 'https://flyupmilhas.com.br',
    name: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
    defaultLocale: 'pt-BR',
    description: 'Consultoria personalizada em milhas aéreas. Voe em classe executiva gastando menos.',
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      r2BaseUrl: '',
    },
  },

  css: ['~/assets/css/main.css'],

  image: {
    quality: 85,
    format: ['webp'],
  },
})
