/// <reference types="vite/client" />

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key is not defined. AI features will be disabled.')
}

let _openai: any = null
let _initAttempted = false

export const getOpenAI = async () => {
  if (_initAttempted) return _openai
  _initAttempted = true

  if (!apiKey) return null

  try {
    const { default: OpenAI } = await import('openai')
    _openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    })
  } catch (e) {
    console.warn('Failed to initialize OpenAI:', e)
  }
  return _openai
}

export const openai = null as any // deprecated — use getOpenAI()

export const OPENAI_MODELS = {
  GPT4: 'gpt-4',
  GPT4_TURBO: 'gpt-4-turbo-preview',
  GPT35_TURBO: 'gpt-3.5-turbo',
  GPT4_VISION: 'gpt-4-vision-preview'
} as const
