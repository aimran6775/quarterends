import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import { Product } from '../types'

const Wishlist = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlistProducts()
  }, [wishlist])

  const fetchWishlistProducts = async () => {
    if (wishlist.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const productPromises = wishlist.map(id => getDoc(doc(db, 'products', id)))
      const productDocs = await Promise.all(productPromises)
      const productsData = productDocs
        .filter(doc => doc.exists())
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-3xl font-serif font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save your favorite items for later</p>
          <Link
            to="/shop"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">My Wishlist</h1>
        <p className="text-gray-600">{products.length} {products.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 z-10 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-md"
            >
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            
            <Link to={`/product/${product.id}`}>
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400 text-xs">[Product Image]</p>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2 capitalize">{product.category}</p>
              <div className="flex items-center gap-2 mb-3">
                <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                {product.compareAtPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
            
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition text-sm font-medium"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
