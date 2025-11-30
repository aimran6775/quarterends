import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'

const AdminLayout = () => {
  const { user, userRole, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      navigate('/')
    }
  }, [userRole, navigate])

  if (userRole !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <Link to="/admin" className="flex-shrink-0">
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  QUARTERENDS <span className="text-purple-600">ADMIN</span>
                </h1>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link to="/admin" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Products
                </Link>
                <Link to="/admin/orders" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Orders
                </Link>
                <Link to="/admin/customers" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Customers
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Store
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-sm text-gray-700">{user?.displayName}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
