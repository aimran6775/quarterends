import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../config/firebase'
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
    if (user) {
      fetchWishlist()
    } else {
      // Load wishlist from localStorage for non-authenticated users
      const localWishlist = localStorage.getItem('wishlist')
      if (localWishlist) {
        setWishlist(JSON.parse(localWishlist))
      }
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return
    setLoading(true)
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setWishlist(userDoc.data().wishlist || [])
      } else {
        setWishlist([])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (wishlist.includes(productId)) return

    const updatedWishlist = [...wishlist, productId]
    setWishlist(updatedWishlist)

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          wishlist: arrayUnion(productId)
        })
      } catch (error) {
        console.error('Error adding to wishlist:', error)
        setWishlist(wishlist) // Revert on error
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    }
  }

  const removeFromWishlist = async (productId: string) => {
    const updatedWishlist = wishlist.filter(id => id !== productId)
    setWishlist(updatedWishlist)

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          wishlist: arrayRemove(productId)
        })
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        setWishlist(wishlist) // Revert on error
      }
    } else {
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    }
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
