import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface WishlistContextType {
  wishlist: string[]
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const localWishlist = localStorage.getItem('wishlist')
    if (localWishlist) {
      try {
        setWishlist(JSON.parse(localWishlist))
      } catch (e) {
        console.error('Error parsing wishlist from localStorage:', e)
      }
    }
    setLoading(false)
  }, [user])

  const addToWishlist = async (productId: string) => {
    if (wishlist.includes(productId)) return
    const updatedWishlist = [...wishlist, productId]
    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const removeFromWishlist = async (productId: string) => {
    const updatedWishlist = wishlist.filter(id => id !== productId)
    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
