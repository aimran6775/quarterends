import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { visualSearch } from '../utils/chatbot'
import type { Product } from '../types'

const VisualSearch = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<{
    matches: Product[]
    description: string
    suggestions: string[]
  } | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSearch = async () => {
    if (!selectedImage) return

    setSearching(true)
    try {
      // Fetch all products
      const productsSnapshot = await getDocs(collection(db, 'products'))
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]

      // Perform visual search
      const searchResults = await visualSearch(selectedImage, products)
      setResults(searchResults)
    } catch (error) {
      console.error('Visual search error:', error)
      alert('Failed to search. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const resetSearch = () => {
    setSelectedImage(null)
    setResults(null)
  }

  return (
    <>
      {/* Visual Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition"
        title="Visual Search"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="hidden md:inline text-sm">Visual Search</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold">Visual Search</h2>
                <p className="text-gray-600 text-sm mt-1">Upload an image to find similar products</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  resetSearch()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedImage ? (
                /* Upload Area */
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
                  <p className="text-gray-600 mb-4">
                    Take a photo or upload an image of a fashion item you love
                  </p>
                  <label className="inline-block bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition cursor-pointer">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : !results ? (
                /* Preview & Search */
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={resetSearch}
                      className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
                  >
                    {searching ? (
                      <>
                        <span className="inline-block animate-spin mr-2">⏳</span>
                        Analyzing image...
                      </>
                    ) : (
                      '🔍 Find Similar Items'
                    )}
                  </button>
                </div>
              ) : (
                /* Results */
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={selectedImage}
                      alt="Search"
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{results.description}</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.suggestions.map((suggestion, index) => (
                          <span key={index} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={resetSearch}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      {results.matches.length} Matching Products
                    </h3>
                    {results.matches.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {results.matches.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              navigate(`/product/${product.id}`)
                              setIsOpen(false)
                            }}
                            className="cursor-pointer group"
                          >
                            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                            </div>
                            <h4 className="text-sm font-medium truncate">{product.name}</h4>
                            <p className="text-sm text-gray-600">${product.price}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No matching products found. Try a different image.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VisualSearch
