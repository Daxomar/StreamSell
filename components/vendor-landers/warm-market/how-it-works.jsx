"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
import { STEPS, THEME } from "./constants"

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    if (!section || !path) return

    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          end: "bottom 40%",
          scrub: 1,
        },
      })

      gsap.from(".wm-step-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      })

      gsap.from(".wm-step-num", {
        scale: 0,
        rotation: -20,
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 68%",
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="wm-how-section relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: THEME.amber }}
          >
            How it works
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl lg:text-5xl">
            Simple as 1, 2, 3
          </h2>
          <p className="mt-4 text-lg" style={{ color: THEME.textMuted }}>
            Get started in one afternoon
          </p>
        </motion.div>

        <div className="relative">
          {/* SVG dotted connecting line — desktop */}
          <svg
            ref={lineRef}
            className="pointer-events-none absolute left-0 right-0 top-[4.5rem] hidden h-24 w-full md:block"
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={pathRef}
              d="M 120 40 Q 500 10 880 40"
              fill="none"
              stroke={THEME.amber}
              strokeWidth="3"
              strokeDasharray="8 12"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                className="wm-step-card group relative rounded-3xl border border-white/80 bg-white/85 p-8 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-[#E8A838]/10"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className="wm-step-num mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                  style={{
                    backgroundColor: THEME.forest,
                    boxShadow: `0 8px 24px ${THEME.forest}30`,
                  }}
                >
                  {num}
                </div>
                <h3 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold md:text-2xl">
                  {title}
                </h3>
                <p className="leading-relaxed" style={{ color: THEME.textMuted }}>
                  {desc}
                </p>
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute -bottom-4 left-1/2 hidden h-8 w-px -translate-x-1/2 border-l-2 border-dashed md:hidden"
                    style={{ borderColor: `${THEME.amber}66` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
