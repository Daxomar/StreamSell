"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export function SplitHeadline({ lines, className = "" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  let segmentDelay = 0

  return (
    <h1 ref={ref} className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((segment, si) => {
            const delay = 0.15 + segmentDelay * 0.1
            segmentDelay += 1
            const clipHeight = segment.italic ? "1.3em" : "1.15em"

            return (
              <span
                key={si}
                className="inline-block overflow-hidden align-bottom"
                style={{ height: clipHeight, verticalAlign: "bottom" }}
              >
                <motion.span
                  className={
                    segment.italic
                      ? "block font-[family-name:var(--font-display)] italic text-[#03563E]"
                      : "block font-[family-name:var(--font-display)]"
                  }
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: 0 } : { y: "110%" }}
                  transition={{
                    duration: 0.75,
                    delay,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  {segment.text}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}
