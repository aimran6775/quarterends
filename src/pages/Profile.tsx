import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { formatPrice } from '../utils/payment'
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
      <h1 className="text-2xl font-medium tracking-tight mb-10">My Account</h1>

      <div className="grid md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium">{userData?.displayName || user?.displayName}</h3>
              <p className="text-xs text-gray-400">{userData?.email || user?.email}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  activeTab === 'orders' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  activeTab === 'addresses' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Addresses
              </button>
              <Link
                to="/wishlist"
                className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {/* Personal Information Tab */}
          {activeTab === 'profile' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-medium tracking-tight">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
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
              </div>

              <div>
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
              </div>

              {editing && (
                <button className="bg-gray-900 text-white px-6 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors">
                  Save Changes
                </button>
              )}
            </div>
          </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
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
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-gray-900 text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-lg p-5 hover:border-gray-200 transition-colors"
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
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex-shrink-0">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-lg font-medium tracking-tight mb-8">Saved Addresses</h2>
              <div className="text-center py-16">
                <p className="text-sm text-gray-400 mb-4">No saved addresses</p>
                <button className="bg-gray-900 text-white px-5 py-2.5 text-sm rounded hover:bg-gray-800 transition-colors">
                  Add Address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
