"use client"

import { Marquee } from "@/components/vendor-landers/shared/motion-primitives"

const ITEMS = [
  "Reseller Infrastructure",
  "Bundle Architecture",
  "Paystack Payouts",
  "Ghana-first Commerce",
  "Vendor Governance",
  "Scale Without Hiring",
]

export function MarqueeBand() {
  return (
    <section className="border-y border-[#03563E]/10 bg-[#FAF8F5] py-5">
      <Marquee speed={35} className="flex">
        <div className="flex items-center gap-0">
          {ITEMS.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="mx-8 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.35em] text-[#1A1A18]/80 md:text-base">
                {item}
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-black text-[#03563E]/30" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  )
}
