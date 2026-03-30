import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getFeaturedProducts, getNewArrivals } from '../data/products'
import { Product } from '../types'
import SEO from '../components/SEO'
import HeroScene from '../components/3d/HeroScene'
import AnimatedText from '../components/3d/AnimatedText'
import ScrollReveal from '../components/3d/ScrollReveal'
import ProductCard3D from '../components/3d/ProductCard3D'
import Marquee from '../components/3d/Marquee'
import Counter from '../components/3d/Counter'
import GradientBlob from '../components/3d/GradientBlob'
import MagneticButton from '../components/3d/MagneticButton'

const categories = [
  { name: 'Outerwear', category: 'outerwear', desc: 'Coats & jackets' },
  { name: 'Knitwear', category: 'knitwear', desc: 'Cashmere & wool' },
  { name: 'Accessories', category: 'accessories', desc: 'Finishing touches' },
]

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 12, suffix: 'K+', label: 'Customers' },
  { value: 500, suffix: '+', label: 'Products' },
  { value: 30, suffix: '+', label: 'Countries' },
  { value: 99, suffix: '%', label: 'Satisfaction' },
]

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    try {
      setFeaturedProducts(getFeaturedProducts().slice(0, 4))
      setNewArrivals(getNewArrivals().slice(0, 4))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Home"
        description="Discover thoughtfully curated fashion at Quarterends."
        keywords="minimal fashion, curated clothing, premium fashion, Quarterends"
        url="https://quarterends.com"
      />

      <div>
        {/* ── Hero Section ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* R3F background */}
          <div className="absolute inset-0 z-0">
            <HeroScene />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 max-w-3xl text-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-8"
            >
              New Collection
            </motion.p>

            <AnimatedText
              text="Less noise,"
              as="h1"
              mode="char"
              delay={0.2}
              className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900 leading-[1.1]"
            />
            <AnimatedText
              text="more style."
              as="h1"
              mode="char"
              delay={0.5}
              className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900 leading-[1.1] mt-1"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-base text-gray-400 mt-8 mb-10 max-w-md mx-auto leading-relaxed"
            >
              Thoughtfully designed pieces that speak for themselves. No trends, just timeless.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <Link to="/shop">
                <MagneticButton className="inline-block px-8 py-4 bg-gray-900 text-white text-sm tracking-wide rounded-md hover:bg-gray-800 transition-colors">
                  Explore the collection
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-400"
            >
              <path d="M12 5v14m0 0l-6-6m6 6l6-6" />
            </svg>
          </motion.div>
        </section>

        {/* ── Marquee Strip ── */}
        <div className="border-y border-gray-100 py-4">
          <Marquee
            text="NEW COLLECTION · SPRING 2026 · FREE SHIPPING · CURATED FASHION"
            speed={40}
            className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium"
          />
        </div>

        {/* ── Categories Section ── */}
        <section className="max-w-6xl mx-auto px-6 py-28">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((item, i) => (
                <ScrollReveal key={item.category} delay={i * 0.12}>
                  <Link
                    to={`/shop?category=${item.category}`}
                    className="group relative aspect-[3/4] bg-gray-50 overflow-hidden block"
                  >
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-300 text-xs">[{item.name}]</p>
                      </div>
                    </motion.div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ── Stats Section ── */}
        <section className="relative py-28 overflow-hidden">
          <GradientBlob className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {stats.map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 0.1}>
                    <div>
                      <Counter
                        value={stat.value}
                        suffix={stat.suffix}
                        className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight"
                      />
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-3">
                        {stat.label}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── New Arrivals ── */}
        <section className="max-w-6xl mx-auto px-6 py-28">
          <ScrollReveal>
            <div className="flex justify-between items-end mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Just in</p>
                <AnimatedText
                  text="New arrivals"
                  as="h2"
                  mode="word"
                  className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900"
                />
              </div>
              <Link
                to="/shop"
                className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                View all →
              </Link>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {newArrivals.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.08}>
                  <ProductCard3D>
                    <Link to={`/product/${product.id}`} className="group block">
                      <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden rounded-sm">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-300 text-xs">[Image]</p>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                    </Link>
                  </ProductCard3D>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-16">No new arrivals yet.</p>
          )}
        </section>

        {/* ── Featured ── */}
        {featuredProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-28 border-t border-gray-100">
            <ScrollReveal>
              <div className="flex justify-between items-end mb-14">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Curated</p>
                  <AnimatedText
                    text="Featured"
                    as="h2"
                    mode="word"
                    className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900"
                  />
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 0.08}>
                  <ProductCard3D>
                    <Link to={`/product/${product.id}`} className="group block">
                      <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden rounded-sm">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-300 text-xs">[Image]</p>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                    </Link>
                  </ProductCard3D>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* ── Story Section ── */}
        <section className="max-w-6xl mx-auto px-6 py-28 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Our story</p>
                <AnimatedText
                  text="Built on intention"
                  as="h2"
                  mode="word"
                  className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 mb-6"
                />
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Every piece is selected for its craftsmanship, comfort, and ability to elevate
                  your everyday.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  We believe the best wardrobe is a curated one — fewer things, chosen well.
                </p>
                <Link
                  to="/about"
                  className="text-sm font-medium text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <motion.div
                className="aspect-[4/5] bg-gray-50 flex items-center justify-center rounded-sm overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-300 text-xs">[Brand Image]</p>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Newsletter Section ── */}
        <section className="border-t border-gray-100">
          <ScrollReveal>
            <div className="max-w-md mx-auto px-6 py-28 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
                Stay in the loop
              </p>
              <AnimatedText
                text="Join our community"
                as="h2"
                mode="word"
                className="text-2xl font-medium tracking-tight text-gray-900 mb-3 justify-center"
              />
              <p className="text-sm text-gray-400 mb-10">
                First access to new drops and exclusives.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 text-sm px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                />
                <MagneticButton className="px-6 py-3 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors">
                  Subscribe
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </>
  )
}

export default Home
