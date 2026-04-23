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
    '@vercel/analytics',
    '@vercel/speed-insights',
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
    head: {
      script: [
        // Google tag (gtag.js) — loader
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-HNPWG94BEE',
          async: true,
        },
        // Google tag (gtag.js) — init
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HNPWG94BEE');`,
        },
      ],
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
      asaasEnvironment: 'sandbox',
      comingSoon: true,
    },
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    inlineSSRStyles: true,
    treeshakeClientOnly: true,
  },

  vite: {
    optimizeDeps: {
      include: [
        'zod',
      ],
    },
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
