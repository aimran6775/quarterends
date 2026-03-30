import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { mockProducts } from '../data/products'
import { Product } from '../types'
import { useWishlist } from '../contexts/WishlistContext'
import ScrollReveal from '../components/3d/ScrollReveal'
import AnimatedText from '../components/3d/AnimatedText'
import ProductCard3D from '../components/3d/ProductCard3D'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRanges: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    search: searchParams.get('search') || ''
  })
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const productsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy, currentPage])

  const fetchProducts = () => {
    setLoading(true)
    try {
      let allProducts = [...mockProducts]

      // Apply category filter
      if (filters.categories.length > 0 && !filters.categories.includes('all')) {
        allProducts = allProducts.filter(p => filters.categories.includes(p.category))
      }

      // Apply sorting
      if (sortBy === 'price-asc') {
        allProducts.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'price-desc') {
        allProducts.sort((a, b) => b.price - a.price)
      } else if (sortBy === 'newest') {
        allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (sortBy === 'featured') {
        allProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }

      // Client-side filtering for complex filters
      if (filters.priceRanges.length > 0) {
        allProducts = allProducts.filter(product => {
          return filters.priceRanges.some(range => {
            if (range === 'under-100') return product.price < 100
            if (range === '100-200') return product.price >= 100 && product.price <= 200
            if (range === '200-500') return product.price > 200 && product.price <= 500
            if (range === 'over-500') return product.price > 500
            return false
          })
        })
      }

      if (filters.sizes.length > 0) {
        allProducts = allProducts.filter(product =>
          filters.sizes.some(size => product.sizes.includes(size))
        )
      }

      if (filters.colors.length > 0) {
        allProducts = allProducts.filter(product =>
          filters.colors.some(color => product.colors.some(c => c.name.toLowerCase() === color))
        )
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        allProducts = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      setTotalProducts(allProducts.length)

      // Pagination
      const startIndex = (currentPage - 1) * productsPerPage
      const paginatedProducts = allProducts.slice(startIndex, startIndex + productsPerPage)
      
      setProducts(paginatedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentValues = prev[type] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      return { ...prev, [type]: newValues }
    })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
      sizes: [],
      colors: [],
      search: ''
    })
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const filterSections = [
    {
      key: 'search',
      content: (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-900 mb-3">Search</h3>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-100 bg-transparent text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      )
    },
    {
      key: 'category',
      content: (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'women', label: 'Women' },
              { value: 'men', label: 'Men' },
              { value: 'accessories', label: 'Accessories' }
            ].map((cat) => (
              <label key={cat.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.value)}
                  onChange={() => toggleFilter('categories', cat.value)}
                  className="mr-2.5 h-3.5 w-3.5 rounded-none border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'price',
      content: (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-900 mb-3">Price</h3>
          <div className="space-y-2">
            {[
              { value: 'under-100', label: 'Under $100' },
              { value: '100-200', label: '$100 – $200' },
              { value: '200-500', label: '$200 – $500' },
              { value: 'over-500', label: 'Over $500' }
            ].map((price) => (
              <label key={price.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(price.value)}
                  onChange={() => toggleFilter('priceRanges', price.value)}
                  className="mr-2.5 h-3.5 w-3.5 rounded-none border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">{price.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'size',
      content: (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-900 mb-3">Size</h3>
          <div className="flex flex-wrap gap-1.5">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <motion.button
                key={size}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFilter('sizes', size)}
                className={`px-3 py-1 text-xs transition-colors ${
                  filters.sizes.includes(size)
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-100 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'color',
      content: (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-900 mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'black', hex: '#000000' },
              { name: 'white', hex: '#FFFFFF' },
              { name: 'gray', hex: '#6B7280' },
              { name: 'blue', hex: '#1E3A8A' },
              { name: 'red', hex: '#991B1B' },
              { name: 'green', hex: '#065F46' },
              { name: 'beige', hex: '#D4B996' },
              { name: 'navy', hex: '#1E293B' }
            ].map((color) => (
              <button
                key={color.name}
                onClick={() => toggleFilter('colors', color.name)}
                className={`w-6 h-6 rounded-full transition-all ${
                  filters.colors.includes(color.name)
                    ? 'ring-2 ring-gray-900 ring-offset-2'
                    : 'ring-1 ring-gray-200 hover:ring-gray-400'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <ScrollReveal>
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <AnimatedText text="Shop" tag="h1" className="text-2xl font-medium tracking-tight text-gray-900" staggerChildren={0.04} />
            <p className="text-xs text-gray-400 mt-1">{totalProducts} products</p>
          </div>
          {(filters.categories.length > 0 || filters.priceRanges.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-4"
            >
              Clear all filters
            </button>
          )}
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-4 gap-12">
        {/* Filters Sidebar */}
        <ScrollReveal direction="left">
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-8">
              <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400">Filters</h2>

              {filterSections.map((section, idx) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {section.content}
                </motion.div>
              ))}
            </div>
          </aside>
        </ScrollReveal>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-400">
              {products.length > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0}–{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts}
            </p>
            <motion.div whileHover={{ scale: 1.02 }}>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="text-xs text-gray-500 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer pr-6 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="newest">Newest</option>
              </select>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {[...Array(6)].map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: idx * 0.1 }}
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </motion.div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <ProductCard3D>
                        <div className="group relative">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              isInWishlist(product.id) 
                                ? removeFromWishlist(product.id) 
                                : addToWishlist(product.id)
                            }}
                            className={`absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity ${
                              isInWishlist(product.id)
                                ? 'opacity-100 text-gray-900'
                                : 'text-gray-400 hover:text-gray-900'
                            }`}
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>

                          <Link to={`/product/${product.id}`} className="block">
                            <div className="aspect-[3/4] bg-gray-50 mb-3 overflow-hidden">
                              {product.images && product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <p className="text-gray-300 text-xs">[Product Image]</p>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 space-y-0.5">
                              <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-500 transition-colors truncate">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                                {product.compareAtPrice && (
                                  <p className="text-xs text-gray-300 line-through">
                                    ${product.compareAtPrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                              {product.newArrival && (
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 pt-1">New</p>
                              )}
                            </div>
                          </Link>
                        </div>
                      </ProductCard3D>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </motion.button>
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 text-xs transition-colors ${
                          currentPage === pageNum
                            ? 'text-gray-900 font-medium border-b border-gray-900'
                            : 'text-gray-400 hover:text-gray-900'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    )
                  })}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next →
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-24"
            >
              <p className="text-sm text-gray-400 mb-1">No products found</p>
              <p className="text-xs text-gray-300 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
