"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/vendor-landers/shared/motion-primitives"
import { SectionReveal } from "./section-reveal"

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 bg-gradient-to-br from-[#03563E]/8 via-transparent to-[#C4A962]/10" />
      <SectionReveal className="container relative mx-auto px-4 text-center md:px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#03563E]">Join the flow</p>
        <h2 className="mx-auto mb-6 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-neutral-900 md:text-6xl">
          Turn your Ghana product line into a{" "}
          <em className="italic text-[#03563E]">reseller empire</em>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg text-neutral-600">
          From Makola to mobile — list your bundles, approve resellers, and watch orders flow in while you focus on what you make best.
        </p>
        <Magnetic strength={0.4}>
          <Link href="/vendor-auth/register">
            <Button
              size="lg"
              className="group h-16 rounded-full bg-[#03563E] px-12 text-base font-semibold text-white shadow-[0_12px_40px_-8px_rgba(3,86,62,0.45)] transition-shadow hover:bg-[#024a34] hover:shadow-[0_16px_48px_-8px_rgba(3,86,62,0.55)]"
            >
              Become a vendor
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </Magnetic>
      </SectionReveal>
    </section>
  )
}
