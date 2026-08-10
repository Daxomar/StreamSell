"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/vendor-landers/shared/motion-primitives"

export default function CtaSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div
          data-cta-block
          className="relative overflow-hidden rounded-[2rem] border border-[#03563E]/15 bg-gradient-to-br from-[#03563E] via-[#024a34] to-[#03563E] px-8 py-16 text-center shadow-[0_40px_100px_-40px_rgba(3,86,62,0.5)] md:px-16 md:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative">
            <p data-cta-label className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.45em] text-white/60">
              Ghana vendor network
            </p>
            <h2
              data-cta-title
              className="mx-auto max-w-3xl font-[family-name:var(--font-mono)] text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
            >
              OPEN YOUR VENDOR ACCOUNT
            </h2>
            <p data-cta-desc className="mx-auto mt-5 max-w-lg text-base text-white/75 md:text-lg">
              Free to start. Recruit resellers, manage bundles, and collect Paystack payouts — your storefront live in
              minutes.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic strength={0.3}>
                <Link href="/vendor-auth/register">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-white px-10 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[#03563E] shadow-xl hover:bg-[#F7F9F8]"
                  >
                    Create vendor account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/vendor-auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-white/30 bg-transparent px-10 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-white hover:bg-white/10"
                  >
                    Sign in
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#03563E]/10 pt-8 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <img src="/v.svg" alt="Vendly" className="h-6 w-6 opacity-80" />
            <span className="font-[family-name:var(--font-mono)] text-xs text-neutral-500">Vendly Command Grid</span>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            Built for Ghana vendors // Paystack payouts
          </p>
        </footer>
      </div>
    </section>
  )
}
