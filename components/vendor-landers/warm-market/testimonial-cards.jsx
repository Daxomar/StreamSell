"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { STORIES, THEME } from "./constants"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const card = {
  hidden: { opacity: 0, y: 50, rotate: 2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
}

export default function TestimonialCards() {
  return (
    <section className="relative z-10 py-20 md:py-28">
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
            Vendor stories
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl lg:text-5xl">
            Vendors growing with Vendly
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8%" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {STORIES.map(({ quote, name, city, role, rating }) => (
            <motion.div
              key={name}
              variants={card}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(3, 86, 62, 0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-8 shadow-md backdrop-blur-sm md:p-10"
            >
              <Quote
                className="absolute right-6 top-6 h-10 w-10 opacity-[0.08]"
                style={{ color: THEME.forest }}
              />

              <div className="mb-5 flex gap-1">
                {[...Array(rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400 }}
                  >
                    <Star className="h-5 w-5 fill-[#E8A838] text-[#E8A838]" />
                  </motion.div>
                ))}
              </div>

              <p className="mb-8 font-[family-name:var(--font-display)] text-lg leading-relaxed md:text-xl">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                  style={{ backgroundColor: THEME.forest }}
                >
                  {name[0]}
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm" style={{ color: THEME.textMuted }}>
                    {role} · {city}, Ghana
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
