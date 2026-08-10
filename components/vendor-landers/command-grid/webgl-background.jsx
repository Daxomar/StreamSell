"use client"

import { Suspense, useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const BG = new THREE.Color("#F7F9F8")
const ACCENT = new THREE.Color("#03563E")

const gridVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const gridFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float grid(vec2 st, float res) {
    vec2 grid = fract(st * res);
    float line = min(grid.x, grid.y);
    return smoothstep(0.0, 0.04, line);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 st = uv * aspect;

    float pulse = sin(uTime * 0.35) * 0.5 + 0.5;
    vec2 mouse = uMouse * aspect;
    float mouseDist = distance(st, mouse);
    float ripple = sin(mouseDist * 18.0 - uTime * 2.5) * exp(-mouseDist * 2.2) * 0.15;

    float g1 = grid(st + ripple, 24.0);
    float g2 = grid(st * 1.3 + vec2(uTime * 0.02, 0.0), 16.0);

    vec3 base = vec3(0.969, 0.976, 0.973);
    vec3 green = vec3(0.012, 0.337, 0.243);
    vec3 iridescent = mix(
      vec3(0.85, 0.95, 0.88),
      vec3(0.75, 0.92, 0.82),
      sin(st.x * 12.0 + uTime) * 0.5 + 0.5
    );

    float gridMask = (1.0 - g1) * 0.12 + (1.0 - g2) * 0.06;
    vec3 col = mix(base, iridescent, gridMask * (0.6 + pulse * 0.4));
    col = mix(col, green, gridMask * 0.35 * (1.0 - smoothstep(0.0, 0.35, mouseDist)));

    float vignette = smoothstep(1.2, 0.3, length(uv - 0.5));
    col *= mix(0.92, 1.0, vignette);

    gl_FragColor = vec4(col, 1.0);
  }
`

function ShaderPlane({ mouse }) {
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
      0.08
    )
    matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  })

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial ref={matRef} vertexShader={gridVertex} fragmentShader={gridFragment} uniforms={uniforms} />
    </mesh>
  )
}

function FloatingParticles({ mouse, count = 1200 }) {
  const pointsRef = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 3.2
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2.4
      arr[i * 3 + 2] = Math.random() * 0.5
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime
    const mx = (mouse.current.x - 0.5) * 2
    const my = (mouse.current.y - 0.5) * 2
    pointsRef.current.rotation.z = t * 0.015 + mx * 0.05
    pointsRef.current.rotation.x = my * 0.04
    pointsRef.current.position.x = mx * 0.08
    pointsRef.current.position.y = -my * 0.06
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.006}
        color={ACCENT}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Scene({ mouse }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <ShaderPlane mouse={mouse} />
      <FloatingParticles mouse={mouse} />
    </>
  )
}

export default function WebGLBackground() {
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 1], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
