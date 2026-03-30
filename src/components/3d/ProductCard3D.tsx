import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'

interface ProductCard3DProps {
  children: ReactNode
  className?: string
}

export default function ProductCard3D({ children, className = '' }: ProductCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  })

  const shadowX = useTransform(mouseX, [0, 1], [10, -10])
  const shadowY = useTransform(mouseY, [0, 1], [10, -10])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ scale: { type: 'spring', stiffness: 300, damping: 20 } }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            x: shadowX,
            y: shadowY,
            filter: 'blur(20px)',
            background: 'rgba(0,0,0,0.08)',
            zIndex: -1,
          }}
        />
        {children}
      </motion.div>
    </div>
  )
}
