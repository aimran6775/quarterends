import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/payment'
import ScrollReveal from '../components/3d/ScrollReveal'
import AnimatedText from '../components/3d/AnimatedText'
import type { Order } from '../types'

interface TrackingStep {
  status: string
  label: string
  date?: Date
  completed: boolean
  description: string
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = () => {
      if (!orderId) {
        setError('Order ID not found')
        setLoading(false)
        return
      }

      try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
        const found = orders.find((o: any) => o.id === orderId)
        
        if (!found) {
          setError('Order not found')
          return
        }

        setOrder(found as Order)
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
    const orderDate = order.createdAt ? new Date(order.createdAt as string) : new Date()
    
    const steps: TrackingStep[] = [
      {
        status: 'pending',
        label: 'Order Placed',
        date: orderDate,
        completed: true,
        description: 'Your order has been received.'
      },
      {
        status: 'processing',
        label: 'Processing',
        date: currentStatus !== 'pending' ? orderDate : undefined,
        completed: ['processing', 'shipped', 'delivered'].includes(currentStatus),
        description: 'Being prepared and packaged.'
      },
      {
        status: 'shipped',
        label: 'Shipped',
        date: currentStatus === 'shipped' || currentStatus === 'delivered' ? orderDate : undefined,
        completed: ['shipped', 'delivered'].includes(currentStatus),
        description: 'On its way to you.'
      },
      {
        status: 'delivered',
        label: 'Delivered',
        date: currentStatus === 'delivered' ? orderDate : undefined,
        completed: currentStatus === 'delivered',
        description: 'Successfully delivered.'
      }
    ]

    return steps
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-center py-20">
          <div className="w-4 h-4 border border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 text-center">
        <p className="text-sm text-gray-400 mb-4">{error || 'Unable to load order details'}</p>
        <button
          onClick={() => navigate('/profile')}
          className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
        >
          View all orders
        </button>
      </div>
    )
  }

  const trackingSteps = getTrackingSteps(order)
  const currentStatus = order.orderStatus || order.status || 'pending'

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-10">
        <motion.a
          href="/profile"
          onClick={(e) => { e.preventDefault(); navigate('/profile') }}
          className="text-xs text-gray-400 hover:text-gray-900 transition-colors mb-6 inline-block"
          whileHover={{ x: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          ← Back to Orders
        </motion.a>
        <AnimatedText text="Track your order" as="h1" className="text-2xl font-medium tracking-tight mb-1" />
        <motion.p
          className="text-sm text-gray-400 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          #{order.id?.slice(-8).toUpperCase()}
        </motion.p>
      </div>

      {/* Timeline */}
      <motion.div
        className="border border-gray-100 p-6 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">Status</p>

        <div className="relative">
          {/* Animated connecting line */}
          <motion.div
            className="absolute left-[5px] top-3 bottom-3 w-px bg-gray-200 origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <div key={step.status} className="relative flex items-start">
                {/* Animated step dot */}
                <motion.div
                  className={`relative z-10 w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1 ${
                    step.completed
                      ? 'bg-gray-900'
                      : currentStatus === step.status
                      ? 'bg-gray-900 ring-4 ring-gray-100'
                      : 'bg-gray-200'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15, type: 'spring' }}
                />

                <div className="ml-6 flex-1">
                  {/* Animated step label */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.15 }}
                  >
                    <h3 className={`text-sm ${
                      step.completed || currentStatus === step.status
                        ? 'text-gray-900 font-medium'
                        : 'text-gray-300'
                    }`}>
                      {step.label}
                    </h3>
                    {step.date && (
                      <span className="text-xs text-gray-400">
                        {step.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </motion.div>
                  {/* Animated step description */}
                  {currentStatus === step.status && (
                    <motion.p
                      className="text-xs text-gray-400 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.15 }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.trackingNumber && (
          <motion.div
            className="mt-8 pt-6 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Tracking number</p>
            <p className="text-sm font-mono">{order.trackingNumber}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <ScrollReveal delay={0.1}>
          <div className="border border-gray-100 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Shipping to</p>
            <div className="text-sm text-gray-500 space-y-0.5">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="border border-gray-100 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Items ({order.items.length})</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Items */}
      <ScrollReveal delay={0.3}>
        <div className="border border-gray-100 p-6 mt-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Items</p>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
              >
                <div className="w-10 h-12 bg-gray-50 flex-shrink-0 overflow-hidden">
                  <img src={item.image || '/placeholder.jpg'} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-gray-400">{item.size} · Qty {item.quantity}</p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Help */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-gray-400 mb-2">Need help with your order?</p>
        <Link to="/contact" className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
          Contact support
        </Link>
      </motion.div>
    </div>
  )
}

export default OrderTracking
