"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

const RESELLERS = [
  { id: 1, label: "Kumasi", angle: 0 },
  { id: 2, label: "Tema", angle: 51 },
  { id: 3, label: "Tamale", angle: 102 },
  { id: 4, label: "Cape Coast", angle: 153 },
  { id: 5, label: "Takoradi", angle: 204 },
  { id: 6, label: "Accra", angle: 255 },
  { id: 7, label: "Ho", angle: 306 },
]

export function NetworkGraph() {
  const svgRef = useRef(null)
  const orbitRef = useRef(null)

  useEffect(() => {
    const orbit = orbitRef.current
    if (!orbit) return

    gsap.to(orbit, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    })

    const nodes = svgRef.current?.querySelectorAll("[data-node]")
    nodes?.forEach((node, i) => {
      gsap.to(node, {
        y: "+=6",
        duration: 2 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })
  }, [])

  const cx = 200
  const cy = 200
  const radius = 130

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg ref={svgRef} viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        {/* Orbit rings */}
        {[radius + 30, radius, radius - 28].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#03563E"
            strokeOpacity={0.08 + i * 0.04}
            strokeWidth={1}
            strokeDasharray={i === 1 ? "4 8" : undefined}
          />
        ))}

        <g ref={orbitRef}>
          {RESELLERS.map(({ id, label, angle }) => {
            const rad = (angle * Math.PI) / 180
            const x = cx + Math.cos(rad) * radius
            const y = cy + Math.sin(rad) * radius
            return (
              <g key={id}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#C4A962"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                <g data-node transform={`translate(${x}, ${y})`}>
                  <circle r={22} fill="#FAFAF7" stroke="#C4A962" strokeWidth={1.5} />
                  <circle r={6} fill="#03563E" />
                  <text
                    y={36}
                    textAnchor="middle"
                    className="fill-neutral-500 text-[9px] font-medium"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {label}
                  </text>
                </g>
              </g>
            )
          })}
        </g>

        {/* Vendor center */}
        <g>
          <circle cx={cx} cy={cy} r={38} fill="#03563E" />
          <circle cx={cx} cy={cy} r={44} fill="none" stroke="#03563E" strokeOpacity={0.2} strokeWidth={2} />
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            YOU
          </text>
        </g>
      </svg>

      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle at center, rgba(3,86,62,0.05) 0%, transparent 70%)" }}
      />
    </div>
  )
}
