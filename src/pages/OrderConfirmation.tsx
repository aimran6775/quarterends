import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../utils/payment'
import ScrollReveal from '../components/3d/ScrollReveal'
import AnimatedText from '../components/3d/AnimatedText'
import type { Order } from '../types'

const OrderConfirmation = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-xl font-medium tracking-tight mb-2">Order not found</h1>
        <p className="text-sm text-gray-400 mb-6">{error || 'Unable to load order details'}</p>
        <button
          onClick={() => navigate('/shop')}
          className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
        >
          Continue shopping
        </button>
      </div>
    )
  }

  const infoBlocks = [
    { label: 'Order', value: `#${order.id?.slice(-8).toUpperCase()}`, mono: true },
    { label: 'Date', value: order.createdAt
      ? new Date(order.createdAt as string).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : 'N/A', mono: false },
    { label: 'Status', value: order.orderStatus, mono: false },
    { label: 'Payment', value: order.paymentStatus, mono: false },
  ]

  const summaryRows = [
    { label: 'Subtotal', value: formatPrice(order.subtotal) },
    { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0) },
    { label: 'Tax', value: formatPrice(order.tax) },
  ]

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-16">
      {/* Success */}
      <div className="text-center mb-12">
        <motion.div
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <motion.svg
            className="w-5 h-5 text-gray-900"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            initial="hidden"
            animate="visible"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.div>
        <AnimatedText text="Order confirmed" as="h1" className="text-2xl font-medium tracking-tight mb-2" />
        <motion.p
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Thank you for your purchase.
        </motion.p>
      </div>

      {/* Order Info */}
      <motion.div
        className="border border-gray-100 p-6 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
          {infoBlocks.map((block, index) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{block.label}</p>
              <p className={`text-sm ${block.mono ? 'font-mono' : ''}`}>{block.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Shipping */}
        <ScrollReveal>
          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Shipping to</p>
            <div className="text-sm text-gray-500">
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </ScrollReveal>
      </motion.div>

      {/* Items */}
      <motion.div
        className="border border-gray-100 p-6 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Items</p>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.08 }}
            >
              <div className="w-12 h-14 bg-gray-50 flex-shrink-0 overflow-hidden">
                <img src={item.image || '/placeholder.jpg'} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.productName}</p>
                <p className="text-xs text-gray-400">
                  {item.size !== 'N/A' && item.size}{item.color !== 'N/A' && ` · ${item.color}`} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
          {summaryRows.map((row, index) => (
            <motion.div
              key={row.label}
              className="flex justify-between text-sm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.08 }}
            >
              <span className="text-gray-400">{row.label}</span>
              <span>{row.value}</span>
            </motion.div>
          ))}
          <motion.div
            className="flex justify-between text-sm pt-3 border-t border-gray-100"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Email notice */}
      <motion.p
        className="text-xs text-gray-400 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        A confirmation email has been sent to {order.shippingAddress.email}
      </motion.p>

      {/* Actions */}
      <motion.div
        className="flex justify-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link to="/shop" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
          Continue shopping
        </Link>
        <Link to="/profile" className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
          View orders
        </Link>
      </motion.div>
    </div>
  )
}

export default OrderConfirmation
