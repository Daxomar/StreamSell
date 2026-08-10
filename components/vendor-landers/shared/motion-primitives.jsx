"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export function Magnetic({ children, className = "", strength = 0.35 }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPosition({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

export function TextReveal({ text, className = "", delay = 0 }) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "0px 0px -80px 0px" })
  const words = text.split(" ")

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.25em] inline-block overflow-hidden align-bottom"
          style={{ height: "1.15em", verticalAlign: "bottom" }}
        >
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.05,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function Marquee({ children, speed = 30, className = "" }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}
