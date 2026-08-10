"use client"

import { motion } from "framer-motion"

export default function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden>
      <motion.div
        className="absolute inset-[-50%]"
        animate={{ x: [0, 48, 0], y: [0, 48, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(3, 86, 62, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(3, 86, 62, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  )
}
