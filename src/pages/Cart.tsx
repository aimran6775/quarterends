import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start adding some items to your cart</p>
          <Link
            to="/shop"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-600 hover:text-red-600 transition"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-6 pb-6 border-b border-gray-200">
              <Link to={`/product/${item.productId}`} className="w-32 h-40 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400 text-xs">[Product]</p>
                  </div>
                )}
              </Link>
              
              <div className="flex-1">
                <Link to={`/product/${item.productId}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-2">
                  {item.size !== 'N/A' && `Size: ${item.size}`}
                  {item.size !== 'N/A' && item.color !== 'N/A' && ' | '}
                  {item.color !== 'N/A' && `Color: ${item.color}`}
                </p>
                <p className="font-semibold text-gray-900 mb-4">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:border-gray-900 transition"
                    >
                      −
                    </button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded hover:border-gray-900 transition"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                  
                  <div className="ml-auto">
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-900 text-white py-4 rounded hover:bg-gray-800 transition font-medium mb-4"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/shop"
              className="block w-full text-center border-2 border-gray-300 py-3 rounded hover:border-gray-900 transition font-medium"
            >
              Continue Shopping
            </Link>

            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>
                  {shipping === 0 
                    ? 'You qualify for free shipping!' 
                    : `Add $${(200 - subtotal).toFixed(2)} more for free shipping`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
