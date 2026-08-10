"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Magnetic, TextReveal } from "@/components/vendor-landers/shared/motion-primitives"
import { THEME } from "./constants"

const TRUST_BADGES = [
  "Paystack payments",
  "Free to start",
  "Ghana-based support",
]

export default function CtaSection() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center text-white md:px-16 md:py-20"
          style={{
            background: `linear-gradient(135deg, ${THEME.forest} 0%, #024a34 50%, ${THEME.forest} 100%)`,
          }}
        >
          {/* Decorative warm orbs */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-2xl"
            style={{ background: THEME.amber }}
          />
          <div
            className="pointer-events-none absolute -bottom-12 -right-12 h-56 w-56 rounded-full opacity-15 blur-3xl"
            style={{ background: THEME.amber }}
          />

          <h2 className="relative mb-4 font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl lg:text-5xl">
            <TextReveal text="Ready to grow your business?" className="text-white" />
          </h2>
          <p className="relative mb-10 text-lg text-white/75">
            Join vendors across Ghana building their reseller networks.
          </p>

          <Magnetic strength={0.3} className="relative inline-block">
            <Link href="/vendor-auth/register">
              <Button
                size="lg"
                className="h-14 rounded-full px-10 text-base font-semibold shadow-xl transition-shadow hover:shadow-2xl"
                style={{
                  backgroundColor: THEME.cream,
                  color: THEME.forest,
                }}
              >
                Create your vendor account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Magnetic>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            {TRUST_BADGES.map((badge) => (
              <motion.span
                key={badge}
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="h-4 w-4" style={{ color: THEME.amber }} />
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
