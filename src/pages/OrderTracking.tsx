import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { formatPrice } from '../utils/payment'
import type { Order } from '../types'

interface TrackingStep {
  status: string
  label: string
  date?: Date
  completed: boolean
}

const OrderTracking = () => {
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

  const getTrackingSteps = (order: Order): TrackingStep[] => {
    const currentStatus = order.orderStatus || order.status || 'pending'
    const orderDate = order.createdAt?.toDate ? new Date(order.createdAt.toDate()) : new Date()
    
    const steps: TrackingStep[] = [
      {
        status: 'pending',
        label: 'Order Placed',
        date: orderDate,
        completed: true
      },
      {
        status: 'processing',
        label: 'Processing',
        date: currentStatus !== 'pending' ? orderDate : undefined,
        completed: ['processing', 'shipped', 'delivered'].includes(currentStatus)
      },
      {
        status: 'shipped',
        label: 'Shipped',
        date: currentStatus === 'shipped' || currentStatus === 'delivered' ? orderDate : undefined,
        completed: ['shipped', 'delivered'].includes(currentStatus)
      },
      {
        status: 'delivered',
        label: 'Delivered',
        date: currentStatus === 'delivered' ? orderDate : undefined,
        completed: currentStatus === 'delivered'
      }
    ]

    return steps
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order tracking...</p>
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
            onClick={() => navigate('/profile')}
            className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition"
          >
            View All Orders
          </button>
        </div>
      </div>
    )
  }

  const trackingSteps = getTrackingSteps(order)
  const currentStatus = order.orderStatus || order.status || 'pending'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>
        <h1 className="text-4xl font-serif font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600">Order #{order.id?.slice(-8).toUpperCase()}</p>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
        <h2 className="text-2xl font-semibold mb-8">Order Status</h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
          
          {/* Timeline Steps */}
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <div key={step.status} className="relative flex items-start">
                {/* Status Icon */}
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.completed
                    ? 'bg-green-500'
                    : currentStatus === step.status
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}>
                  {step.completed ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : currentStatus === step.status ? (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  )}
                </div>

                {/* Status Content */}
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${
                      step.completed || currentStatus === step.status
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}>
                      {step.label}
                    </h3>
                    {step.date && (
                      <span className="text-sm text-gray-600">
                        {step.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  {currentStatus === step.status && (
                    <p className="text-sm text-gray-600 mt-1">
                      {step.status === 'pending' && 'Your order has been received and is being prepared.'}
                      {step.status === 'processing' && 'Your order is being processed and packaged.'}
                      {step.status === 'shipped' && 'Your order is on its way!'}
                      {step.status === 'delivered' && 'Your order has been delivered.'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Number */}
        {order.trackingNumber && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Tracking Number</h3>
            <p className="font-mono text-lg text-gray-900">{order.trackingNumber}</p>
            <button className="mt-3 text-purple-600 hover:text-purple-700 font-medium">
              Track with Carrier →
            </button>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
          <div className="text-sm text-gray-600">
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="mt-2">{order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items ({order.items.length})</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          If you have any questions about your order, please contact our customer service team.
        </p>
        <div className="flex gap-4">
          <Link
            to="/contact"
            className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition font-medium"
          >
            Contact Support
          </Link>
          <Link
            to={`/order-confirmation/${order.id}`}
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition font-medium"
          >
            View Receipt
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
