"use client"

import { Marquee } from "@/components/vendor-landers/shared/motion-primitives"

const PHRASES = [
  "Reseller networks",
  "Mobile money ready",
  "Ghana-built",
  "Bundle pricing",
  "Paystack payouts",
  "Zero inventory risk",
  "Scale beyond Accra",
  "Your brand, their hustle",
]

export function MarqueeBand() {
  return (
    <section className="overflow-hidden border-y border-[#03563E]/10 bg-white/50 py-6 backdrop-blur-sm">
      <Marquee speed={40} className="select-none">
        <div className="flex items-center gap-12 px-6">
          {PHRASES.map((phrase) => (
            <span
              key={phrase}
              className="flex items-center gap-12 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-neutral-800 md:text-4xl"
            >
              {phrase}
              <span className="inline-block h-2 w-2 rounded-full bg-[#C4A962]" aria-hidden />
            </span>
          ))}
        </div>
      </Marquee>
    </section>
  )
}
