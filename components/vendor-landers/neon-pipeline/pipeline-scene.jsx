"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

const GREEN = "#03563E"
const MAGENTA = "#FF006E"
const TEAL = "#00D4AA"

const NODE_POSITIONS = [
  [-3.2, 0.8, -1],
  [-1.6, -0.4, 0.5],
  [0, 0.6, -0.8],
  [1.6, -0.2, 0.3],
  [3.2, 0.5, -0.5],
]

const NODE_COLORS = [GREEN, TEAL, MAGENTA, TEAL, GREEN]

function PipelineNodes({ groupRef }) {
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.12
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  return (
    <group ref={groupRef}>
      {NODE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={NODE_COLORS[i]}
            emissive={NODE_COLORS[i]}
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
      {NODE_POSITIONS.slice(0, -1).map((from, i) => {
        const to = NODE_POSITIONS[i + 1]
        const mid = [
          (from[0] + to[0]) / 2,
          (from[1] + to[1]) / 2 + 0.35,
          (from[2] + to[2]) / 2,
        ]
        const points = [from, mid, to]
        return (
          <Line
            key={`line-${i}`}
            points={points}
            color={i % 2 === 0 ? TEAL : MAGENTA}
            lineWidth={1.5}
            transparent
            opacity={0.45}
            dashed
            dashSize={0.15}
            gapSize={0.08}
          />
        )
      })}
    </group>
  )
}

function ParticleField({ count = 120 }) {
  const ref = useRef(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color(GREEN),
      new THREE.Color(MAGENTA),
      new THREE.Color(TEAL),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
      const c = palette[i % 3]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0008
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function SceneContent() {
  const groupRef = useRef(null)

  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 8, 22]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-4, 2, 2]} intensity={0.4} color={TEAL} />
      <pointLight position={[4, -1, 1]} intensity={0.35} color={MAGENTA} />
      <ParticleField />
      <PipelineNodes groupRef={groupRef} />
    </>
  )
}

export default function PipelineScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
