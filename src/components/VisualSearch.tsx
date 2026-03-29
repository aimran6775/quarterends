import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockProducts } from '../data/products'
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
      // Use mock products directly
      const products = mockProducts

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
        className="text-gray-400 hover:text-gray-900 transition-colors"
        title="Visual Search"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6">
          <div className="bg-white max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 animate-fade-in">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium tracking-tight">Visual search</h2>
                <p className="text-xs text-gray-400 mt-0.5">Upload an image to find similar items</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  resetSearch()
                }}
                className="text-gray-300 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!selectedImage ? (
                /* Upload Area */
                <div className="border border-dashed border-gray-200 p-16 text-center">
                  <svg className="w-6 h-6 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-400 mb-4">Drop an image or</p>
                  <label className="text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors cursor-pointer">
                    browse files
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
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full max-h-80 object-contain border border-gray-100"
                    />
                    <button
                      onClick={resetSearch}
                      className="absolute top-3 right-3 w-7 h-7 bg-white border border-gray-100 flex items-center justify-center hover:border-gray-300 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="w-full bg-gray-900 text-white py-2.5 text-sm hover:bg-gray-700 transition-colors disabled:opacity-40"
                  >
                    {searching ? 'Analyzing...' : 'Find similar items'}
                  </button>
                </div>
              ) : (
                /* Results */
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50">
                    <img
                      src={selectedImage}
                      alt="Search"
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm mb-2">{results.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {results.suggestions.map((suggestion, index) => (
                          <span key={index} className="text-[10px] text-gray-400 border border-gray-100 px-2 py-0.5">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={resetSearch}
                      className="text-gray-300 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                      {results.matches.length} matches
                    </p>
                    {results.matches.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {results.matches.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              navigate(`/product/${product.id}`)
                              setIsOpen(false)
                            }}
                            className="cursor-pointer group"
                          >
                            <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-2">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                              />
                            </div>
                            <p className="text-xs truncate">{product.name}</p>
                            <p className="text-xs text-gray-400">${product.price}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-12">
                        No matches found. Try another image.
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
