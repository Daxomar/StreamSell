"use client"

import { Package, Users, Truck, Wallet } from "lucide-react"

const steps = [
  {
    icon: Package,
    label: "BUNDLE",
    code: "01",
    desc: "Create product bundles with custom pricing tiers for MTN, Telecel, and retail catalog.",
  },
  {
    icon: Users,
    label: "RESELL",
    code: "02",
    desc: "Recruit resellers, approve applications, and share your vendor link across Ghana.",
  },
  {
    icon: Truck,
    label: "FULFILL",
    code: "03",
    desc: "Monitor delivery and order status in real time — from Accra hubs to last-mile.",
  },
  {
    icon: Wallet,
    label: "PAYOUT",
    code: "04",
    desc: "Request vendor payouts to your bank via Paystack. Every cedi accounted for.",
  },
]

export default function PipelineSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p data-pipeline-label className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[#03563E]">
              Pipeline
            </p>
            <h2
              data-pipeline-title
              className="font-[family-name:var(--font-mono)] text-[clamp(1.75rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#1A2420]"
            >
              BUNDLE → RESELL → FULFILL → PAYOUT
            </h2>
          </div>
          <p data-pipeline-desc className="text-base leading-relaxed text-neutral-600 md:col-span-6 md:col-start-7 md:text-lg">
            Manage bundles, govern your reseller network, and route Paystack payouts from one luminous command surface
            built for Ghana&apos;s vendor economy.
          </p>
        </div>

        <div className="relative">
          <div
            data-pipeline-line
            className="absolute left-0 right-0 top-1/2 hidden h-px origin-left bg-gradient-to-r from-[#03563E]/40 via-[#03563E]/20 to-transparent md:block"
          />
          <div className="grid gap-4 md:grid-cols-4 md:gap-5">
            {steps.map(({ icon: Icon, label, code, desc }, i) => (
              <article
                key={label}
                data-pipeline-card
                className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-[0_16px_48px_-24px_rgba(3,86,62,0.2)] backdrop-blur-xl transition-shadow hover:shadow-[0_24px_60px_-20px_rgba(3,86,62,0.25)] md:p-8 ${
                  i % 2 === 1 ? "md:translate-y-8" : ""
                }`}
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#03563E]/5 blur-2xl transition-all group-hover:bg-[#03563E]/10" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#03563E]/50">{code}</span>
                <Icon className="mb-4 mt-3 h-6 w-6 text-[#03563E]" strokeWidth={1.5} />
                <h3 className="mb-2 font-[family-name:var(--font-mono)] text-lg font-bold tracking-wide text-[#1A2420]">
                  {label}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
