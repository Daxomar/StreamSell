"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic } from "@/components/vendor-landers/shared/motion-primitives"
import { ClipReveal, ClipRevealText } from "./clip-reveal"

export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="relative md:col-span-5 md:col-start-2">
            <ClipRevealText>
              <p
                data-reveal-line
                className="mb-2 text-[10px] uppercase tracking-[0.4em] text-[#03563E]"
                style={{ clipPath: "inset(0% 100% 0% 0%)" }}
              >
                The thesis
              </p>
              <h2
                data-reveal-line
                className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.75rem)] font-black leading-[1.05]"
                style={{ clipPath: "inset(0% 100% 0% 0%)" }}
              >
                Your catalog deserves a distribution network, not a sales department.
              </h2>
            </ClipRevealText>

            <p className="mt-8 max-w-md text-lg leading-relaxed text-neutral-600">
              West African vendors are sitting on incredible products. Vendly turns your reseller
              network into infrastructure — governed, measurable, and built to compound.
            </p>

            <div className="mt-10">
              <Magnetic strength={0.2}>
                <Link href="/vendor-auth/register">
                  <Button
                    variant="outline"
                    className="h-12 rounded-none border-[#1A1A18] bg-transparent px-8 text-xs uppercase tracking-[0.25em] hover:bg-[#1A1A18] hover:text-white"
                  >
                    Start your empire <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="relative md:col-span-5 md:col-start-8">
            <ClipReveal direction="center" duration={1.4}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, #C8DCC8 0%, #E8EDE6 35%, #FAF8F5 70%, #03563E22 100%)",
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <p className="font-[family-name:var(--font-display)] text-6xl font-black text-[#03563E]/20 md:text-8xl">
                    03
                  </p>
                  <p className="mt-2 max-w-xs font-[family-name:var(--font-display)] text-xl font-bold italic leading-snug text-[#1A1A18] md:text-2xl">
                    &ldquo;Distribution is the new moat.&rdquo;
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
                    — Vendly Editorial
                  </p>
                </div>
              </div>
            </ClipReveal>

            {/* Overlapping label */}
            <div className="absolute -top-6 right-0 border border-neutral-200 bg-white px-5 py-3 shadow-sm md:-right-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Est. 2024</p>
              <p className="font-[family-name:var(--font-display)] text-sm font-bold">Accra, Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
