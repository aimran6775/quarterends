import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import { Product } from '../../types'
import { generateProductDescription, generateProductImages, urlToFile } from '../../utils/ai'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [imageGenerating, setImageGenerating] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'women',
    sizes: [] as string[],
    colors: [] as Array<{ name: string; hex: string }>,
    inventory: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    },
    featured: false,
    newArrival: false,
    tags: [] as string[]
  })
  
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    if (!id) return
    setLoading(true)
    try {
      const productSnap = await getDoc(doc(db, 'products', id))
      if (productSnap.exists()) {
        const data = productSnap.data() as Product
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          compareAtPrice: data.compareAtPrice?.toString() || '',
          category: data.category,
          sizes: data.sizes,
          colors: data.colors,
          inventory: {
            S: data.inventory.S || 0,
            M: data.inventory.M || 0,
            L: data.inventory.L || 0,
            XL: data.inventory.XL || 0
          },
          featured: data.featured || false,
          newArrival: data.newArrival || false,
          tags: data.tags || []
        })
        setExistingImages(data.images)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(prev => [...prev, ...files])
    }
  }

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploadPromises = images.map(async (file, index) => {
      const storageRef = ref(storage, `products/${productId}/${Date.now()}_${index}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    })
    return await Promise.all(uploadPromises)
  }

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleInventoryChange = (size: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [size]: parseInt(value) || 0
      }
    }))
  }

  const addColor = () => {
    const colorName = prompt('Enter color name:')
    const colorHex = prompt('Enter color hex code (e.g., #000000):')
    if (colorName && colorHex) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { name: colorName, hex: colorHex }]
      }))
    }
  }

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const generateAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a product name first')
      return
    }
    
    setAiGenerating(true)
    try {
      const description = await generateProductDescription(
        formData.name,
        formData.category,
        undefined,
        formData.tags
      )
      setFormData(prev => ({ ...prev, description }))
    } catch (error) {
      console.error('Error generating description:', error)
      alert('Failed to generate AI description. Please try again.')
    } finally {
      setAiGenerating(false)
    }
  }

  const generateAIImages = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter a description for the product images')
      return
    }

    setImageGenerating(true)
    try {
      // Generate 3 product images
      const imageUrls = await generateProductImages(imagePrompt, 3)
      
      // Convert URLs to File objects
      const imageFiles = await Promise.all(
        imageUrls.map((url, index) => 
          urlToFile(url, `ai-generated-${Date.now()}-${index}.png`)
        )
      )

      // Add to images state
      setImages(prev => [...prev, ...imageFiles])
      setImagePrompt('')
      alert(`✓ Generated ${imageFiles.length} images successfully!`)
    } catch (error: any) {
      console.error('Error generating images:', error)
      alert(`Failed to generate images: ${error.message || 'Please try again'}`)
    } finally {
      setImageGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        inventory: formData.inventory,
        featured: formData.featured,
        newArrival: formData.newArrival,
        tags: formData.tags,
        images: existingImages,
        updatedAt: serverTimestamp()
      }

      if (id) {
        // Update existing product
        if (images.length > 0) {
          setUploading(true)
          const newImageUrls = await uploadImages(id)
          productData.images = [...existingImages, ...newImageUrls]
          setUploading(false)
        }
        await updateDoc(doc(db, 'products', id), productData)
        alert('Product updated successfully!')
      } else {
        // Create new product
        const docRef = await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        })
        
        if (images.length > 0) {
          setUploading(true)
          const imageUrls = await uploadImages(docRef.id)
          await updateDoc(doc(db, 'products', docRef.id), {
            images: imageUrls
          })
          setUploading(false)
        }
        alert('Product created successfully!')
      }
      
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (loading && id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600">Fill in the product details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={aiGenerating}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm disabled:opacity-50"
                >
                  {aiGenerating ? 'Generating...' : '✨ Generate with AI'}
                </button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare at Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          
          {/* AI Image Generation */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-900 mb-2">
              🎨 AI Image Generation
            </h3>
            <p className="text-xs text-purple-700 mb-3">
              Describe the product images you want to generate (e.g., "black merino wool sweater on a model")
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="E.g., elegant black dress on a fashion model, studio lighting"
                className="flex-1 px-4 py-2 border border-purple-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                disabled={imageGenerating}
              />
              <button
                type="button"
                onClick={generateAIImages}
                disabled={imageGenerating || !imagePrompt.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {imageGenerating ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Generating...
                  </>
                ) : (
                  '✨ Generate Images'
                )}
              </button>
            </div>
            {imageGenerating && (
              <p className="text-xs text-purple-600 mt-2">
                This may take 15-30 seconds per image. Generating 3 images...
              </p>
            )}
          </div>

          {/* Manual Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Upload Images Manually
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
            {images.map((file, index) => (
              <div key={`new-${index}`} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index, false)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Variants</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes
            </label>
            <div className="flex gap-3">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded border-2 transition ${
                    formData.sizes.includes(size)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventory by Size
            </label>
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(formData.inventory).map((size) => (
                <div key={size}>
                  <label className="block text-xs text-gray-600 mb-1">{size}</label>
                  <input
                    type="number"
                    value={formData.inventory[size as keyof typeof formData.inventory]}
                    onChange={(e) => handleInventoryChange(size, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 text-sm text-gray-600"
              >
                + Add Color
              </button>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-5 h-5"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="newArrival"
                checked={formData.newArrival}
                onChange={(e) => setFormData(prev => ({ ...prev, newArrival: e.target.checked }))}
                className="w-5 h-5"
              />
              <label htmlFor="newArrival" className="text-sm font-medium text-gray-700">
                New Arrival
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Enter tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : uploading ? 'Uploading Images...' : id ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-8 py-3 border-2 border-gray-300 rounded hover:border-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
