"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Upload, Package, Users, ShoppingCart, Wallet } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export const PIPELINE_STEPS = [
  {
    icon: Upload,
    label: "UPLOAD",
    desc: "Drop your catalog — products, SKUs, and media sync in seconds.",
    color: "#03563E",
  },
  {
    icon: Package,
    label: "BUNDLE",
    desc: "Configure wholesale tiers, margins, and bundle pricing rules.",
    color: "#00D4AA",
  },
  {
    icon: Users,
    label: "RESELL",
    desc: "Recruit reseller nodes — approve, track, and rank performance.",
    color: "#FF006E",
  },
  {
    icon: ShoppingCart,
    label: "ORDERS",
    desc: "Monitor every order from placement through delivery in real time.",
    color: "#03563E",
  },
  {
    icon: Wallet,
    label: "PAYOUT",
    desc: "Collect vendor payouts via Paystack — every cedi accounted for.",
    color: "#00D4AA",
  },
]

export function PipelineScroll() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const progressRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const progress = progressRef.current
    if (!section || !pin) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=400%",
          pin: pin,
          scrub: 0.8,
          anticipatePin: 1,
        },
      })

      tl.to(progress, { scaleX: 1, ease: "none", duration: 5 }, 0)

      stepRefs.current.forEach((el, i) => {
        if (!el) return
        const enter = i * 1
        tl.to(
          el,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
          },
          enter
        )
        if (i < PIPELINE_STEPS.length - 1) {
          tl.to(
            el,
            {
              opacity: 0.2,
              scale: 0.92,
              y: -20,
              filter: "blur(2px)",
              duration: 0.6,
              ease: "power2.in",
            },
            enter + 0.9
          )
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative">
      <div ref={pinRef} className="flex min-h-screen flex-col justify-center py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.45em] text-[#FF006E]">
                Pipeline
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase tracking-tight text-neutral-900 md:text-6xl">
                Five nodes.
                <br />
                <span className="text-[#03563E]">One flow.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-neutral-500">
              Scroll to traverse the vendor commerce pipeline — from catalog upload to bank payout.
            </p>
          </div>

          <div className="relative mb-8 h-1 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              ref={progressRef}
              className="np-pipeline-line h-full w-full rounded-full bg-gradient-to-r from-[#03563E] via-[#00D4AA] to-[#FF006E]"
            />
          </div>

          <div className="relative grid min-h-[320px] place-items-center md:min-h-[280px]">
            {PIPELINE_STEPS.map(({ icon: Icon, label, desc, color }, i) => (
              <div
                key={label}
                ref={(el) => {
                  stepRefs.current[i] = el
                }}
                className="np-pipeline-step np-glass absolute inset-x-4 mx-auto max-w-2xl rounded-2xl p-8 md:inset-x-auto md:p-10"
                style={{ opacity: i === 0 ? 1 : 0.25 }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-neutral-400">
                        0{i + 1}
                      </span>
                      <span
                        className="font-[family-name:var(--font-display)] text-2xl font-extrabold uppercase tracking-wide md:text-3xl"
                        style={{ color }}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="text-neutral-600">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 hidden justify-center gap-3 md:flex">
            {PIPELINE_STEPS.map(({ label, color }) => (
              <span
                key={label}
                className="rounded-full px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider"
                style={{ backgroundColor: `${color}12`, color }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
