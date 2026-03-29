import { useState, useRef, useEffect } from 'react'
import { chatWithAssistant } from '../utils/chatbot'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useCart } from '../contexts/CartContext'
import type { Product } from '../types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Quarterends shopping assistant. How may I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { cart } = useCart()

  useEffect(() => {
    // Fetch products for context
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'))
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setProducts(productsData)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await chatWithAssistant(
        [...chatHistory, { role: 'user', content: input }],
        {
          products,
          cartItems: cart
        }
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'What\'s new this season?',
    'Help me find a dress',
    'What\'s your return policy?',
    'Track my order'
  ]

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-200 hover:bg-gray-300'
            : 'bg-gray-900 hover:bg-gray-700 shadow-sm'
        }`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[480px] bg-white flex flex-col border border-gray-100 shadow-sm animate-fade-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Assistant</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.content}</p>
                  <p className={`text-[10px] mt-1 ${
                    message.role === 'user' ? 'text-gray-400' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-5 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question)
                      setTimeout(() => handleSend(), 100)
                    }}
                    className="text-[10px] text-gray-400 border border-gray-100 px-2.5 py-1 hover:text-gray-900 hover:border-gray-300 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-5 py-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-0 py-1 border-0 border-b border-gray-100 focus:border-gray-900 focus:outline-none focus:ring-0 text-xs text-gray-900 placeholder:text-gray-300 bg-transparent transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
