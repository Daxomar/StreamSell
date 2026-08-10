"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextReveal } from "@/components/vendor-landers/shared/motion-primitives"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    num: "01",
    title: "Bundle Architecture",
    desc: "Package products, set wholesale and retail tiers. Control margins across your entire catalog with precision.",
  },
  {
    num: "02",
    title: "Reseller Governance",
    desc: "Approve, track performance, and manage your network. Cut underperformers. Reward top sellers.",
  },
  {
    num: "03",
    title: "Financial Clarity",
    desc: "Sales reports, payout history, and Paystack integration. Every cedi accounted for.",
  },
]

function FeatureRow({ num, title, desc, index }) {
  const rowRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    const line = lineRef.current
    if (!row || !line) return

    const pathLength = line.getTotalLength()
    gsap.set(line, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

    const ctx = gsap.context(() => {
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: row,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })
    }, row)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rowRef} className="group relative grid gap-6 py-14 md:grid-cols-12 md:gap-8 md:py-20">
      {/* Connecting line — desktop */}
      {index < features.length - 1 && (
        <svg
          className="pointer-events-none absolute -bottom-2 left-[8.33%] hidden h-20 w-px overflow-visible md:block"
          style={{ width: "1px", height: "80px" }}
          aria-hidden
        >
          <line
            ref={lineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="80"
            stroke="#03563E"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
        </svg>
      )}

      <div className="relative md:col-span-2">
        <span className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,8vw,6rem)] font-black leading-none text-[#03563E]/15 transition-colors group-hover:text-[#03563E]/25">
          {num}
        </span>
        <div className="absolute left-0 top-1/2 hidden h-px w-16 -translate-y-1/2 bg-[#03563E]/30 md:block" />
      </div>

      <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight md:col-span-4 md:text-3xl lg:text-4xl">
        {title}
      </h3>

      <p className="text-base leading-relaxed text-neutral-600 md:col-span-6 md:text-lg">{desc}</p>
    </div>
  )
}

export function FeatureSpread() {
  return (
    <section className="relative border-t border-neutral-200/80 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-4 grid md:grid-cols-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#03563E] md:col-span-3">Platform</p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight md:col-span-9">
            <TextReveal text="Everything a serious vendor needs" />
          </h2>
        </div>

        <div className="mt-8 divide-y divide-neutral-200/80">
          {features.map((f, i) => (
            <FeatureRow key={f.num} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
