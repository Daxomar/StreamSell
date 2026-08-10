"use client"

import { Marquee } from "@/components/vendor-landers/shared/motion-primitives"
import { MARQUEE_ITEMS, THEME } from "./constants"
import { CheckCircle } from "lucide-react"

export default function TrustMarquee() {
  const items = MARQUEE_ITEMS.map((item) => (
    <span
      key={item}
      className="mx-6 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide md:text-base"
      style={{ color: THEME.forest }}
    >
      <CheckCircle className="h-4 w-4" style={{ color: THEME.amber }} />
      {item}
    </span>
  ))

  return (
    <section className="relative z-10 border-y border-[#E8A838]/15 bg-white/50 py-5 backdrop-blur-sm">
      <Marquee speed={35} className="py-1">
        {items}
      </Marquee>
    </section>
  )
}
