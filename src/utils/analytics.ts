// Analytics stub - Firebase removed

export const trackPageView = (pageName: string) => {
  console.log('[Analytics] page_view:', pageName)
}

export const trackProductView = (productId: string, productName: string, price: number) => {
  console.log('[Analytics] view_item:', productId, productName, price)
}

export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => {
  console.log('[Analytics] add_to_cart:', productId, productName, price, quantity)
}

export const trackRemoveFromCart = (productId: string, productName: string, price: number, quantity: number) => {
  console.log('[Analytics] remove_from_cart:', productId, productName, price, quantity)
}

export const trackBeginCheckout = (items: any[], totalValue: number) => {
  console.log('[Analytics] begin_checkout:', items.length, 'items, total:', totalValue)
}

export const trackPurchase = (
  orderId: string,
  items: any[],
  totalValue: number,
  tax: number,
  shipping: number
) => {
  console.log('[Analytics] purchase:', orderId, totalValue)
}

export const trackSearch = (searchTerm: string) => {
  console.log('[Analytics] search:', searchTerm)
}

export const trackLogin = (method: string) => {
  console.log('[Analytics] login:', method)
}

export const trackSignUp = (method: string) => {
  console.log('[Analytics] sign_up:', method)
}

export const trackAddToWishlist = (productId: string, productName: string, price: number) => {
  console.log('[Analytics] add_to_wishlist:', productId, productName, price)
}

export const trackChatbotInteraction = (question: string) => {
  console.log('[Analytics] chatbot_interaction:', question)
}

export const trackVisualSearch = () => {
  console.log('[Analytics] visual_search')
}
