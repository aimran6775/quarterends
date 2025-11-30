import { CartItem } from '../types'

export const calculateOrderAmounts = (cart: CartItem[]) => {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal >= 200 ? 0 : 15
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    total,
    // Convert to cents for Stripe
    totalInCents: Math.round(total * 100)
  }
}

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const createPaymentIntent = async (amount: number, cartItems: CartItem[]) => {
  // This would typically call your backend API
  // For now, we'll use Stripe's client-side integration
  // In production, you should create payment intents on your server
  return {
    clientSecret: 'placeholder_client_secret',
    amount
  }
}
