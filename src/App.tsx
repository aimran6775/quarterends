import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { getStripe } from './config/stripe'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Chatbot from './components/Chatbot'
import SmoothScroll from './components/3d/SmoothScroll'
import ParticleField from './components/3d/ParticleField'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ProductsList = lazy(() => import('./pages/admin/ProductsList'))
const ProductForm = lazy(() => import('./pages/admin/ProductForm'))
const OrdersManagement = lazy(() => import('./pages/admin/OrdersManagement'))
const CustomersManagement = lazy(() => import('./pages/admin/CustomersManagement'))

// Elegant loading component with pulsing dots
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-6">
      {/* Spinning ring */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-900 animate-spin" />
      </div>
      {/* Pulsing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-gray-800"
            style={{
              animation: 'pulse-dot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  </div>
)

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}

// Inner component that uses useLocation (must be inside Router)
function AppContent() {
  const location = useLocation()
  const stripePromise = getStripe()

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Elements stripe={stripePromise}>
            <SmoothScroll>
              <div className="min-h-screen flex flex-col bg-white relative">
                {/* Fixed particle background */}
                <ParticleField />

                <Header />
                <Chatbot />

                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Suspense fallback={<PageLoader />}>
                        <Routes location={location}>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<SignUp />} />

                          {/* Protected Routes */}
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/wishlist"
                            element={
                              <ProtectedRoute>
                                <Wishlist />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/checkout"
                            element={
                              <ProtectedRoute>
                                <Checkout />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/order-confirmation/:orderId"
                            element={
                              <ProtectedRoute>
                                <OrderConfirmation />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/order-tracking/:orderId"
                            element={
                              <ProtectedRoute>
                                <OrderTracking />
                              </ProtectedRoute>
                            }
                          />

                          {/* Admin Routes */}
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute adminOnly>
                                <AdminLayout />
                              </ProtectedRoute>
                            }
                          >
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<ProductsList />} />
                            <Route path="products/new" element={<ProductForm />} />
                            <Route path="products/:id" element={<ProductForm />} />
                            <Route path="orders" element={<OrdersManagement />} />
                            <Route path="customers" element={<CustomersManagement />} />
                          </Route>
                        </Routes>
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
                </main>

                <Footer />
              </div>
            </SmoothScroll>
          </Elements>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  )
}

export default App
