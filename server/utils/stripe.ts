import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance

  const config = useRuntimeConfig()
  if (!config.stripeSecretKey) {
    throw new Error('NUXT_STRIPE_SECRET_KEY is not set')
  }

  stripeInstance = new Stripe(config.stripeSecretKey)
  return stripeInstance
}
