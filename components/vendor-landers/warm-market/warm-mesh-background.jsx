"use client"

import { Suspense, useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const meshVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const meshFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = uv * aspect;
    vec2 mouse = uMouse * aspect;

    float blob1 = exp(-length(st - vec2(0.25, 0.65) - uMouse * 0.08) * 3.5);
    float blob2 = exp(-length(st - vec2(0.78, 0.38) + vec2(sin(uTime * 0.3) * 0.05, 0.0)) * 4.0);
    float blob3 = exp(-length(st - vec2(0.55, 0.82) + vec2(0.0, cos(uTime * 0.25) * 0.04)) * 3.2);

    vec3 cream = vec3(1.0, 0.976, 0.949);
    vec3 amber = vec3(0.91, 0.659, 0.22);
    vec3 forest = vec3(0.012, 0.337, 0.243);
    vec3 peach = vec3(0.98, 0.92, 0.85);

    vec3 col = cream;
    col = mix(col, peach, blob1 * 0.55);
    col = mix(col, amber, blob2 * 0.22);
    col = mix(col, forest, blob3 * 0.08);

    float mouseGlow = exp(-distance(st, mouse) * 2.8) * 0.12;
    col = mix(col, amber, mouseGlow);

    float grain = fract(sin(dot(uv * uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.015;

    gl_FragColor = vec4(col, 0.55);
  }
`

function WarmShader({ mouse }) {
  const matRef = useRef(null)
  const { size } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height]
  )

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uMouse.value.lerp(
      new THREE.Vector2(mouse.current.x, mouse.current.y),
      0.06
    )
    matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={meshVertex}
        fragmentShader={meshFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function WarmMeshScene({ mouse }) {
  return (
    <Suspense fallback={null}>
      <WarmShader mouse={mouse} />
    </Suspense>
  )
}

export default function WarmMeshBackground() {
  const mouse = useRef({ x: 0.5, y: 0.5 })

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouse.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* CSS warm gradient blobs */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 15% 20%, rgba(232, 168, 56, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 85% 15%, rgba(3, 86, 62, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 60% 70% at 50% 90%, rgba(245, 214, 163, 0.35) 0%, transparent 55%),
            linear-gradient(180deg, #FFF9F2 0%, #FFF4E8 50%, #FFF9F2 100%)
          `,
        }}
      />
      <div
        className="absolute -left-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,168,56,0.35) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(3,86,62,0.2) 0%, transparent 70%)" }}
      />

      {/* WebGL warm mesh overlay */}
      <div className="absolute inset-0" onPointerMove={handlePointerMove}>
        <Canvas
          className="h-full w-full"
          camera={{ position: [0, 0, 1], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <WarmMeshScene mouse={mouse} />
        </Canvas>
      </div>

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
