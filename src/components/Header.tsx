import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import VisualSearch from './VisualSearch'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, userRole, logout } = useAuth()
  const { cartCount } = useCart()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with announcement */}
        <div className="bg-navy-900 text-white text-center py-2 text-sm">
          Free shipping on orders over $200 | Free returns within 30 days
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
              QUARTERENDS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Shop
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <VisualSearch />
            <Link to="/wishlist" className="text-gray-700 hover:text-gray-900 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 transition flex items-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    {userRole === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-50 font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        ⚡ Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
            <Link to="/cart" className="text-gray-700 hover:text-gray-900 transition relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-4">
            <Link to="/shop" className="block text-gray-700 hover:text-gray-900 font-medium">
              Shop
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </Link>
            {user ? (
              <>
                {userRole === 'admin' && (
                  <Link to="/admin" className="block text-purple-600 hover:text-purple-700 font-medium">
                    ⚡ Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="block text-gray-700 hover:text-gray-900 font-medium">
                  My Profile
                </Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-gray-700 hover:text-gray-900 font-medium">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
