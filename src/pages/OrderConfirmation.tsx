import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { formatPrice } from '../utils/payment'
import type { Order } from '../types'

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found')
        setLoading(false)
        return
      }

      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId))
        
        if (!orderDoc.exists()) {
          setError('Order not found')
          return
        }

        const orderData = {
          id: orderDoc.id,
          ...orderDoc.data()
        } as Order

        setOrder(orderData)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'Unable to load order details'}</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg">
          Thank you for your purchase. Your order has been received.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Order Number:</span>
                <span className="ml-2 font-medium">#{order.id?.slice(-8).toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <span className="ml-2">
                  {order.createdAt?.toDate 
                    ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Payment:</span>
                <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.email && (
                <p className="mt-2">Email: {order.shippingAddress.email}</p>
              )}
              {order.shippingAddress.phone && (
                <p>Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div 
                key={index} 
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <img 
                  src={item.image || '/placeholder.jpg'} 
                  alt={item.productName}
                  className="w-20 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.productName}</h4>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} {item.color && `• Color: ${item.color}`}
                  </p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Email Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex gap-3">
          <svg 
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
          <div>
            <h3 className="font-semibold mb-1">Order Confirmation Sent</h3>
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to <strong>{order.shippingAddress.email}</strong> with your order details and tracking information once your order ships.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/shop"
          className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition text-center font-medium"
        >
          Continue Shopping
        </Link>
        <Link
          to="/profile"
          className="px-8 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-center font-medium"
        >
          View Order History
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation
