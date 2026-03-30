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

  routeRules: {
    '/admin/**': { ssr: false },
    '/pagamento/**': { ssr: false },
    '/encontros/**': { ssr: false },
  },

  devServer: {
    port: 3002,
    host: '0.0.0.0',
  },

  app: {
    htmlAttrs: {
      lang: 'pt-BR',
    },
  },

  site: {
    url: 'https://flyupmilhas.com.br',
    name: 'Fly Up Milhas — Consultoria VIP em Milhas Aéreas',
    defaultLocale: 'pt-BR',
    description: 'Consultoria personalizada em milhas aéreas. Voe em classe executiva gastando menos.',
  },

  runtimeConfig: {
    mongodbUri: '',
    mongodbDatabase: 'flyupmilhas',
    jwtSecret: '',
    asaasApiKey: '',
    asaasWebhookToken: '',
    public: {
      r2BaseUrl: '',
      asaasEnvironment: 'sandbox',
    },
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    inlineSSRStyles: true,
    treeshakeClientOnly: true,
  },

  vite: {
    server: {
      allowedHosts: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split Reka UI (accordion, form primitives) into lazy chunk
            if (id.includes('reka-ui')) {
              return 'reka-ui'
            }
          },
        },
      },
    },
  },

  image: {
    quality: 85,
    format: ['webp'],
  },

  fonts: {
    processCSSVariables: true,
    families: [
      {
        name: 'Plus Jakarta Sans',
        provider: 'google',
        global: true,
        weights: [400, 500, 600, 700],
        styles: ['normal'],
      }
    ]
  },
})
