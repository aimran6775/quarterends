import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
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
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        }
      }
      setLoading(false)
    }

    fetchUserData()
  }, [user])

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && activeTab === 'orders') {
        setOrdersLoading(true)
        try {
          const ordersQuery = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          )
          const ordersSnapshot = await getDocs(ordersQuery)
          const ordersData = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[]
          setOrders(ordersData)
        } catch (error) {
          console.error('Error fetching orders:', error)
        } finally {
          setOrdersLoading(false)
        }
      }
    }

    fetchOrders()
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">{userData?.displayName || user?.displayName}</h3>
              <p className="text-gray-600 text-sm">{userData?.email || user?.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded font-medium ${
                  activeTab === 'profile' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded font-medium ${
                  activeTab === 'orders' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-2 rounded font-medium ${
                  activeTab === 'addresses' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                Addresses
              </button>
              <Link
                to="/wishlist"
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
              >
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded text-red-600"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Personal Information Tab */}
          {activeTab === 'profile' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData?.displayName || ''}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData?.phone || ''}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-50"
                  placeholder="Add phone number"
                />
              </div>

              {editing && (
                <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                  Save Changes
                </button>
              )}
            </div>
          </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Order History</h2>
              
              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Order #{order.id?.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.createdAt?.toDate
                              ? new Date(order.createdAt.toDate()).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            order.orderStatus === 'delivered' || order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'shipped' || order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.orderStatus === 'processing' || order.status === 'processing'
                              ? 'bg-purple-100 text-purple-800'
                              : order.orderStatus === 'cancelled' || order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(order.orderStatus || order.status || 'pending').charAt(0).toUpperCase() + 
                             (order.orderStatus || order.status || 'pending').slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Items</p>
                          <p className="font-medium">{order.items.length} item(s)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-medium text-lg">{formatPrice(order.total)}</p>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex-shrink-0">
                              <img
                                src={item.image || '/placeholder.jpg'}
                                alt={item.productName}
                                className="w-16 h-20 object-cover rounded"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-sm text-gray-600">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/order-confirmation/${order.id}`}
                          className="flex-1 text-center px-4 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition font-medium"
                        >
                          View Details
                        </Link>
                        {(order.orderStatus !== 'cancelled' && order.status !== 'cancelled') && (
                          <Link
                            to={`/order-tracking/${order.id}`}
                            className="flex-1 text-center px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition font-medium"
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
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Saved Addresses</h2>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No saved addresses</p>
                <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition">
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
