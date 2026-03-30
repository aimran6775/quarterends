import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'ui-vendor': ['react-helmet-async'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['framer-motion', 'gsap']
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
