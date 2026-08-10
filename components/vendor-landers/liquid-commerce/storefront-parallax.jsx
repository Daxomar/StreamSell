"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Store, Wifi, Battery, Signal } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  { name: "Shea Glow Bundle", price: "GH₵ 85", tag: "Best seller" },
  { name: "Kente Mini Pack", price: "GH₵ 120", tag: "New" },
  { name: "Accra Essentials", price: "GH₵ 65", tag: "Bundle" },
]

export function StorefrontParallax() {
  const sectionRef = useRef(null)
  const phoneRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const phone = phoneRef.current
    if (!section || !phone) return

    const ctx = gsap.context(() => {
      gsap.to(phone, {
        y: -80,
        rotateY: -8,
        rotateX: 4,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative flex justify-center py-8 md:py-0">
      <div
        ref={phoneRef}
        className="relative w-full max-w-[280px] will-change-transform"
        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      >
        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#03563E]/10 via-[#C4A962]/10 to-transparent blur-2xl" />
        <div className="relative rounded-[2.75rem] border border-neutral-200/80 bg-white p-3 shadow-[0_32px_64px_-16px_rgba(3,86,62,0.15)]">
          <div className="overflow-hidden rounded-[2.25rem] bg-[#FAFAF7]">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 py-2 text-[10px] text-neutral-400">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <Battery className="h-3 w-3" />
              </div>
            </div>

            {/* Store header */}
            <div className="bg-gradient-to-br from-[#03563E] to-[#2E6B52] px-5 py-8 text-center text-white">
              <Store className="mx-auto mb-2 h-7 w-7 opacity-90" />
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold">Adwoa&apos;s Market</p>
              <p className="mt-1 text-xs text-white/70">Powered by Vendly · Accra</p>
            </div>

            {/* Products */}
            <div className="space-y-3 p-4">
              {PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm"
                >
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-[#03563E]/20 to-[#C4A962]/30" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-800">{p.name}</p>
                    <p className="text-xs font-semibold text-[#03563E]">{p.price}</p>
                  </div>
                  <span className="rounded-full bg-[#C4A962]/15 px-2 py-0.5 text-[10px] font-medium text-[#8a7340]">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 px-4 py-3 text-center">
              <div className="inline-block rounded-full bg-[#03563E] px-6 py-2 text-xs font-semibold text-white">
                Buy now via reseller
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
