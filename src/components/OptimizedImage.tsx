import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  width,
  height 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Fallback placeholder image
  const placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EQuarterends%3C/text%3E%3C/svg%3E'

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder while loading */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <img
        src={error ? placeholderSrc : src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true)
          setIsLoaded(true)
        }}
      />
    </div>
  )
}
