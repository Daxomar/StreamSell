"use client"

import { ClipReveal } from "./clip-reveal"

const testimonials = [
  {
    quote: "I went from 3 resellers to 200 in six months. Vendly made governance feel editorial — precise, not chaotic.",
    name: "Kofi M.",
    role: "Skincare Brand, Accra",
  },
  {
    quote: "Vendly handles fulfillment tracking so I focus on product. My resellers sell on WhatsApp while I design.",
    name: "Ama S.",
    role: "Fashion Vendor, Kumasi",
  },
  {
    quote: "Every cedi is accounted for. The payout clarity alone justified the switch.",
    name: "Efua A.",
    role: "Home Goods, Tema",
  },
]

export function TestimonialSection() {
  return (
    <section className="relative w-full bg-[#03563E]/10 py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 grid md:grid-cols-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#03563E] md:col-span-3">
            Voices
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#1A1A18] md:col-span-9">
            Vendors who chose scale
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map(({ quote, name, role }, i) => (
            <ClipReveal key={name} direction="up" delay={i * 0.15}>
              <blockquote className="relative border-l-2 border-[#03563E]/40 pl-8">
                <span
                  className="absolute -left-1 -top-4 font-[family-name:var(--font-display)] text-5xl leading-none text-[#03563E]/20"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="font-[family-name:var(--font-display)] text-xl italic leading-relaxed text-[#1A1A18] md:text-2xl">
                  {quote}
                </p>
                <footer className="mt-8">
                  <p className="font-semibold text-[#1A1A18]">{name}</p>
                  <p className="mt-1 text-sm text-neutral-600">{role}</p>
                </footer>
              </blockquote>
            </ClipReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
