"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic, TextReveal, Marquee } from "@/components/vendor-landers/shared/motion-primitives"
import AnimatedGrid from "./animated-grid"

export default function HeroSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <AnimatedGrid />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-start justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[#03563E]/60">
            GH // ACCRA // KUMASI
          </span>
          <span className="hidden font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:block">
            LUMINOUS_TERMINAL v1
          </span>
        </div>

        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div data-hero-line className="mb-6 h-px w-24 origin-left bg-[#03563E]" />
            <h1
              data-hero-title
              className="font-[family-name:var(--font-mono)] text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-[#1A2420]"
            >
              <span className="block overflow-hidden">
                <TextReveal text="RUN YOUR" className="text-[#1A2420]" />
              </span>
              <span className="mt-1 block overflow-hidden text-[#03563E]">
                <TextReveal text="CATALOG." delay={0.15} />
              </span>
              <span className="mt-2 block overflow-hidden text-neutral-800">
                <TextReveal text="DEPLOY YOUR ARMY." delay={0.3} />
              </span>
            </h1>
          </div>

          <div data-hero-panel className="relative lg:col-span-4 lg:-mt-8">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl border border-[#03563E]/10 bg-[#03563E]/5" />
            <div className="relative rounded-2xl border border-white/60 bg-white/50 p-6 shadow-[0_20px_60px_-20px_rgba(3,86,62,0.15)] backdrop-blur-xl md:p-8">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-[#03563E]">
                Vendor signal
              </p>
              <p data-hero-copy className="mt-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                Launch bundles. Recruit resellers across Ghana. Track every cedi through Paystack payouts — you own the
                pipeline, not the middlemen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Magnetic strength={0.25}>
                  <Link href="/vendor-auth/register">
                    <Button
                      size="lg"
                      className="h-14 w-full rounded-full bg-[#03563E] px-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-white shadow-[0_12px_40px_-8px_rgba(3,86,62,0.45)] hover:bg-[#024a34] sm:w-auto"
                    >
                      Start as vendor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link href="/vendor-auth/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-full border-[#03563E]/20 bg-white/70 px-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#03563E] backdrop-blur-sm hover:bg-[#03563E]/5 sm:w-auto"
                    >
                      Sign in
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>

        <div data-hero-stats className="mt-20 grid grid-cols-2 gap-6 border-t border-[#03563E]/10 pt-10 md:grid-cols-4 md:gap-8">
          {[
            { value: "₵2.4M+", label: "Vendor revenue processed" },
            { value: "847", label: "Avg resellers per vendor" },
            { value: "24hr", label: "Avg fulfillment time" },
            { value: "Paystack", label: "Payout rails for Ghana" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <p className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#03563E] transition-transform group-hover:translate-x-1 md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-neutral-500 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-16 border-y border-[#03563E]/10 bg-white/40 py-5 backdrop-blur-sm">
        <Marquee speed={28} className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.45em] text-[#03563E]/50 md:text-base">
          <span className="mx-8">VENDLY // VENDOR // SCALE // PIPELINE //</span>
        </Marquee>
      </div>
    </section>
  )
}
