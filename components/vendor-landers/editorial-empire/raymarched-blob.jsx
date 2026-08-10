"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

vec3 colCream = vec3(0.98, 0.97, 0.94);
vec3 colMint  = vec3(0.62, 0.82, 0.70);
vec3 colSage  = vec3(0.45, 0.68, 0.55);
vec3 colPale  = vec3(0.88, 0.94, 0.88);

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float map(vec3 p) {
  vec3 q = p;
  float t = uTime * 0.3;

  q.x += sin(t + q.y * 1.6) * 0.2;
  q.y += cos(t * 0.7 + q.z * 1.4) * 0.16;
  q.z += sin(t * 0.9 + q.x * 2.0) * 0.18;

  vec2 m = (uMouse - 0.5) * 2.8;
  q.xy += m * 0.4;

  float d = sdSphere(q, 0.7);
  d += sin(q.x * 2.2 + t) * 0.1 + sin(q.y * 2.8 + t * 0.6) * 0.07;
  return d;
}

vec3 calcNormal(vec3 p) {
  const float e = 0.001;
  return normalize(vec3(
    map(p + vec3(e, 0.0, 0.0)) - map(p - vec3(e, 0.0, 0.0)),
    map(p + vec3(0.0, e, 0.0)) - map(p - vec3(0.0, e, 0.0)),
    map(p + vec3(0.0, 0.0, e)) - map(p - vec3(0.0, 0.0, e))
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

  vec3 ro = vec3(uv * 2.2, 3.2);
  vec3 rd = vec3(0.0, 0.0, -1.0);

  float t = 0.0;
  float d = 0.0;
  vec3 p;

  for (int i = 0; i < 72; i++) {
    p = ro + rd * t;
    d = map(p);
    if (d < 0.001) break;
    t += d * 0.85;
    if (t > 7.0) break;
  }

  vec3 bg = mix(colCream, colPale, vUv.y * 0.6 + vUv.x * 0.2);

  if (t < 7.0 && d < 0.001) {
    vec3 n = calcNormal(p);
    float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 2.2);
    float shade = dot(n, normalize(vec3(0.2, 0.9, 0.4))) * 0.5 + 0.5;
    vec3 col = mix(colSage, colMint, shade);
    col = mix(col, vec3(1.0), fresnel * 0.55);
    float blend = 0.42;
    gl_FragColor = vec4(mix(bg, col, blend), 1.0);
  } else {
    gl_FragColor = vec4(bg, 1.0);
  }
}
`

function BlobMesh({ mouse }) {
  const matRef = useRef(null)

  useFrame(({ clock, size }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    matRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y)
    matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

function BlobScene({ mouse }) {
  return (
    <>
      <BlobMesh mouse={mouse} />
    </>
  )
}

export function RaymarchedBlob() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-full w-full">
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{ alpha: false, antialias: true }}
        style={{ background: "#FAF8F5" }}
        dpr={[1, 1.5]}
      >
        <BlobScene mouse={mouse} />
      </Canvas>
    </div>
  )
}
