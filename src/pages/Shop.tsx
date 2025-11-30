import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter, DocumentData } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Product } from '../types'
import { useWishlist } from '../contexts/WishlistContext'

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

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let productsQuery = query(collection(db, 'products'))

      // Apply filters
      if (filters.categories.length > 0 && !filters.categories.includes('all')) {
        productsQuery = query(productsQuery, where('category', 'in', filters.categories))
      }

      // Apply sorting
      if (sortBy === 'price-asc') {
        productsQuery = query(productsQuery, orderBy('price', 'asc'))
      } else if (sortBy === 'price-desc') {
        productsQuery = query(productsQuery, orderBy('price', 'desc'))
      } else if (sortBy === 'newest') {
        productsQuery = query(productsQuery, orderBy('createdAt', 'desc'))
      } else if (sortBy === 'featured') {
        productsQuery = query(productsQuery, orderBy('featured', 'desc'))
      }

      const snapshot = await getDocs(productsQuery)
      let allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Shop</h1>
        {(filters.categories.length > 0 || filters.priceRanges.length > 0 || filters.sizes.length > 0 || filters.colors.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-700 underline"
          >
            Clear all filters
          </button>
        )}
      </div>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Search</h3>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'women', label: 'Women' },
                  { value: 'men', label: 'Men' },
                  { value: 'accessories', label: 'Accessories' }
                ].map((cat) => (
                  <label key={cat.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat.value)}
                      onChange={() => toggleFilter('categories', cat.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="space-y-2">
                {[
                  { value: 'under-100', label: 'Under $100' },
                  { value: '100-200', label: '$100 - $200' },
                  { value: '200-500', label: '$200 - $500' },
                  { value: 'over-500', label: 'Over $500' }
                ].map((price) => (
                  <label key={price.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priceRanges.includes(price.value)}
                      onChange={() => toggleFilter('priceRanges', price.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{price.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleFilter('sizes', size)}
                    className={`border rounded py-1 text-sm transition ${
                      filters.sizes.includes(size)
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="grid grid-cols-5 gap-2">
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
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      filters.colors.includes(color.name)
                        ? 'border-gray-900 ring-2 ring-purple-600'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {products.length > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0} - {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        isInWishlist(product.id) 
                          ? removeFromWishlist(product.id) 
                          : addToWishlist(product.id)
                      }}
                      className={`absolute top-2 right-2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${
                        isInWishlist(product.id)
                          ? 'bg-red-50 text-red-500'
                          : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <Link to={`/product/${product.id}`}>
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
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.compareAtPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      {product.newArrival && (
                        <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          New Arrival
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded hover:border-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    const pageNum = idx + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 border rounded transition ${
                          currentPage === pageNum
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded hover:border-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
