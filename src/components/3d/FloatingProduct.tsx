import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, useTexture, ContactShadows } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'

interface ProductMeshProps {
  imageUrl?: string
}

function WireframeFallback() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })

  return (
    <RoundedBox ref={ref} args={[1.6, 2, 0.2]} radius={0.08} smoothness={4}>
      <meshBasicMaterial color="#e5e7eb" wireframe />
    </RoundedBox>
  )
}

function TexturedProduct({ imageUrl }: { imageUrl: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  const texture = useTexture(imageUrl)
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
      ref.current.rotation.y += (pointer.x * 0.3 - ref.current.rotation.y) * 0.05
      ref.current.rotation.x += (pointer.y * 0.15 - ref.current.rotation.x) * 0.05
    }
  })

  return (
    <RoundedBox ref={ref} args={[1.6, 2, 0.2]} radius={0.08} smoothness={4}>
      <meshStandardMaterial map={texture} />
    </RoundedBox>
  )
}

function ProductMesh({ imageUrl }: ProductMeshProps) {
  const ref = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.3
      const targetY = pointer.x * 0.3
      const targetX = pointer.y * 0.15
      ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05
      ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05
    }
  })

  if (!imageUrl) {
    return <WireframeFallback />
  }

  return (
    <Suspense fallback={<WireframeFallback />}>
      <TexturedProduct imageUrl={imageUrl} />
    </Suspense>
  )
}

interface FloatingProductProps {
  imageUrl?: string
  className?: string
}

export default function FloatingProduct({ imageUrl, className = '' }: FloatingProductProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`w-full h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <ProductMesh imageUrl={imageUrl} />
        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.3}
          scale={4}
          blur={2.5}
          far={3}
        />
      </Canvas>
    </div>
  )
}
