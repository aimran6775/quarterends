import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getProductById } from '../data/products'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { Product } from '../types'
import AnimatedText from '../components/3d/AnimatedText'
import ProductCard3D from '../components/3d/ProductCard3D'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlistProducts()
  }, [wishlist])

  const fetchWishlistProducts = () => {
    if (wishlist.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const productsData = wishlist
        .map(id => getProductById(id))
        .filter((p): p is Product => p !== undefined)
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching wishlist products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        size: product.sizes[0] || 'N/A',
        color: product.colors[0]?.name || 'N/A',
        quantity: 1
      })
      alert('✓ Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    }
  }

  if (wishlistLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-24"
        >
          <motion.svg
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-12 h-12 text-gray-200 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </motion.svg>
          <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-gray-400 mb-8">Save your favorite items for later</p>
          <Link
            to="/shop"
            className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <div className="flex justify-between items-baseline mb-12">
        <AnimatedText text="Wishlist" tag="h1" className="text-2xl font-medium tracking-tight" />
        <p className="text-sm text-gray-400">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35 }}
              className="group relative"
            >
              <ProductCard3D>
                <motion.button
                  onClick={() => removeFromWishlist(product.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <svg className="w-4 h-4 text-gray-300 hover:text-gray-900 transition" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.button>
                
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-[1.02] transition duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-300 text-xs">[Product Image]</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                    {product.compareAtPrice && (
                      <p className="text-xs text-gray-300 line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
                
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition"
                >
                  Add to Cart
                </motion.button>
              </ProductCard3D>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Wishlist
