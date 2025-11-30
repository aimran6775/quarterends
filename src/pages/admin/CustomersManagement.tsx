import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { User, Order } from '../../types'

interface UserWithOrders extends User {
  orderCount: number
  totalSpent: number
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<UserWithOrders[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<UserWithOrders | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const [usersSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'orders'))
      ])
      
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[]

      const ordersData = ordersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]

      // Calculate order stats for each user
      const usersWithStats = usersData.map(user => {
        const userOrders = ordersData.filter(order => order.userId === user.id)
        return {
          ...user,
          orderCount: userOrders.length,
          totalSpent: userOrders.reduce((sum, order) => sum + order.total, 0)
        }
      })

      setCustomers(usersWithStats.sort((a, b) => b.orderCount - a.orderCount))
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role}?`)) {
      return
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role })
      setCustomers(customers.map(customer => 
        customer.id === userId ? { ...customer, role } : customer
      ))
      alert('User role updated successfully')
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  const viewCustomerOrders = async (customer: UserWithOrders) => {
    setSelectedCustomer(customer)
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      )
      const ordersSnap = await getDocs(ordersQuery)
      const ordersData = ordersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Order)
        .filter(order => order.userId === customer.id)
      setCustomerOrders(ordersData)
    } catch (error) {
      console.error('Error fetching customer orders:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Customers</h1>
        <p className="text-gray-600">Manage customer accounts and roles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Admin Users</p>
          <p className="text-3xl font-bold text-gray-900">
            {customers.filter(c => c.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600 text-sm mb-1">Regular Users</p>
          <p className="text-3xl font-bold text-gray-900">
            {customers.filter(c => c.role === 'user').length}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      {customers.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {customer.displayName?.charAt(0).toUpperCase() || customer.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {customer.displayName || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{customer.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{customer.orderCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ${customer.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewCustomerOrders(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Orders
                      </button>
                      <button
                        onClick={() => customer.id && updateUserRole(
                          customer.id, 
                          customer.role === 'admin' ? 'user' : 'admin'
                        )}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        {customer.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Customers will appear here once they sign up</p>
        </div>
      )}

      {/* Customer Orders Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold">Customer Orders</h2>
                <p className="text-gray-600">{selectedCustomer.displayName || selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Customer Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orderCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">${selectedCustomer.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Order</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedCustomer.orderCount > 0 
                        ? (selectedCustomer.totalSpent / selectedCustomer.orderCount).toFixed(2) 
                        : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              {customerOrders.length > 0 ? (
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-sm text-gray-600">#{order.id?.slice(0, 8) || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {order.createdAt 
                              ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.productName}
                              {item.size && ` (${item.size})`}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersManagement
