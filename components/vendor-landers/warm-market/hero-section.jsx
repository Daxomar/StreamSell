"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowRight, Store, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextReveal, Magnetic } from "@/components/vendor-landers/shared/motion-primitives"
import { THEME } from "./constants"

const FloatingOrbs = dynamic(() => import("./floating-orbs"), { ssr: false })

const FLOATING_ICONS = [
  { Icon: Store, color: THEME.forest, delay: 0 },
  { Icon: Users, color: THEME.amber, delay: 0.35 },
  { Icon: Wallet, color: THEME.forest, delay: 0.7 },
]

const bounceTransition = (delay = 0) => ({
  y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay },
})

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
      <FloatingOrbs />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8A838]/30 bg-white/70 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
            style={{ color: THEME.forest }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#E8A838]" />
            Sunlit Bazaar — built for Ghanaian vendors
          </motion.div>

          <div className="mb-8 flex justify-center gap-5">
            {FLOATING_ICONS.map(({ Icon, color, delay }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -14, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: i * 0.15 },
                  y: bounceTransition(delay).y,
                }}
                whileHover={{ scale: 1.08, rotate: 5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-lg shadow-[#E8A838]/10 backdrop-blur-sm"
              >
                <Icon className="h-7 w-7" style={{ color }} />
              </motion.div>
            ))}
          </div>

          <h1 className="mb-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl xl:text-7xl">
            <TextReveal text="Sell more by letting" className="block" />
            <TextReveal
              text="others sell for you"
              className="block"
              delay={0.3}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mx-auto mb-10 max-w-xl text-lg md:text-xl"
            style={{ color: THEME.textMuted }}
          >
            Vendly helps Ghanaian product owners grow through trusted resellers.
            No upfront cost, no sales team needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Magnetic strength={0.25}>
              <Link href="/vendor-auth/register">
                <Button
                  size="lg"
                  className="h-14 rounded-full px-10 text-base font-semibold text-white shadow-xl transition-shadow hover:shadow-2xl"
                  style={{
                    backgroundColor: THEME.forest,
                    boxShadow: `0 12px 40px ${THEME.forest}35`,
                  }}
                >
                  Start free — no upfront cost
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Magnetic>
            <Link
              href="/vendor-auth/login"
              className="text-sm font-semibold transition-colors hover:underline"
              style={{ color: THEME.forest }}
            >
              Already a vendor? Sign in
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
