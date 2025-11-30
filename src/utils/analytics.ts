import { logEvent } from 'firebase/analytics'
import { analytics } from '../config/firebase'

// E-commerce tracking events
export const trackPageView = (pageName: string) => {
  logEvent(analytics, 'page_view', {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname
  })
}

export const trackProductView = (productId: string, productName: string, price: number) => {
  logEvent(analytics, 'view_item', {
    items: [{
      item_id: productId,
      item_name: productName,
      price: price
    }]
  })
}

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => {
  logEvent(analytics, 'add_to_cart', {
    currency: 'USD',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  })
}

export const trackRemoveFromCart = (productId: string, productName: string, price: number, quantity: number) => {
  logEvent(analytics, 'remove_from_cart', {
    currency: 'USD',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  })
}

export const trackBeginCheckout = (items: any[], totalValue: number) => {
  logEvent(analytics, 'begin_checkout', {
    currency: 'USD',
    value: totalValue,
    items: items
  })
}

export const trackPurchase = (
  orderId: string,
  items: any[],
  totalValue: number,
  tax: number,
  shipping: number
) => {
  logEvent(analytics, 'purchase', {
    transaction_id: orderId,
    currency: 'USD',
    value: totalValue,
    tax: tax,
    shipping: shipping,
    items: items
  })
}

export const trackSearch = (searchTerm: string) => {
  logEvent(analytics, 'search', {
    search_term: searchTerm
  })
}

export const trackLogin = (method: string) => {
  logEvent(analytics, 'login', {
    method: method
  })
}

export const trackSignUp = (method: string) => {
  logEvent(analytics, 'sign_up', {
    method: method
  })
}

export const trackAddToWishlist = (productId: string, productName: string, price: number) => {
  logEvent(analytics, 'add_to_wishlist', {
    currency: 'USD',
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price
    }]
  })
}

export const trackChatbotInteraction = (question: string) => {
  logEvent(analytics, 'chatbot_interaction', {
    question: question
  })
}

export const trackVisualSearch = () => {
  logEvent(analytics, 'visual_search', {
    feature: 'ai_image_search'
  })
}
