"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CLIP_FROM = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(50% 50% 50% 50%)",
}

export function ClipReveal({ children, direction = "up", className = "", delay = 0, duration = 1.2 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: CLIP_FROM[direction] || CLIP_FROM.up },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration,
          delay,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      )
    }, ref)

    return () => ctx.revert()
  }, [direction, delay, duration])

  return (
    <div
      ref={ref}
      className={className}
      style={{ clipPath: CLIP_FROM[direction] || CLIP_FROM.up }}
    >
      {children}
    </div>
  )
}

export function ClipRevealText({ children, className = "", stagger = 0.08 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const lines = el.querySelectorAll("[data-reveal-line]")

    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            delay: i * stagger,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    }, ref)

    return () => ctx.revert()
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
