/// <reference types="vite/client" />
import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublicKey) {
  throw new Error('Stripe publishable key is not defined in environment variables')
}

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey)
  }
  return stripePromise
}

export { stripePublicKey }
