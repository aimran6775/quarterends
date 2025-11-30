import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { calculateOrderAmounts, formatPrice } from '../utils/payment'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Address } from '../types'

const Checkout = () => {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const { cart, clearCart, cartTotal } = useCart()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [shippingInfo, setShippingInfo] = useState<Address>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  })

  // Calculate order amounts
  const amounts = calculateOrderAmounts(cart)

  const handleShippingSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Validate shipping info
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.street || !shippingInfo.city || !shippingInfo.zipCode) {
      setError('Please fill in all required fields')
      return
    }

    setError(null)
    setStep(2)
  }

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet')
      return
    }

    if (cart.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: {
            line1: shippingInfo.street,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postal_code: shippingInfo.zipCode,
            country: shippingInfo.country === 'United States' ? 'US' : 'CA'
          }
        }
      })

      if (pmError) {
        throw new Error(pmError.message)
      }

      // Create payment intent (in production, this should be done on the backend)
      // For now, we'll simulate the payment and create the order
      
      // Create order in Firestore
      const orderData = {
        userId: user?.uid || 'guest',
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        shippingAddress: shippingInfo,
        subtotal: amounts.subtotal,
        shippingCost: amounts.shipping,
        tax: amounts.tax,
        total: amounts.total,
        paymentMethod: {
          type: 'card',
          last4: paymentMethod?.card?.last4 || 'xxxx',
          brand: paymentMethod?.card?.brand || 'unknown'
        },
        paymentStatus: 'paid',
        orderStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const orderRef = await addDoc(collection(db, 'orders'), orderData)

      // Clear cart after successful order
      await clearCart()

      // Navigate to success page
      navigate(`/order-confirmation/${orderRef.id}`)

    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'An error occurred during payment')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart to checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[
          { num: 1, label: 'Shipping' },
          { num: 2, label: 'Payment' }
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s.num 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {s.num}
              </div>
              <span className="text-sm mt-2">{s.label}</span>
            </div>
            {idx < 1 && (
              <div className={`w-24 h-1 mx-4 ${
                step > s.num ? 'bg-gray-900' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input 
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Province</label>
                    <input 
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <select 
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition font-medium mt-6"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.street}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-900 underline mt-2"
                  >
                    Edit Address
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Card Information</label>
                  <div className="border border-gray-300 rounded px-4 py-3">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#111827',
                            '::placeholder': {
                              color: '#9CA3AF'
                            }
                          },
                          invalid: {
                            color: '#EF4444'
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="flex-1 border-2 border-gray-300 py-3 rounded hover:border-gray-900 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(amounts.total)}`}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      Size: {item.size} {item.color && `• ${item.color}`}
                    </p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-300 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(amounts.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {amounts.shipping === 0 ? 'Free' : formatPrice(amounts.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-semibold">{formatPrice(amounts.tax)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">{formatPrice(amounts.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
