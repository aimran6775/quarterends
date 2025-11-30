// User types
export interface User {
  id?: string
  uid: string
  email: string
  displayName: string
  photoURL?: string
  phone?: string
  role: 'admin' | 'user'
  createdAt: string
  wishlist: string[]
  addresses: Address[]
}

export interface Address {
  id?: string
  firstName?: string
  lastName?: string
  fullName?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  street: string
  city: string
  state: string
  zip?: string
  zipCode?: string
  country: string
  isDefault?: boolean
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: Color[]
  material: string
  care: string[]
  inventory: {
    S?: number
    M?: number
    L?: number
    XL?: number
    [key: string]: number | undefined // key format: "size-color"
  }
  featured: boolean
  newArrival: boolean
  bestseller: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Color {
  name: string
  hex: string
}

// Cart types
export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Cart {
  userId: string
  items: CartItem[]
  updatedAt: string
}

// Order types
export interface Order {
  id?: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping?: number
  shippingCost?: number
  total: number
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod?: string | { type: string; last4: string; brand: string }
  paymentIntentId?: string
  paymentStatus?: string
  orderStatus?: string
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt?: any
  updatedAt?: any
  trackingNumber?: string
}

export interface OrderItem extends CartItem {
  productSnapshot: Partial<Product>
  productName?: string
}

// Review types
export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
}

// Settings types
export interface Settings {
  homepage: {
    hero: {
      title: string
      subtitle: string
      image: string
      cta: {
        text: string
        link: string
      }
    }
    featured: string[]
    banners: Banner[]
  }
  shipping: {
    freeShippingThreshold: number
    rates: ShippingRate[]
  }
}

export interface Banner {
  id: string
  image: string
  title: string
  link: string
  active: boolean
}

export interface ShippingRate {
  country: string
  rate: number
  estimatedDays: string
}
