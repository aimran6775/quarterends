import { getOpenAI, OPENAI_MODELS } from '../config/openai'
import type { Product } from '../types'

/**
 * Generate AI-powered product description
 */
export const generateProductDescription = async (
  productName: string,
  category: string,
  material?: string,
  features?: string[]
): Promise<string> => {
  try {
    const prompt = `Write a compelling, elegant product description for an e-commerce luxury fashion website called "Quarterends". 

Product Name: ${productName}
Category: ${category}
${material ? `Material: ${material}` : ''}
${features && features.length > 0 ? `Key Features: ${features.join(', ')}` : ''}

Write a description that:
- Is 2-3 paragraphs long
- Emphasizes quality, craftsmanship, and style
- Uses sophisticated, aspirational language
- Highlights the product's unique features
- Encourages purchase without being overly promotional
- Focuses on how it will make the customer feel

Keep it classy and refined.`

    const client = await getOpenAI()
    if (!client) return 'Premium quality product crafted with attention to detail.'

    const response = await client.chat.completions.create({
      model: OPENAI_MODELS.GPT35_TURBO,
      messages: [
        {
          role: 'system',
          content: 'You are an expert luxury fashion copywriter specializing in elegant, sophisticated product descriptions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    })

    return response.choices[0]?.message?.content || 'Premium quality product crafted with attention to detail.'
  } catch (error) {
    console.error('Error generating product description:', error)
    return 'Premium quality product crafted with attention to detail.'
  }
}

/**
 * Get AI-powered product recommendations based on a product
 */
export const getProductRecommendations = async (
  currentProduct: Product,
  allProducts: Product[]
): Promise<Product[]> => {
  try {
    // Filter out current product and get candidate products
    const candidates = allProducts.filter(p => p.id !== currentProduct.id)
    
    if (candidates.length === 0) {
      return []
    }

    // Create product summaries for AI
    const candidatesSummary = candidates.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      tags: p.tags
    }))

    const prompt = `Given this product:
Name: ${currentProduct.name}
Category: ${currentProduct.category}
Subcategory: ${currentProduct.subcategory || 'N/A'}
Price: $${currentProduct.price}
Tags: ${currentProduct.tags.join(', ')}

From these available products:
${JSON.stringify(candidatesSummary, null, 2)}

Recommend exactly 4 products that would complement or appeal to someone interested in the current product. Consider:
- Similar style and category
- Complementary items (e.g., jacket with pants, shirt with shoes)
- Similar price range (±30%)
- Matching aesthetic and tags

Return ONLY a JSON array of product IDs, like: ["id1", "id2", "id3", "id4"]`

    const client = await getOpenAI()
    if (!client) return fallbackRecommendations(currentProduct, candidates)

    const response = await client.chat.completions.create({
      model: OPENAI_MODELS.GPT35_TURBO,
      messages: [
        {
          role: 'system',
          content: 'You are an expert fashion stylist and personal shopper. Return only valid JSON arrays of product IDs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return fallbackRecommendations(currentProduct, candidates)
    }

    // Parse AI response
    const recommendedIds = JSON.parse(content.trim())
    
    // Return products matching recommended IDs
    const recommendations = candidates.filter(p => recommendedIds.includes(p.id))
    
    // If we don't get enough, use fallback
    if (recommendations.length < 4) {
      return fallbackRecommendations(currentProduct, candidates)
    }

    return recommendations.slice(0, 4)
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    return fallbackRecommendations(currentProduct, allProducts.filter(p => p.id !== currentProduct.id))
  }
}

/**
 * Fallback recommendation logic when AI fails
 */
const fallbackRecommendations = (currentProduct: Product, candidates: Product[]): Product[] => {
  // Score products by similarity
  const scored = candidates.map(product => {
    let score = 0
    
    // Same category: +3 points
    if (product.category === currentProduct.category) score += 3
    
    // Same subcategory: +2 points
    if (product.subcategory === currentProduct.subcategory) score += 2
    
    // Similar price (±30%): +2 points
    const priceDiff = Math.abs(product.price - currentProduct.price) / currentProduct.price
    if (priceDiff <= 0.3) score += 2
    
    // Shared tags: +1 point per tag
    const sharedTags = product.tags.filter(tag => currentProduct.tags.includes(tag))
    score += sharedTags.length
    
    // Featured or bestseller: +1 point
    if (product.featured || product.bestseller) score += 1
    
    return { product, score }
  })
  
  // Sort by score and return top 4
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.product)
}

/**
 * Generate personalized product recommendations based on user behavior
 */
export const getPersonalizedRecommendations = async (
  userHistory: {
    viewedProducts: Product[]
    purchasedProducts: Product[]
    wishlistProducts: Product[]
  },
  allProducts: Product[]
): Promise<Product[]> => {
  try {
    const viewedIds = userHistory.viewedProducts.map(p => p.id)
    const purchasedIds = userHistory.purchasedProducts.map(p => p.id)
    const wishlistIds = userHistory.wishlistProducts.map(p => p.id)
    
    // Filter out already interacted products
    const candidates = allProducts.filter(
      p => !viewedIds.includes(p.id) && !purchasedIds.includes(p.id) && !wishlistIds.includes(p.id)
    )

    if (candidates.length === 0) {
      return []
    }

    // Analyze user preferences
    const viewedCategories = userHistory.viewedProducts.map(p => p.category)
    const preferredCategories = getMostCommon(viewedCategories, 3)
    
    const viewedTags = userHistory.viewedProducts.flatMap(p => p.tags)
    const preferredTags = getMostCommon(viewedTags, 3)

    // Score candidates based on user preferences
    const scored = candidates.map(product => {
      let score = 0
      
      if (preferredCategories.includes(product.category)) score += 3
      if (preferredTags.some(tag => product.tags.includes(tag))) score += 2
      if (product.featured) score += 2
      if (product.newArrival) score += 1
      if (product.bestseller) score += 1
      
      return { product, score }
    })
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.product)
  } catch (error) {
    console.error('Error generating personalized recommendations:', error)
    return allProducts
      .filter(p => p.featured || p.bestseller)
      .slice(0, 8)
  }
}

/**
 * Utility: Get most common items from array
 */
const getMostCommon = <T>(arr: T[], count: number = 1): T[] => {
  const frequency = arr.reduce((acc, item) => {
    acc.set(item, (acc.get(item) || 0) + 1)
    return acc
  }, new Map<T, number>())
  
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([item]) => item)
}

/**
 * Generate SEO-optimized product title and meta description
 */
export const generateSEOContent = async (product: Product): Promise<{
  title: string
  metaDescription: string
}> => {
  try {
    const prompt = `Generate SEO content for this product:
    
Name: ${product.name}
Category: ${product.category}
Price: $${product.price}
Description: ${product.description}

Generate:
1. SEO Title (50-60 characters, include brand "Quarterends")
2. Meta Description (150-160 characters, compelling and keyword-rich)

Return as JSON: { "title": "...", "metaDescription": "..." }`

    const client = await getOpenAI()
    if (!client) return { title: `${product.name} - Quarterends`, metaDescription: product.description.slice(0, 160) }

    const response = await client.chat.completions.create({
      model: OPENAI_MODELS.GPT35_TURBO,
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const seoContent = JSON.parse(content.trim())
    return {
      title: seoContent.title || `${product.name} - Quarterends`,
      metaDescription: seoContent.metaDescription || product.description.slice(0, 160)
    }
  } catch (error) {
    console.error('Error generating SEO content:', error)
    return {
      title: `${product.name} - Quarterends`,
      metaDescription: product.description.slice(0, 160)
    }
  }
}

/**
 * Generate product images using DALL-E
 */
export const generateProductImages = async (
  productDescription: string,
  count: number = 3
): Promise<string[]> => {
  try {
    const prompt = `Professional e-commerce product photography: ${productDescription}. 
High-end luxury fashion photography style, clean white background, studio lighting, 
professional model wearing the product, elegant pose, high resolution, magazine quality.`

    const client = await getOpenAI()
    if (!client) throw new Error('AI not available')

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1, // DALL-E 3 only supports n=1
      size: "1024x1024",
      quality: "standard",
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image generated')
    }

    // For multiple images, we'll need to call multiple times
    if (count > 1) {
      const additionalPromises = Array.from({ length: count - 1 }, (_, i) => 
        client.images.generate({
          model: "dall-e-3",
          prompt: `${prompt} Variation ${i + 2}: different angle or styling.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        })
      )

      const additionalResults = await Promise.all(additionalPromises)
      const additionalUrls = additionalResults
        .map(result => result.data?.[0]?.url)
        .filter((url): url is string => !!url)

      return [imageUrl, ...additionalUrls]
    }

    return [imageUrl]
  } catch (error) {
    console.error('Error generating product images:', error)
    throw error
  }
}

/**
 * Convert image URL to File object for upload
 */
export const urlToFile = async (url: string, filename: string): Promise<File> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  } catch (error) {
    console.error('Error converting URL to file:', error)
    throw error
  }
}
