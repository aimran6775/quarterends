import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById, mockProducts, getProductsByCategory } from '../data/products'
import { Product } from '../types'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getProductRecommendations } from '../utils/ai'
import ScrollReveal from '../components/3d/ScrollReveal'
import AnimatedText from '../components/3d/AnimatedText'
import ProductCard3D from '../components/3d/ProductCard3D'
import MagneticButton from '../components/3d/MagneticButton'

const infoChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

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

  const fetchProduct = () => {
    if (!id) return
    setLoading(true)
    try {
      const productData = getProductById(id)
      if (productData) {
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
      // Get AI-powered recommendations
      const recommendations = await getProductRecommendations(product, mockProducts)
      
      if (recommendations.length > 0) {
        setRelatedProducts(recommendations)
      } else {
        // Fallback to category-based
        const related = getProductsByCategory(product.category)
          .filter(p => p.id !== id)
          .slice(0, 4)
        setRelatedProducts(related)
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

  /* ---------- Loading skeleton ---------- */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            className="aspect-[3/4] bg-gray-100 rounded"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="space-y-6 pt-4">
            <motion.div className="h-8 bg-gray-100 rounded w-3/4" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} />
            <motion.div className="h-6 bg-gray-100 rounded w-1/4" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
            <motion.div className="h-4 bg-gray-100 rounded w-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
            <motion.div className="h-4 bg-gray-100 rounded w-5/6" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
            <motion.div className="h-10 bg-gray-100 rounded w-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
            <motion.div className="h-12 bg-gray-100 rounded w-full" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} />
          </div>
        </div>
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
      <motion.nav
        className="mb-8 flex items-center gap-2 text-xs text-gray-400"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Link to="/" className="hover:text-gray-900 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-900 transition">Shop</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </motion.nav>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Product Images */}
        <div>
          <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
            <AnimatePresence mode="wait">
              {product.images && product.images[selectedImage] ? (
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-[1.02] transition duration-500"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <p className="text-gray-300 text-xs">[Product Image]</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square bg-gray-50 overflow-hidden transition ${
                    selectedImage === idx ? 'ring-1 ring-gray-900' : 'hover:opacity-70'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Name — slides in from left */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={infoChildVariants}
          >
            <AnimatedText
              text={product.name}
              as="h1"
              className="text-2xl font-medium tracking-tight mb-3"
              mode="word"
            />
          </motion.div>

          {/* Price — fades up */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={infoChildVariants}
            className="flex items-baseline gap-3 mb-6"
          >
            <p className="text-lg text-gray-900">${product.price.toFixed(2)}</p>
            {product.compareAtPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </motion.div>

          {/* Description — fades in */}
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={infoChildVariants}
            className="text-sm text-gray-500 leading-relaxed mb-8"
          >
            {product.description}
          </motion.p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <motion.div custom={3} initial="hidden" animate="visible" variants={infoChildVariants} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs text-gray-900 uppercase tracking-widest">Size</label>
                <button className="text-xs text-gray-400 underline underline-offset-4 hover:text-gray-900 transition">Size Guide</button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ y: -2 }}
                    className={`border px-4 py-2 text-xs transition ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <motion.div custom={4} initial="hidden" animate="visible" variants={infoChildVariants} className="mb-6">
              <label className="text-xs text-gray-900 uppercase tracking-widest block mb-3">
                Color — <span className="normal-case tracking-normal text-gray-400">{selectedColor?.name || 'Select'}</span>
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    layout
                    whileHover={{ scale: 1.15 }}
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
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={infoChildVariants} className="mb-8">
            <label className="text-xs text-gray-900 uppercase tracking-widest block mb-3">Quantity</label>
            <div className="inline-flex items-center border border-gray-200">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"
              >
                −
              </motion.button>
              <span className="w-10 h-10 flex items-center justify-center text-sm border-x border-gray-200">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition"
              >
                +
              </motion.button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={infoChildVariants} className="flex gap-3 mb-8">
            <MagneticButton
              onClick={!addingToCart ? handleAddToCart : undefined}
              className={`flex-1 bg-gray-900 text-white py-3 text-sm tracking-wide hover:bg-gray-800 transition ${addingToCart ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {addingToCart ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border border-gray-500 border-t-white rounded-full animate-spin"></span>
                  Adding…
                </span>
              ) : 'Add to Cart'}
            </MagneticButton>

            <motion.button
              onClick={handleWishlistToggle}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 border transition flex items-center justify-center ${
                isInWishlist(product.id)
                  ? 'border-gray-900 text-gray-900'
                  : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              <motion.svg
                className="w-5 h-5"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={isInWishlist(product.id) ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </motion.svg>
            </motion.button>
          </motion.div>

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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed"
                >
                  <p>Material: {product.material}</p>
                  <p>Category: {product.category}</p>
                  {product.tags.length > 0 && (
                    <p>Tags: {product.tags.join(', ')}</p>
                  )}
                </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed"
                >
                  {product.care.map((instruction, idx) => (
                    <p key={idx}>{instruction}</p>
                  ))}
                </motion.div>
              </details>
            )}

            <details className="group border-b border-gray-100">
              <summary className="flex justify-between items-center cursor-pointer py-4 text-sm">
                <span className="text-gray-900">Shipping & Returns</span>
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="pb-4 text-xs text-gray-500 space-y-1.5 leading-relaxed"
              >
                <p>Free shipping on orders over $200</p>
                <p>Standard delivery: 3–5 business days</p>
                <p>Express delivery available</p>
                <p>30-day return policy</p>
                <p>Free returns</p>
              </motion.div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <ScrollReveal>
          <section className="mt-24 border-t border-gray-100 pt-12">
            <AnimatedText
              text="You may also like"
              as="h2"
              className="text-lg font-medium tracking-tight mb-8"
              mode="word"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <ProductCard3D>
                    <div className="group">
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
                  </ProductCard3D>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  )
}

export default ProductDetail
