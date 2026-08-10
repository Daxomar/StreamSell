"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Pearlescent palette — light ivory base with green + gold iridescence
  const vec3 PEARL   = vec3(0.980, 0.980, 0.969);
  const vec3 GREEN   = vec3(0.012, 0.337, 0.243);
  const vec3 GOLD    = vec3(0.769, 0.663, 0.384);
  const vec3 MINT    = vec3(0.72, 0.88, 0.82);
  const vec3 BLUSH   = vec3(0.96, 0.94, 0.90);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 mouse = uMouse * 0.5 + 0.5;

    float speed = 0.15 + uScroll * 0.35;
    float t = uTime * speed;

    // Mouse ripple — fluid disturbance
    vec2 toMouse = (uv - mouse) * aspect;
    float dist = length(toMouse);
    float ripple = sin(dist * 28.0 - t * 4.0) * exp(-dist * 3.5) * 0.04;
    ripple += sin(dist * 14.0 - t * 2.5) * exp(-dist * 2.0) * 0.025;

    vec2 flow = uv + vec2(
      fbm(uv * 3.0 + t * 0.3) - 0.5,
      fbm(uv * 3.0 + vec2(5.2, 1.3) + t * 0.25) - 0.5
    ) * 0.08;
    flow += normalize(toMouse + 0.001) * ripple;

    float n1 = fbm(flow * 4.0 + t * 0.4);
    float n2 = fbm(flow * 6.0 - t * 0.3 + vec2(3.1, 1.7));
    float n3 = fbm(flow * 2.5 + t * 0.2);

    // Iridescent pearlescent blend
    float irid = sin(n1 * 6.28 + n2 * 3.14 + t) * 0.5 + 0.5;
    vec3 col = mix(PEARL, BLUSH, n3 * 0.35);
    col = mix(col, MINT, smoothstep(0.35, 0.75, n1) * 0.25);
    col = mix(col, GREEN, smoothstep(0.55, 0.9, n2) * 0.18 * irid);
    col = mix(col, GOLD, smoothstep(0.6, 0.95, n1 * n2) * 0.22);

    // Subtle vignette for depth on light bg
    float vig = 1.0 - length((uv - 0.5) * aspect) * 0.35;
    col *= vig;

    // Soft pearl highlight
    col += vec3(0.04) * pow(n1, 3.0);

    gl_FragColor = vec4(col, 1.0);
  }
`

function FluidPlane({ mouseRef, scrollRef }) {
  const matRef = useRef(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)
    matRef.current.uniforms.uScroll.value = scrollRef.current
    matRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height)
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial ref={matRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  )
}

function FluidScene({ mouseRef, scrollRef }) {
  return <FluidPlane mouseRef={mouseRef} scrollRef={scrollRef} />
}

export function FluidBackground({ className = "" }) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      scrollRef.current = window.scrollY / max
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        style={{ background: "#FAFAF7" }}
      >
        <FluidScene mouseRef={mouseRef} scrollRef={scrollRef} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF7]/20 via-transparent to-[#FAFAF7]/60" />
    </div>
  )
}
