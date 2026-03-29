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
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center py-20">
          <p className="text-sm text-gray-400 mb-3">Nothing here yet</p>
          <h1 className="text-2xl font-medium tracking-tight mb-6">Your cart is empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="text-sm text-gray-400 hover:text-gray-900 underline underline-offset-4 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const steps = [
    { num: 1, label: 'Shipping' },
    { num: 2, label: 'Payment' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <h1 className="text-2xl font-medium tracking-tight mb-10">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full transition-colors ${
                step >= s.num ? 'bg-gray-900' : 'bg-gray-200'
              }`} />
              <span className="text-xs text-gray-400 mt-2">{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-20 h-px mx-6 transition-colors ${
                step > s.num ? 'bg-gray-900' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-6">{error}</p>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="border border-gray-100 p-6">
              <h2 className="text-lg font-medium mb-6">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">First Name *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Last Name *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Email *</label>
                  <input 
                    type="email" 
                    required
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
                  <input 
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Street Address *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">City *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">State / Province</label>
                    <input 
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">ZIP Code *</label>
                    <input 
                      type="text" 
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Country *</label>
                    <select 
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gray-900 transition-colors bg-white"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 text-sm hover:bg-gray-800 transition-colors mt-4"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="border border-gray-100 p-6">
              <h2 className="text-lg font-medium mb-6">Payment Information</h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Shipping Address</label>
                  <div className="text-sm text-gray-500 py-3 border-b border-gray-100">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.street}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-400 hover:text-gray-900 mt-2 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Card Information</label>
                  <div className="border border-gray-200 px-3 py-2.5">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '14px',
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
                  <p className="text-xs text-gray-300 mt-2">
                    Test: 4242 4242 4242 4242 · Any future date · Any CVC
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full bg-gray-900 text-white py-3 text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(amounts.total)}`}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="text-sm text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Back to Shipping
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.size}{item.color && ` · ${item.color}`} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Subtotal</span>
                <span className="text-sm">{formatPrice(amounts.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Shipping</span>
                <span className="text-sm">
                  {amounts.shipping === 0 ? 'Free' : formatPrice(amounts.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Tax</span>
                <span className="text-sm">{formatPrice(amounts.tax)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(amounts.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
