import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Product } from '../types'
import SEO from '../components/SEO'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const featuredQuery = query(
        collection(db, 'products'),
        where('featured', '==', true),
        limit(4)
      )
      const featuredSnap = await getDocs(featuredQuery)
      const featured = featuredSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setFeaturedProducts(featured)

      const newQuery = query(
        collection(db, 'products'),
        where('newArrival', '==', true),
        orderBy('createdAt', 'desc'),
        limit(4)
      )
      const newSnap = await getDocs(newQuery)
      const newItems = newSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setNewArrivals(newItems)
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
      <div className="pt-16">
        {/* Hero */}
        <section className="min-h-[90vh] flex items-center justify-center px-6">
          <div className="max-w-2xl text-center animate-fade-in">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">New Collection</p>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Less noise,<br />more style.
            </h1>
            <p className="text-base text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
              Thoughtfully designed pieces that speak for themselves. No trends, just timeless.
            </p>
            <Link
              to="/shop"
              className="inline-block text-sm font-medium text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Explore the collection
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Outerwear', category: 'outerwear', desc: 'Coats & jackets' },
              { name: 'Knitwear', category: 'knitwear', desc: 'Cashmere & wool' },
              { name: 'Accessories', category: 'accessories', desc: 'Finishing touches' }
            ].map((item) => (
              <Link
                key={item.category}
                to={`/shop?category=${item.category}`}
                className="group relative aspect-[3/4] bg-gray-50 overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-300 text-xs">[{item.name}]</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Just in</p>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight">New arrivals</h2>
            </div>
            <Link to="/shop" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-5 h-5 border border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {newArrivals.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
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
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-16">No new arrivals yet.</p>
          )}
        </section>

        {/* Featured */}
        {featuredProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Curated</p>
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Featured</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
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
              ))}
            </div>
          </section>
        )}

        {/* Story */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Our story</p>
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">
                Built on intention
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Every piece is selected for its craftsmanship, comfort, and ability to elevate your everyday.
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
            <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center">
              <p className="text-gray-300 text-xs">[Brand Image]</p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="border-t border-gray-100">
          <div className="max-w-md mx-auto px-6 py-24 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Stay in the loop</p>
            <h2 className="text-2xl font-medium tracking-tight mb-3">Join our community</h2>
            <p className="text-sm text-gray-400 mb-8">First access to new drops and exclusives.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 text-sm px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
              />
              <button className="px-6 py-3 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
