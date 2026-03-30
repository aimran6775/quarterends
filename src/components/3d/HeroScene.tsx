import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

const WIRE_COLOR = '#e5e7eb'

function WireframeTorus() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.15
      ref.current.rotation.y += delta * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={[-2, 0.5, 0]}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshBasicMaterial color={WIRE_COLOR} wireframe />
      </mesh>
    </Float>
  )
}

function RotatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
      ref.current.rotation.z += delta * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={ref} position={[2, -0.3, 0]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color={WIRE_COLOR} wireframe />
      </mesh>
    </Float>
  )
}

interface ParticlesProps {
  count: number
}

function Particles({ count }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
      ref.current.rotation.x += delta * 0.01
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={WIRE_COLOR}
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  )
}

function Scene() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const particleCount = isMobile ? 40 : 120

  return (
    <>
      <WireframeTorus />
      <RotatingOctahedron />
      <Particles count={particleCount} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
