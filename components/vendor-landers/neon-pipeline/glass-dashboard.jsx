"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BarChart3, Users, Wallet, TrendingUp } from "lucide-react"
import { AnimatedCounter } from "@/components/vendor-landers/animated-counter"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { label: "Revenue", suffix: "K", prefix: "₵", end: 24, icon: TrendingUp, color: "#03563E" },
  { label: "Resellers", end: 847, icon: Users, color: "#FF006E" },
  { label: "Fulfillment", end: 98, suffix: "%", icon: BarChart3, color: "#00D4AA" },
]

const FEATURES = [
  { icon: BarChart3, text: "Real-time sales analytics" },
  { icon: Users, text: "Reseller performance rankings" },
  { icon: Wallet, text: "One-click Paystack payouts" },
]

export function GlassDashboard() {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const barRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return

    const ctx = gsap.context(() => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        rotateX: 8,
        transformPerspective: 800,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      })

      barRefs.current.forEach((bar, i) => {
        if (!bar) return
        gsap.to(bar, {
          scaleX: 1,
          duration: 0.8,
          delay: 0.2 + i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const chartHeights = [72, 58, 85, 64, 92, 78, 88]

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div ref={cardRef} className="relative mx-auto w-full max-w-lg lg:mx-0">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#00D4AA]/20 via-transparent to-[#FF006E]/15 blur-2xl" />
            <div className="np-glass-strong relative overflow-hidden rounded-2xl p-1">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              <div className="relative overflow-hidden rounded-xl p-6 md:p-8">
                <div className="np-scan-line pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#00D4AA]/10 to-transparent" />

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      Command Center
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-xl font-extrabold uppercase text-neutral-900">
                      Vendor Dashboard
                    </p>
                  </div>
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4AA] opacity-40" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-[#03563E]" />
                  </span>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-3">
                  {STATS.map(({ label, end, prefix = "", suffix = "", icon: Icon, color }, i) => (
                    <div key={label} className="np-glass rounded-xl p-4">
                      <Icon className="mb-2 h-4 w-4" style={{ color }} />
                      <p className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums text-neutral-900 md:text-xl">
                        {label === "Revenue" ? (
                          <>
                            {prefix}
                            <AnimatedCounter end={end} />
                            .5{suffix}
                          </>
                        ) : (
                          <>
                            {prefix}
                            <AnimatedCounter end={end} />
                            {suffix}
                          </>
                        )}
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-wider text-neutral-400">{label}</p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.05]">
                        <div
                          ref={(el) => {
                            barRefs.current[i] = el
                          }}
                          className="np-stat-bar h-full rounded-full"
                          style={{ backgroundColor: color, width: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex h-28 items-end gap-1.5 rounded-xl border border-black/[0.04] bg-white/40 p-4">
                  {chartHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, ${i % 2 === 0 ? "#03563E" : "#00D4AA"}, ${i % 3 === 0 ? "#FF006E40" : "#03563E40"})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.4em] text-[#00D4AA]">
              Analytics
            </p>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase leading-tight text-neutral-900 md:text-5xl">
              Command
              <br />
              <span className="text-[#03563E]">center</span>
            </h2>
            <p className="mb-8 max-w-md text-neutral-600">
              Glass-clear visibility into revenue, reseller performance, and fulfillment — built for vendors who scale without guessing.
            </p>
            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="np-glass flex items-center gap-4 rounded-xl px-5 py-4 text-neutral-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#03563E]/10">
                    <Icon className="h-5 w-5 text-[#03563E]" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
