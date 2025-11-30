import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import { CartItem } from '../types'

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (item: CartItem) => Promise<void>
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      // Load cart from localStorage for non-authenticated users
      const localCart = localStorage.getItem('cart')
      if (localCart) {
        setCart(JSON.parse(localCart))
      }
      setLoading(false)
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return
    setLoading(true)
    try {
      const cartDoc = await getDoc(doc(db, 'carts', user.uid))
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items || [])
      } else {
        setCart([])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveCart = async (items: CartItem[]) => {
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), {
          userId: user.uid,
          items,
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }

  const addToCart = async (newItem: CartItem) => {
    const existingItemIndex = cart.findIndex(
      item => item.productId === newItem.productId && 
              item.size === newItem.size && 
              item.color === newItem.color
    )

    let updatedCart: CartItem[]
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += newItem.quantity
    } else {
      // Add new item
      updatedCart = [...cart, newItem]
    }

    setCart(updatedCart)
    await saveCart(updatedCart)
  }

  const removeFromCart = async (productId: string, size: string, color: string) => {
    const updatedCart = cart.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    )
    setCart(updatedCart)
    await saveCart(updatedCart)
  }

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color)
      return
    }

    const updatedCart = cart.map(item =>
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    )
    setCart(updatedCart)
    await saveCart(updatedCart)
  }

  const clearCart = async () => {
    setCart([])
    await saveCart([])
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
