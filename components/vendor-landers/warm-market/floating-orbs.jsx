"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sphere } from "@react-three/drei"

const ORBS = [
  { position: [-2.2, 0.8, -1.5], scale: 0.45, color: "#03563E", speed: 0.4 },
  { position: [2.4, -0.3, -2], scale: 0.55, color: "#E8A838", speed: 0.3 },
  { position: [-1.5, -1.2, -1], scale: 0.35, color: "#F5D4A0", speed: 0.5 },
  { position: [1.8, 1.1, -2.5], scale: 0.4, color: "#2E8B6E", speed: 0.35 },
  { position: [0.3, 0.5, -1.8], scale: 0.28, color: "#FFD89B", speed: 0.45 },
  { position: [-0.8, 1.4, -2.2], scale: 0.32, color: "#E8A838", speed: 0.38 },
  { position: [1.2, -1.0, -1.2], scale: 0.38, color: "#03563E", speed: 0.42 },
]

function Orb({ position, scale, color, speed }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * speed * 0.15
    ref.current.rotation.y = t * speed * 0.25
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.5}>
      <Sphere ref={ref} args={[scale, 48, 48]} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.15}
          transparent
          opacity={0.82}
        />
      </Sphere>
    </Float>
  )
}

function OrbsGroup({ mouse }) {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const mx = (mouse.current.x - 0.5) * 0.6
    const my = (mouse.current.y - 0.5) * 0.4
    groupRef.current.rotation.y += (mx - groupRef.current.rotation.y) * 0.02
    groupRef.current.rotation.x += (-my - groupRef.current.rotation.x) * 0.02
    groupRef.current.position.x += (mx * 0.3 - groupRef.current.position.x) * 0.04
    groupRef.current.position.y += (-my * 0.2 - groupRef.current.position.y) * 0.04
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#FFF9F2" />
      <directionalLight position={[-3, 2, 4]} intensity={0.5} color="#E8A838" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#03563E" />
      {ORBS.map((orb, i) => (
        <Orb key={i} {...orb} />
      ))}
    </group>
  )
}

function Scene({ mouse }) {
  return (
    <Suspense fallback={null}>
      <OrbsGroup mouse={mouse} />
    </Suspense>
  )
}

export default function FloatingOrbs({ className = "" }) {
  const mouse = useRef({ x: 0.5, y: 0.5 })

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    }
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      onPointerMove={handlePointerMove}
    >
      <Canvas
        className="pointer-events-auto h-full w-full"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  )
}
