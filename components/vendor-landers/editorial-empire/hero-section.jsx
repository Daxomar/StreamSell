"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextReveal, Magnetic } from "@/components/vendor-landers/shared/motion-primitives"
import { ClipReveal } from "./clip-reveal"

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24 md:pt-28">
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-4">
          {/* Drop-cap V — brutalist anchor */}
          <div className="relative md:col-span-5 md:row-span-2">
            <span
              className="absolute -left-2 -top-4 select-none font-[family-name:var(--font-display)] text-[clamp(8rem,22vw,16rem)] font-black leading-[0.78] text-[#03563E]/[0.12] md:-left-6 md:-top-8"
              aria-hidden
            >
              V
            </span>
            <p className="relative mb-4 text-[10px] uppercase tracking-[0.45em] text-[#03563E]">
              Issue №01 — Vendor Platform
            </p>
            <h1 className="relative font-[family-name:var(--font-display)] text-[clamp(2.25rem,5vw,4.5rem)] font-black leading-[0.95] tracking-tight">
              <TextReveal text="Build a Reseller" className="block" />
              <span className="relative mt-1 block">
                <TextReveal text="Empire" delay={0.3} className="italic text-[#03563E]" />
                <span className="absolute -right-2 top-0 hidden font-[family-name:var(--font-body)] text-xs font-medium uppercase tracking-widest text-neutral-400 md:block md:-right-16 md:top-4 md:rotate-90">
                  Without a sales team
                </span>
              </span>
            </h1>
          </div>

          {/* Asymmetric image block */}
          <div className="relative md:col-span-7 md:col-start-6">
            <ClipReveal direction="left" className="relative">
              <div className="relative aspect-[5/4] overflow-hidden bg-[#E8EDE6]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(145deg, rgba(3,86,62,0.15) 0%, rgba(200,220,205,0.6) 40%, rgba(250,248,245,0.9) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 25%, rgba(3,86,62,0.08) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>
            </ClipReveal>

            {/* Overlapping stat card */}
            <div className="absolute -bottom-8 -left-4 z-10 border border-[#03563E]/20 bg-[#FAF8F5]/95 p-6 shadow-lg backdrop-blur-sm md:-left-12 md:bottom-6">
              <p className="font-[family-name:var(--font-display)] text-4xl font-black text-[#03563E] md:text-5xl">
                200+
              </p>
              <p className="mt-1 max-w-[10rem] text-[10px] uppercase leading-relaxed tracking-[0.25em] text-neutral-500">
                Resellers per top vendor
              </p>
            </div>
          </div>

          {/* Body copy + CTA — offset column */}
          <div className="md:col-span-4 md:col-start-2 md:pb-16">
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              For product owners ready to scale beyond their own reach. Vendly gives you the
              infrastructure to govern resellers, control margins, and grow without hiring.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Magnetic strength={0.25}>
                <Link href="/vendor-auth/register">
                  <Button
                    size="lg"
                    className="h-14 rounded-none bg-[#03563E] px-10 font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.3em] hover:bg-[#024a34]"
                  >
                    Apply as vendor <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Magnetic>
              <Link
                href="/vendor-auth/login"
                className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-[#03563E]"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
