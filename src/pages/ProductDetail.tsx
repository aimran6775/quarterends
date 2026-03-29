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
        <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 text-center">
        <h1 className="text-2xl font-medium tracking-tight mb-4">Product not found</h1>
        <Link to="/shop" className="text-sm text-gray-400 underline underline-offset-4 hover:text-gray-900 transition">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Breadcrumb back link */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-900 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-900 transition">Shop</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Product Images */}
        <div>
          <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-[1.02] transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-300 text-xs">[Product Image]</p>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-gray-50 overflow-hidden transition ${
                    selectedImage === idx ? 'ring-1 ring-gray-900' : 'hover:opacity-70'
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
          <h1 className="text-2xl font-medium tracking-tight mb-3">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mb-6">
            <p className="text-lg text-gray-900">${product.price.toFixed(2)}</p>
            {product.compareAtPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs text-gray-900 uppercase tracking-widest">Size</label>
                <button className="text-xs text-gray-400 underline underline-offset-4 hover:text-gray-900 transition">Size Guide</button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 text-xs transition ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-900'
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
              <label className="text-xs text-gray-900 uppercase tracking-widest block mb-3">
                Color — <span className="normal-case tracking-normal text-gray-400">{selectedColor?.name || 'Select'}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full transition ${
                      selectedColor?.name === color.name
                        ? 'ring-1 ring-gray-900 ring-offset-2'
                        : 'ring-1 ring-gray-200 hover:ring-gray-400'
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
            <label className="text-xs text-gray-900 uppercase tracking-widest block mb-3">Quantity</label>
            <div className="inline-flex items-center border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"
              >
                −
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm border-x border-gray-200">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-gray-900 text-white py-3 text-sm tracking-wide hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border border-gray-500 border-t-white rounded-full animate-spin"></span>
                  Adding…
                </span>
              ) : 'Add to Cart'}
            </button>
            <button 
              onClick={handleWishlistToggle}
              className={`w-12 h-12 border transition flex items-center justify-center ${
                isInWishlist(product.id)
                  ? 'border-gray-900 text-gray-900'
                  : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-100 pt-6 space-y-0">
            {product.material && (
              <details className="group border-b border-gray-100">
                <summary className="flex justify-between items-center cursor-pointer py-4 text-sm">
                  <span className="text-gray-900">Product Details</span>
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed">
                  <p>Material: {product.material}</p>
                  <p>Category: {product.category}</p>
                  {product.tags.length > 0 && (
                    <p>Tags: {product.tags.join(', ')}</p>
                  )}
                </div>
              </details>
            )}

            {product.care && product.care.length > 0 && (
              <details className="group border-b border-gray-100">
                <summary className="flex justify-between items-center cursor-pointer py-4 text-sm">
                  <span className="text-gray-900">Care Instructions</span>
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed">
                  {product.care.map((instruction, idx) => (
                    <p key={idx}>{instruction}</p>
                  ))}
                </div>
              </details>
            )}

            <details className="group border-b border-gray-100">
              <summary className="flex justify-between items-center cursor-pointer py-4 text-sm">
                <span className="text-gray-900">Shipping & Returns</span>
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed">
                <p>Free shipping on orders over $200</p>
                <p>Standard delivery: 3–5 business days</p>
                <p>Express delivery available</p>
                <p>30-day return policy</p>
                <p>Free returns</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-gray-100 pt-12">
          <h2 className="text-lg font-medium tracking-tight mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div key={item.id} className="group">
                <Link to={`/product/${item.id}`}>
                  <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-300 text-xs">[Product Image]</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm text-gray-900 mb-0.5 group-hover:underline underline-offset-4 transition">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-1 capitalize">{item.category}</p>
                  <p className="text-sm text-gray-900">${item.price.toFixed(2)}</p>
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
