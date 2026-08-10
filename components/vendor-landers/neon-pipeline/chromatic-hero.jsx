"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic, Marquee } from "@/components/vendor-landers/shared/motion-primitives"

const MARQUEE_ITEMS = [
  "UPLOAD",
  "BUNDLE",
  "RESELL",
  "ORDERS",
  "PAYOUT",
  "VENDLY",
  "GHANA",
  "SCALE",
]

export function ChromaticHero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-24 pb-12 np-grain">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.35em] text-neutral-400">
          <span style={{ color: "#03563E" }}>SYS.STATUS: ONLINE</span>
          <span style={{ color: "#FF006E" }}>VENDLY_OS v3.0</span>
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-6 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.5em] text-[#00D4AA]">
            Chromatic Glass · Vendor Pipeline
          </p>

          <h1 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
            <span className="np-chromatic-layers block">
              <span className="np-layer-magenta" aria-hidden>Deploy.</span>
              <span className="np-layer-teal" aria-hidden>Deploy.</span>
              <span className="np-layer-base np-chromatic-text">Deploy.</span>
            </span>
            <span className="np-chromatic-layers block">
              <span className="np-layer-magenta" aria-hidden>Distribute.</span>
              <span className="np-layer-teal" aria-hidden>Distribute.</span>
              <span className="np-layer-base np-chromatic-text">Distribute.</span>
            </span>
            <span
              className="block bg-gradient-to-r from-[#03563E] via-[#00D4AA] to-[#FF006E] bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text" }}
            >
              Dominate.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base text-neutral-600 md:text-lg">
            The vendor OS for reseller-powered commerce. Upload once, bundle smart, scale through Ghana&apos;s fastest reseller network.
          </p>

          <Magnetic strength={0.25} className="inline-block">
            <Link href="/vendor-auth/register">
              <Button
                size="lg"
                className="np-cta-glow h-14 rounded-full border-0 bg-[#03563E] px-10 font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.2em] text-white transition-all hover:bg-[#024a34]"
              >
                Launch vendor account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Magnetic>
        </div>

        <div className="mt-16 overflow-hidden border-y border-black/[0.06] py-5">
          <Marquee speed={28} className="flex">
            <div className="flex shrink-0 items-center gap-12 px-6">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.4em] text-neutral-300"
                >
                  {item}
                  <span className="ml-12 text-[#00D4AA]">◆</span>
                </span>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  )
}
