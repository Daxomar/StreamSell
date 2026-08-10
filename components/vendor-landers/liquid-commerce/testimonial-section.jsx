"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Star } from "lucide-react"
import { SectionReveal } from "./section-reveal"

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Vendly transformed how I scale my product line. One link, hundreds of resellers, zero hassle. My monthly revenue tripled in 6 months.",
    author: "Adwoa Mensah",
    role: "Shea Butter Producer, Accra",
    location: "Accra, Ghana",
    rating: 5,
  },
  {
    id: 2,
    quote: "The dashboard is intuitive. I approve resellers, track orders in real-time, and withdraw payouts directly to my Paystack account. Game-changer.",
    author: "Kwesi Boateng",
    role: "Kente Fabric Exporter",
    location: "Kumasi, Ghana",
    rating: 5,
  },
  {
    id: 3,
    quote: "I never thought selling across Ghana could be this simple. Vendly handles fulfillment, I focus on creating. The resellers do the selling.",
    author: "Ama Osei",
    role: "Artisan Jewelry Designer",
    location: "Cape Coast, Ghana",
    rating: 5,
  },
  {
    id: 4,
    quote: "From Tema to Takoradi, my products reach customers I'd never reach alone. Vendly's reseller network is the expansion tool I always needed.",
    author: "Yaw Oppong",
    role: "Electronics Distributor",
    location: "Tema, Ghana",
    rating: 5,
  },
]

export function TestimonialSection() {
  const sectionRef = useRef(null)
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    if (!section || !container) return

    const ctx = gsap.context(() => {
      // Scroll-triggered card stagger animation
      gsap.fromTo(
        cardsRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      )

      // Subtle horizontal pan on hover
      cardsRef.current.forEach((card) => {
        if (!card) return
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            duration: 0.4,
            ease: "power2.out",
          })
        })
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          })
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-36">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#03563E]/5 to-transparent" />

      <div className="container relative mx-auto px-4 md:px-6">
        <SectionReveal className="mb-16 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C4A962]">Trusted by vendors</p>
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
            Hear from vendors building empires across Ghana
          </h2>
          <p className="text-lg text-neutral-600">
            Real resellers, real earnings. See how vendors in Accra, Kumasi, Tema, and beyond are scaling with Vendly.
          </p>
        </SectionReveal>

        {/* Testimonial grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className="group relative overflow-hidden rounded-2xl border border-[#03563E]/10 bg-white/60 p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#03563E]/30 hover:bg-white/80"
            >
              {/* Accent line on hover */}
              <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-[#03563E] to-[#C4A962] transition-all duration-500 group-hover:w-full" />

              {/* Star rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-[#C4A962] text-[#C4A962]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-8 text-lg leading-relaxed text-neutral-700 font-medium">
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4 border-t border-neutral-200 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#03563E]/20 to-[#C4A962]/20">
                  <span className="text-sm font-bold text-[#03563E]">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                  <p className="text-xs text-neutral-500">{testimonial.role}</p>
                  <p className="text-xs text-[#03563E] font-medium">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
