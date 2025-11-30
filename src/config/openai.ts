/// <reference types="vite/client" />
import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key is not defined in environment variables')
}

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, use backend API for OpenAI calls
})

export const OPENAI_MODELS = {
  GPT4: 'gpt-4',
  GPT4_TURBO: 'gpt-4-turbo-preview',
  GPT35_TURBO: 'gpt-3.5-turbo',
  GPT4_VISION: 'gpt-4-vision-preview'
} as const
