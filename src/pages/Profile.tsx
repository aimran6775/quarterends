import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { formatPrice } from '../utils/payment'
import AnimatedText from '../components/3d/AnimatedText'
import type { Order } from '../types'

interface UserData {
  displayName: string
  email: string
  phone?: string
  addresses: Array<{
    id: string
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    isDefault: boolean
  }>
}

type TabType = 'profile' | 'orders' | 'addresses' | 'wishlist'

const navItems: { key: TabType | 'wishlist-link' | 'logout'; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'orders', label: 'Orders' },
  { key: 'addresses', label: 'Addresses' },
  { key: 'wishlist-link', label: 'Wishlist' },
  { key: 'logout', label: 'Sign Out' },
]

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('profile')

  useEffect(() => {
    if (user) {
      setUserData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: '',
        addresses: []
      })
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (user && activeTab === 'orders') {
      setOrdersLoading(true)
      try {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[]
        const userOrders = allOrders
          .filter((o: any) => o.userId === user.uid)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setOrders(userOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setOrdersLoading(false)
      }
    }
  }, [user, activeTab])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <AnimatedText text="My Account" tag="h1" className="text-2xl font-medium tracking-tight mb-10" />

      <div className="grid md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3"
              >
                <svg className="w-7 h-7 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </motion.div>
              <h3 className="text-sm font-medium">{userData?.displayName || user?.displayName}</h3>
              <p className="text-xs text-gray-400">{userData?.email || user?.email}</p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item, i) => {
                if (item.key === 'wishlist-link') {
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                    >
                      <Link
                        to="/wishlist"
                        className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                }
                if (item.key === 'logout') {
                  return (
                    <motion.button
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </motion.button>
                  )
                }
                return (
                  <motion.button
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(item.key as TabType)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      activeTab === item.key ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-medium tracking-tight">Personal Information</h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(!editing)}
                  className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </motion.button>
              </div>

              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="grid grid-cols-2 gap-5"
                >
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData?.displayName || ''}
                      disabled={!editing}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-900 disabled:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData?.email || ''}
                      disabled
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded bg-gray-50"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userData?.phone || ''}
                    disabled={!editing}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-900 disabled:bg-gray-50 transition-colors"
                    placeholder="Add phone number"
                  />
                </motion.div>

                {editing && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white px-6 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </motion.button>
                )}
              </div>
            </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-medium tracking-tight mb-8">Order History</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-16">
                    <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-3 text-xs text-gray-400">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-sm text-gray-400 mb-4">No orders yet</p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/shop')}
                      className="bg-gray-900 text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors"
                    >
                      Start Shopping
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.35 }}
                        whileHover={{ borderColor: '#d1d5db' }}
                        className="border border-gray-100 rounded-lg p-5 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-medium">
                              Order #{order.id?.slice(-8).toUpperCase()}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.createdAt
                                ? new Date(order.createdAt as string).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                              order.orderStatus === 'delivered' || order.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-600'
                                : order.orderStatus === 'shipped' || order.status === 'shipped'
                                ? 'bg-sky-50 text-sky-600'
                                : order.orderStatus === 'processing' || order.status === 'processing'
                                ? 'bg-amber-50 text-amber-600'
                                : order.orderStatus === 'cancelled' || order.status === 'cancelled'
                                ? 'bg-red-50 text-red-500'
                                : 'bg-gray-50 text-gray-600'
                            }`}>
                              {(order.orderStatus || order.status || 'pending').charAt(0).toUpperCase() + 
                               (order.orderStatus || order.status || 'pending').slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-400">Items</p>
                            <p className="text-sm font-medium mt-0.5">{order.items.length} item(s)</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-sm font-medium mt-0.5">{formatPrice(order.total)}</p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="border-t border-gray-100 pt-3 mb-3">
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="flex-shrink-0">
                                <img
                                  src={item.image || '/placeholder.jpg'}
                                  alt={item.productName}
                                  className="w-12 h-14 object-cover rounded"
                                />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-12 h-14 bg-gray-50 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/order-confirmation/${order.id}`}
                            className="flex-1 text-center px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded hover:border-gray-900 hover:text-gray-900 transition-colors"
                          >
                            View Details
                          </Link>
                          {(order.orderStatus !== 'cancelled' && order.status !== 'cancelled') && (
                            <Link
                              to={`/order-tracking/${order.id}`}
                              className="flex-1 text-center px-4 py-2 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                            >
                              Track Order
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-medium tracking-tight mb-8">Saved Addresses</h2>
                <div className="text-center py-16">
                  <p className="text-sm text-gray-400 mb-4">No saved addresses</p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors"
                  >
                    Add Address
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Profile
