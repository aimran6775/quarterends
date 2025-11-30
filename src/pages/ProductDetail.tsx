import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Product } from '../types'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getProductRecommendations } from '../utils/ai'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const fetchProduct = async () => {
    if (!id) return
    setLoading(true)
    try {
      const productDoc = await getDoc(doc(db, 'products', id))
      if (productDoc.exists()) {
        const productData = { id: productDoc.id, ...productDoc.data() } as Product
        setProduct(productData)
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0])
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    if (!id || !product) return
    try {
      // Fetch all products for AI recommendations
      const allProductsSnapshot = await getDocs(collection(db, 'products'))
      const allProducts = allProductsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      // Get AI-powered recommendations
      const recommendations = await getProductRecommendations(product, allProducts)
      
      if (recommendations.length > 0) {
        setRelatedProducts(recommendations)
      } else {
        // Fallback to category-based if AI fails
        const relatedQuery = query(
          collection(db, 'products'),
          where('category', '==', product.category),
          limit(4)
        )
        const snapshot = await getDocs(relatedQuery)
        const related = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
          .filter(p => p.id !== id)
        setRelatedProducts(related.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size')
      return
    }
    if (product.colors.length > 0 && !selectedColor) {
      alert('Please select a color')
      return
    }

    setAddingToCart(true)
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        size: selectedSize || 'N/A',
        color: selectedColor?.name || 'N/A',
        quantity
      })
      alert('✓ Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/shop" className="text-purple-600 hover:text-purple-700">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">[Product Image]</p>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-gray-200 rounded overflow-hidden hover:opacity-75 transition ${
                    selectedImage === idx ? 'ring-2 ring-gray-900' : ''
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <p className="text-2xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            {product.compareAtPrice && (
              <p className="text-xl text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="font-medium">Select Size</label>
                <button className="text-sm text-purple-600 hover:text-purple-700">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border-2 rounded py-3 font-medium transition ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="font-medium block mb-3">
                Color: {selectedColor?.name || 'Select'}
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition ${
                      selectedColor?.name === color.name
                        ? 'border-gray-900 ring-2 ring-purple-600'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label className="font-medium block mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded hover:border-gray-900 transition"
              >
                −
              </button>
              <span className="font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded hover:border-gray-900 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-gray-900 text-white py-4 rounded hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              onClick={handleWishlistToggle}
              className={`w-14 h-14 border-2 rounded transition flex items-center justify-center ${
                isInWishlist(product.id)
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 hover:border-gray-900'
              }`}
            >
              <svg 
                className="w-6 h-6" 
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            {product.material && (
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-medium">
                  <span>Product Details</span>
                  <svg className="w-5 h-5 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  <p>• Material: {product.material}</p>
                  <p>• Category: {product.category}</p>
                  {product.tags.length > 0 && (
                    <p>• Tags: {product.tags.join(', ')}</p>
                  )}
                </div>
              </details>
            )}

            {product.care && product.care.length > 0 && (
              <details className="group border-t border-gray-200 pt-4">
                <summary className="flex justify-between items-center cursor-pointer font-medium">
                  <span>Care Instructions</span>
                  <svg className="w-5 h-5 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  {product.care.map((instruction, idx) => (
                    <p key={idx}>• {instruction}</p>
                  ))}
                </div>
              </details>
            )}

            <details className="group border-t border-gray-200 pt-4">
              <summary className="flex justify-between items-center cursor-pointer font-medium">
                <span>Shipping & Returns</span>
                <svg className="w-5 h-5 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 text-sm text-gray-700 space-y-2">
                <p>• Free shipping on orders over $200</p>
                <p>• Standard delivery: 3-5 business days</p>
                <p>• Express delivery available</p>
                <p>• 30-day return policy</p>
                <p>• Free returns</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group">
                <Link to={`/product/${item.id}`}>
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400 text-xs">[Product Image]</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 capitalize">{item.category}</p>
                  <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail
