import { openai, OPENAI_MODELS } from '../config/openai'
import type { Product } from '../types'

/**
 * AI Chatbot for customer support
 */
export const chatWithAssistant = async (
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context?: {
    products?: Product[]
    userOrders?: any[]
    cartItems?: any[]
  }
): Promise<string> => {
  try {
    const systemPrompt = `You are a sophisticated AI shopping assistant for Quarterends, a luxury fashion e-commerce platform.

Your role:
- Help customers find the perfect products
- Answer questions about products, sizing, materials, and care
- Provide style advice and recommendations
- Assist with orders, shipping, and returns
- Maintain an elegant, professional, and helpful tone

${context?.products ? `Available Products: ${context.products.length} items in catalog` : ''}
${context?.cartItems ? `Customer's Cart: ${context.cartItems.length} items` : ''}

Guidelines:
- Be concise but informative (2-3 sentences max per response)
- Use elegant, sophisticated language
- If you don't know something, politely say so and offer to help differently
- For order/account issues, suggest contacting customer support
- Recommend products when relevant`

    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT35_TURBO,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 200
    })

    return response.choices[0]?.message?.content || 'I apologize, but I encountered an issue. How else may I assist you?'
  } catch (error) {
    console.error('Chatbot error:', error)
    return 'I apologize for the inconvenience. Please try again or contact our support team for assistance.'
  }
}

/**
 * Visual search using GPT-4 Vision
 */
export const visualSearch = async (
  imageUrl: string,
  products: Product[]
): Promise<{
  matches: Product[]
  description: string
  suggestions: string[]
}> => {
  try {
    const prompt = `Analyze this fashion/clothing item image and describe:
1. Item type (dress, shirt, shoes, etc.)
2. Color(s)
3. Style (casual, formal, elegant, etc.)
4. Key features
5. Material (if visible)

Provide a structured JSON response:
{
  "itemType": "...",
  "colors": ["...", "..."],
  "style": "...",
  "features": ["...", "..."],
  "material": "..."
}`

    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT4_VISION,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 300
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from vision API')
    }

    // Parse AI response
    const analysis = JSON.parse(content)

    // Match products based on AI analysis
    const matches = products.filter(product => {
      let score = 0
      
      // Match category/type
      const itemType = analysis.itemType?.toLowerCase() || ''
      if (product.category.toLowerCase().includes(itemType) || 
          product.name.toLowerCase().includes(itemType)) {
        score += 3
      }

      // Match colors
      const productColors = product.colors.map(c => c.name.toLowerCase())
      const searchColors = (analysis.colors || []).map((c: string) => c.toLowerCase())
      if (searchColors.some((color: string) => productColors.includes(color))) {
        score += 2
      }

      // Match style tags
      const style = analysis.style?.toLowerCase() || ''
      if (product.tags.some(tag => tag.toLowerCase().includes(style))) {
        score += 2
      }

      return score > 0
    })

    // Sort by relevance and return top matches
    const sortedMatches = matches.slice(0, 8)

    return {
      matches: sortedMatches,
      description: `Found ${sortedMatches.length} similar ${analysis.itemType || 'items'} in ${analysis.style || ''} style`,
      suggestions: [
        `Try searching for: ${analysis.itemType}`,
        `Filter by color: ${(analysis.colors || []).join(', ')}`,
        `Browse ${analysis.style} collection`
      ]
    }
  } catch (error) {
    console.error('Visual search error:', error)
    
    // Fallback to basic matching
    return {
      matches: products.slice(0, 8),
      description: 'Here are some popular items from our collection',
      suggestions: [
        'Try uploading a different image',
        'Browse our featured collection',
        'Use text search for specific items'
      ]
    }
  }
}

/**
 * Get quick product suggestions based on query
 */
export const getQuickSuggestions = async (
  query: string,
  products: Product[]
): Promise<Product[]> => {
  try {
    const prompt = `Given this search query: "${query}"
    
From these products, suggest the 4 most relevant ones:
${products.map(p => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Tags: ${p.tags.join(', ')}`).join('\n')}

Return ONLY a JSON array of product IDs: ["id1", "id2", "id3", "id4"]`

    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.GPT35_TURBO,
      messages: [
        {
          role: 'system',
          content: 'You are a fashion search expert. Return only valid JSON arrays.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 100
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      return products.slice(0, 4)
    }

    const suggestedIds = JSON.parse(content.trim())
    const suggestions = products.filter(p => suggestedIds.includes(p.id))
    
    return suggestions.length > 0 ? suggestions : products.slice(0, 4)
  } catch (error) {
    console.error('Quick suggestions error:', error)
    return products.slice(0, 4)
  }
}
