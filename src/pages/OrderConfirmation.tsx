import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { formatPrice } from '../utils/payment'
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

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
      {/* Success */}
      <div className="text-center mb-12">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Order confirmed</h1>
        <p className="text-sm text-gray-400">Thank you for your purchase.</p>
      </div>

      {/* Order Info */}
      <div className="border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order</p>
            <p className="text-sm font-mono">#{order.id?.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
            <p className="text-sm">
              {order.createdAt
                ? new Date(order.createdAt as string).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm">{order.orderStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Payment</p>
            <p className="text-sm">{order.paymentStatus}</p>
          </div>
        </div>

        {/* Shipping */}
        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Shipping to</p>
          <div className="text-sm text-gray-500">
            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="border border-gray-100 p-6 mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Items</p>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
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
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-gray-100">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Email notice */}
      <p className="text-xs text-gray-400 text-center mb-8">
        A confirmation email has been sent to {order.shippingAddress.email}
      </p>

      {/* Actions */}
      <div className="flex justify-center gap-8">
        <Link to="/shop" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
          Continue shopping
        </Link>
        <Link to="/profile" className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors">
          View orders
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmation
