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
      // Fetch featured products
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

      // Fetch new arrivals
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
        description="Discover luxury fashion at Quarterends. Shop our curated collection of designer clothing, premium accessories, and timeless pieces that define elegance."
        keywords="luxury fashion, designer clothing, premium fashion, high-end apparel, Quarterends"
        url="https://quarterends.com"
      />
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Placeholder for hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            [Hero Image: Elegant model wearing luxury clothing, minimal background, high-end fashion photography style]
          </p>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover the perfect blend of sophistication and comfort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop?category=women" 
              className="bg-gray-900 text-white px-8 py-4 rounded hover:bg-gray-800 transition font-medium"
            >
              Shop Women
            </Link>
            <Link 
              to="/shop?category=men" 
              className="bg-white text-gray-900 px-8 py-4 rounded border-2 border-gray-900 hover:bg-gray-50 transition font-medium"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Outerwear', category: 'outerwear', desc: 'Elegant coats and jackets' },
            { name: 'Knitwear', category: 'knitwear', desc: 'Luxurious cashmere and wool' },
            { name: 'Accessories', category: 'accessories', desc: 'Complete your look' }
          ].map((item) => (
            <Link 
              key={item.category}
              to={`/shop?category=${item.category}`}
              className="group relative h-96 overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
                <p className="text-gray-400 text-xs text-center px-4">
                  [Category Image: {item.name} - {item.desc}]
                </p>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif font-bold mb-2">{item.name}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            New Arrivals
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-400 text-xs">[Product Image]</p>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 capitalize">{product.category}</p>
                    <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No new arrivals yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400 text-xs">[Product Image]</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 group-hover:text-purple-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 capitalize">{product.category}</p>
                  <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/shop" 
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium"
            >
              View All Products
            </Link>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              Founded with a passion for timeless design and exceptional quality, 
              Quarterends brings you carefully curated pieces that transcend trends.
            </p>
            <p className="text-gray-700 text-lg mb-6">
              Every garment is selected for its craftsmanship, comfort, and ability 
              to elevate your everyday wardrobe.
            </p>
            <Link 
              to="/about" 
              className="inline-block text-purple-600 hover:text-purple-700 font-medium"
            >
              Learn More About Us →
            </Link>
          </div>
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center px-4">
              [Brand Story Image: Studio shot showcasing craftsmanship, fabric details, or atelier workspace]
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Subscribe to receive exclusive offers, styling tips, and first access to new collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium">
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
