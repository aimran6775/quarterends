/// <reference types="vite/client" />
import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublicKey) {
  console.warn('Stripe publishable key is not defined in environment variables. Payments will not work.')
}

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : Promise.resolve(null)
  }
  return stripePromise
}

export { stripePublicKey }
