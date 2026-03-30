import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import ScrollReveal from '../components/3d/ScrollReveal'
import AnimatedText from '../components/3d/AnimatedText'
import MagneticButton from '../components/3d/MagneticButton'

const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, loading } = useCart()
  const navigate = useNavigate()

  const subtotal = cartTotal
  const shipping = subtotal >= 200 ? 0 : 15
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-5 h-5 border border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <motion.div
          className="text-center py-24"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <svg className="w-[18px] h-[18px] text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm text-gray-400 mb-6">Your cart is empty</p>
          <Link to="/shop" className="text-sm text-gray-400 underline hover:text-gray-900 transition-colors">
            Continue shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <div className="flex justify-between items-baseline mb-12">
        <AnimatedText text="Cart" tag="h1" className="text-2xl font-medium tracking-tight" />
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}-${item.color}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="flex gap-6 py-6 border-b border-gray-100"
              >
                <Link to={`/product/${item.productId}`} className="w-24 h-28 bg-gray-50 flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-300 text-xs">—</p>
                    </div>
                  )}
                </Link>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.size !== 'N/A' && `Size: ${item.size}`}
                      {item.size !== 'N/A' && item.color !== 'N/A' && ' · '}
                      {item.color !== 'N/A' && `Color: ${item.color}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-200 text-xs text-gray-500 hover:border-gray-400 transition-colors"
                        >
                          −
                        </motion.button>
                        <span className="text-xs w-8 text-center">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-200 text-xs text-gray-500 hover:border-gray-400 transition-colors"
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ color: '#111' }}
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-xs text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        Remove
                      </motion.button>
                    </div>
                    <p className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <ScrollReveal direction="right">
            <div className="border border-gray-100 p-6 sticky top-24">
              <h2 className="text-sm font-medium mb-6">Order summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <motion.span key={subtotal.toFixed(2)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-900">${subtotal.toFixed(2)}</motion.span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Shipping</span>
                  <motion.span key={shipping.toFixed(2)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</motion.span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Tax</span>
                  <motion.span key={tax.toFixed(2)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-900">${tax.toFixed(2)}</motion.span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-base font-medium">Total</span>
                  <motion.span key={total.toFixed(2)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base font-medium">${total.toFixed(2)}</motion.span>
                </div>
              </div>

              <MagneticButton>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gray-900 text-white py-3 text-sm hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </MagneticButton>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-gray-400 underline hover:text-gray-900 transition-colors">
                  Continue shopping
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-6 text-center">
                {shipping === 0
                  ? 'Free shipping applied'
                  : `$${(200 - subtotal).toFixed(2)} away from free shipping`}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}

export default Cart
