"use client"

import { motion } from "framer-motion"
import { Store, Users, Truck, Wallet } from "lucide-react"
import { BENEFITS, THEME } from "./constants"

const ICON_MAP = { store: Store, users: Users, truck: Truck, wallet: Wallet }

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
}

export default function BenefitsGrid() {
  return (
    <section className="relative z-10 bg-white/60 py-20 backdrop-blur-sm md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p
            className="mb-3 text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: THEME.amber }}
          >
            Platform
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl lg:text-5xl">
            Built for vendors like you
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8%" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {BENEFITS.map(({ icon, title, desc }) => {
            const Icon = ICON_MAP[icon]
            return (
              <motion.div
                key={title}
                variants={item}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 50px rgba(232, 168, 56, 0.15)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group flex gap-5 rounded-3xl border border-[#F5E6D3] bg-white p-7 shadow-sm"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${THEME.forest}12` }}
                >
                  <Icon className="h-7 w-7" style={{ color: THEME.forest }} />
                </div>
                <div>
                  <h3 className="mb-2 font-[family-name:var(--font-display)] text-lg font-bold md:text-xl">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed md:text-base" style={{ color: THEME.textMuted }}>
                    {desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
