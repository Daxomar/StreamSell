"use client"

import { BarChart3, TrendingUp, Users, Wallet } from "lucide-react"

const panels = [
  { icon: TrendingUp, label: "Revenue", value: "₵842,500", delta: "+18.4%", x: "left" },
  { icon: Users, label: "Active resellers", value: "312", delta: "+24 this week", x: "right" },
  { icon: BarChart3, label: "Orders today", value: "1,847", delta: "Real-time", x: "left" },
  { icon: Wallet, label: "Payout queue", value: "₵45,200", delta: "Paystack ready", x: "right" },
]

export default function MetricsSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#03563E]/20 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p data-metrics-label className="mb-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-[#03563E]">
              Metrics
            </p>
            <h2
              data-metrics-title
              className="font-[family-name:var(--font-mono)] text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#1A2420]"
            >
              VENDORS WHO SCALE
              <br />
              <span className="text-[#03563E]">DON&apos;T GUESS.</span>
            </h2>
            <p data-metrics-desc className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
              Real-time sales analytics, reseller performance governance, and Paystack payout visibility — a holographic
              dashboard preview for serious Ghana vendors.
            </p>

            <ul data-metrics-list className="mt-10 space-y-4">
              {[
                "Real-time sales & order analytics",
                "Full control over reseller approval & performance",
                "Fast, secure vendor payouts via Paystack",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#03563E]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-metrics-dashboard className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -left-8 top-12 hidden h-32 w-32 rounded-full bg-[#03563E]/10 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative rotate-1 rounded-3xl border border-white/70 bg-white/45 p-1 shadow-[0_32px_80px_-32px_rgba(3,86,62,0.25)] backdrop-blur-2xl">
              <div className="rounded-[1.35rem] border border-[#03563E]/10 bg-gradient-to-br from-white/80 to-[#F7F9F8]/90 p-5 md:p-6">
                <div className="mb-6 flex items-center justify-between border-b border-[#03563E]/10 pb-4">
                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-[#03563E]/70">
                      Command Grid
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-mono)] text-sm font-bold text-[#1A2420]">
                      Vendor Dashboard
                    </p>
                  </div>
                  <span className="rounded-full border border-[#03563E]/20 bg-[#03563E]/5 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[#03563E]">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {panels.map(({ icon: Icon, label, value, delta }) => (
                    <div
                      key={label}
                      data-metric-panel
                      className="rounded-xl border border-white/60 bg-white/60 p-4 backdrop-blur-md transition-transform hover:-translate-y-0.5"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Icon className="h-4 w-4 text-[#03563E]" strokeWidth={1.5} />
                        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-[#03563E]/60">
                          {delta}
                        </span>
                      </div>
                      <p className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums text-[#1A2420] md:text-xl">
                        {value}
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div data-metric-chart className="mt-4 rounded-xl border border-[#03563E]/10 bg-[#03563E]/[0.03] p-4">
                  <div className="mb-3 flex items-end justify-between">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-neutral-500">
                      Weekly revenue
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[#03563E]">₵2.4M</span>
                  </div>
                  <div className="flex h-16 items-end gap-1.5">
                    {[40, 55, 45, 70, 60, 85, 75, 95, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-[#03563E] to-[#03563E]/30"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
