"use client"
import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartConfig: ChartConfig = {
  views: { label: "Sales" },
  thisMonthRevenue: { label: "This month", color: "#262626" },
  lastMonthRevenue: { label: "Last month", color: "#9CA3AF" },
}

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("thisMonthRevenue")
  const [isMobile, setIsMobile] = useState(false)
  const [chartHeight, setChartHeight] = useState(400)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setChartHeight(mobile ? 300 : 400)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // --- Fetch this chart's own data (Option B: self-contained) ---
  const { data, isLoading } = useQuery({
    queryKey: ["salesChart"],
    queryFn: () => api("/api/v1/transactions/sales-chart"),
    staleTime: 5 * 60 * 1000,
  })

  const chartData = data?.data?.chartData ?? []
  const totals = data?.data?.totals ?? {
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
  }

  const total = totals

  // --- ADD THIS: which month does the active toggle represent? ---
  const now = new Date()
  const activeMonthDate =
    activeChart === "thisMonthRevenue"
      ? now
      : new Date(now.getFullYear(), now.getMonth() - 1)



  if (isLoading) {
    return <div className="p-6 text-slate-500">Loading chart…</div>
  }

  return (
    <Card className="py-0 flex flex-col h-full border-0 bg-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      {/* Header with soft styling */}
      <CardHeader className="flex flex-col items-stretch border-b border-slate-200/50 p-0! sm:flex-row bg-gradient-to-b from-white/80 to-transparent">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle className="text-slate-900">Sales Analytics</CardTitle>
          <CardDescription className="text-slate-600">
            Showing sales data for the last 2 months (Month-over-Month) comparison. Hover over the bars to see daily revenue, profit, and order count.
          </CardDescription>
        </div>

        {/* Toggle buttons with softer styling */}
        <div className="flex">
          {["thisMonthRevenue", "lastMonthRevenue"].map((key) => {
            const chart = key as keyof typeof chartConfig
            const isThisMonth = key === "thisMonthRevenue"

            const revenue = isThisMonth ? totals.thisMonthRevenue : totals.lastMonthRevenue
            const profit = isThisMonth ? totals.thisMonthProfit : totals.lastMonthProfit
            const orders = isThisMonth ? totals.thisMonthOrders : totals.lastMonthOrders

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-slate-200/50 px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l data-[active=true]:bg-[#262626] data-[active=true]:text-white hover:bg-slate-50/50 transition-colors sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs data-[active=true]:text-white  font-medium">
                  {chartConfig[chart].label}
                </span>

                {/* Main — revenue */}
                <span className="text-lg leading-none font-bold  sm:text-2xl">
                  ₵{revenue.toLocaleString()}
                </span>

                {/* Sub-metrics — profit + orders */}
                <div className="flex gap-3 mt-1 text-[11px] ">
                  <span>Profit: <span className="text-green-600 font-medium">₵{profit.toLocaleString()}</span></span>
                  <span>Orders: <span className="font-medium ">{orders}</span></span>
                </div>
              </button>
            )
          })}
        </div>
      </CardHeader>

      {/* Chart content */}
      <CardContent className="flex-1 p-6 w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 10,
                bottom: isMobile ? 40 : 20,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e2e8f0"
                strokeDasharray="0"
                opacity={0.5}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={isMobile ? 20 : 8}
                minTickGap={isMobile ? 50 : 32}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 80 : 40}
                tick={{ fontSize: isMobile ? 11 : 12, fill: "#64748b" }}
                tickFormatter={(day) => {
                  const d = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), day)
                  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(5, 86, 62, 0.05)" }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null

                  const row = payload[0].payload   // the full data row for this day
                  const isThisMonth = activeChart === "thisMonthRevenue"

                  // pick the right month's fields based on the active toggle
                  const revenue = isThisMonth ? row.thisMonthRevenue : row.lastMonthRevenue
                  const profit = isThisMonth ? row.thisMonthProfit : row.lastMonthProfit
                  const orders = isThisMonth ? row.thisMonthOrders : row.lastMonthOrders

                  const d = new Date(activeMonthDate.getFullYear(), activeMonthDate.getMonth(), Number(row.day))
                  const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

                  return (
                    <div className="rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm p-3 shadow-md w-[180px]">
                      <p className="text-sm font-semibold text-slate-900 mb-2">{dateLabel}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Revenue</span>
                          <span className="font-medium text-slate-900">₵{revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Profit</span>
                          <span className="font-medium text-[#05563E]">₵{profit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Orders</span>
                          <span className="font-medium text-slate-900">{orders}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey={activeChart}
                fill={chartConfig[activeChart]?.color}
                radius={[8, 8, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}