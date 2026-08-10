"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Magnetic, TextReveal } from "@/components/vendor-landers/shared/motion-primitives"
import { ClipReveal } from "./clip-reveal"

export function CtaSection() {
  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 md:px-6">
        <ClipReveal direction="center" duration={1.3}>
          <div className="relative mx-auto max-w-4xl border border-neutral-300/80 bg-white/50 p-12 backdrop-blur-sm md:p-20">
            <div className="absolute -right-4 -top-4 hidden h-24 w-24 border border-[#03563E]/20 md:block" aria-hidden />
            <div className="absolute -bottom-4 -left-4 hidden h-16 w-16 bg-[#03563E]/10 md:block" aria-hidden />

            <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-[#03563E]">Final spread</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight">
              <TextReveal text="Your catalog deserves a platform." />
            </h2>
            <p className="mt-6 max-w-lg text-lg text-neutral-600">
              Start free. Launch your vendor storefront today and recruit your first resellers this week.
            </p>
            <div className="mt-10">
              <Magnetic strength={0.3}>
                <Link href="/vendor-auth/register">
                  <Button
                    size="lg"
                    className="h-14 rounded-none bg-[#1A1A18] px-12 text-xs uppercase tracking-[0.3em] hover:bg-neutral-800"
                  >
                    Begin application
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </ClipReveal>
      </div>
    </section>
  )
}
