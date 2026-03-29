import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, userRole, logout } = useAuth()
  const { cartCount } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
            quarterends
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-lg shadow-sm py-1 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden text-gray-400 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-50 bg-white animate-fade-in">
          <nav className="max-w-6xl mx-auto px-6 py-6 space-y-4">
            <Link to="/shop" className="block text-sm text-gray-500 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="block text-sm text-gray-500 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/contact" className="block text-sm text-gray-500 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <>
                  {userRole === 'admin' && (
                    <Link to="/admin" className="block text-sm text-gray-500 hover:text-gray-900 mb-4" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                  )}
                  <Link to="/profile" className="block text-sm text-gray-500 hover:text-gray-900 mb-4" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false) }} className="text-sm text-gray-400 hover:text-gray-900">Sign out</button>
                </>
              ) : (
                <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
