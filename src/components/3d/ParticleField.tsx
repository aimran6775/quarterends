import { Canvas, useFrame } from '@react-three/fiber'
import { PointMaterial, Points } from '@react-three/drei'
import { useRef, useMemo, useCallback } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 200
const FIELD_SIZE = 10
const PARTICLE_COLOR = '#d1d5db'

function ParticleSystem() {
  const ref = useRef<THREE.Points>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * FIELD_SIZE
      pos[i * 3 + 1] = (Math.random() - 0.5) * FIELD_SIZE
      pos[i * 3 + 2] = (Math.random() - 0.5) * FIELD_SIZE * 0.5
    }
    return pos
  }, [])

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handlePointerMove)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handlePointerMove)
      }
    }
  }, [handlePointerMove])

  useFrame((_, delta) => {
    if (!ref.current) return

    ref.current.rotation.y += delta * 0.015
    ref.current.rotation.x += delta * 0.008

    // Subtle push effect from mouse
    const mx = mousePos.current.x * 0.1
    const my = mousePos.current.y * 0.1
    ref.current.position.x += (mx - ref.current.position.x) * 0.02
    ref.current.position.y += (my - ref.current.position.y) * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={PARTICLE_COLOR}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  )
}

interface ParticleFieldProps {
  className?: string
}

export default function ParticleField({ className = '' }: ParticleFieldProps) {
  return (
    <div
      className={`fixed inset-0 -z-20 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  )
}
