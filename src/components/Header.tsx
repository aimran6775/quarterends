import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const navLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const NavLink = ({ to, label, index, onClick }: { to: string; label: string; index: number; onClick?: () => void }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={to}
        onClick={onClick}
        className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 py-1"
      >
        {label}
      </Link>
      <motion.div
        className="absolute -bottom-0.5 left-0 right-0 h-px bg-gray-900 origin-left"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </motion.div>
  )
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, userRole, logout } = useAuth()
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const mobileMenuVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  const mobileNavContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  }

  const mobileNavItemVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, x: -16, transition: { duration: 0.15 } },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -4 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.12 } },
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-transparent backdrop-blur-none border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`flex items-center justify-between transition-all duration-500 ease-out ${
              scrolled ? 'h-16' : 'h-20'
            }`}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Link to="/" className="text-lg font-semibold tracking-tight text-gray-900">
                quarterends
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <NavLink key={link.to} to={link.to} label={link.label} index={i} />
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <Link to="/wishlist" className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </Link>
              </motion.div>

              {/* User */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <>
                          <motion.div
                            className="fixed inset-0"
                            onClick={() => setIsUserMenuOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute right-0 mt-3 w-52 bg-white/80 backdrop-blur-xl border border-gray-100/80 rounded-xl shadow-lg shadow-gray-900/5 py-1 overflow-hidden"
                          >
                            <div className="px-4 py-3 border-b border-gray-100/60">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.displayName}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                            {userRole === 'admin' && (
                              <Link
                                to="/admin"
                                className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 transition-colors duration-200"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                Admin
                              </Link>
                            )}
                            <Link
                              to="/profile"
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 transition-colors duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              to="/profile"
                              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50/80 transition-colors duration-200"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Orders
                            </Link>
                            <div className="border-t border-gray-100/60">
                              <button
                                onClick={() => { logout(); setIsUserMenuOpen(false) }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-gray-900 hover:bg-gray-50/80 transition-colors duration-200"
                              >
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="text-gray-400 hover:text-gray-900 transition-colors duration-300">
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </Link>
                )}
              </motion.div>

              {/* Cart */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <Link to="/cart" className="relative text-gray-400 hover:text-gray-900 transition-colors duration-300">
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <AnimatePresence mode="popLayout">
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Mobile menu toggle */}
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="md:hidden text-gray-400 hover:text-gray-900 transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <AnimatePresence mode="wait" initial={false}>
                    {isMenuOpen ? (
                      <motion.path
                        key="close"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    ) : (
                      <motion.path
                        key="menu"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 9h16.5m-16.5 6.75h16.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile fullscreen overlay menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-white/90 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Content */}
            <motion.nav
              variants={mobileNavContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative pt-28 px-8 flex flex-col gap-6"
            >
              {navLinks.map((link) => (
                <motion.div key={link.to} variants={mobileNavItemVariants}>
                  <Link
                    to={link.to}
                    className="block text-2xl font-medium text-gray-900 hover:text-gray-500 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={mobileNavItemVariants} className="pt-4 border-t border-gray-200/60">
                {user ? (
                  <div className="flex flex-col gap-5">
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-lg text-gray-500 hover:text-gray-900 transition-colors duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="text-lg text-gray-500 hover:text-gray-900 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false) }}
                      className="text-left text-lg text-gray-400 hover:text-gray-900 transition-colors duration-300"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-lg text-gray-500 hover:text-gray-900 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
