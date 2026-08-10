"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { api } from "@/lib/api"

const chartConfig = {
    thisMonthRevenue: { label: "This Month", color: "#262626" },
    lastMonthRevenue: { label: "Last Month", color: "#9CA3AF" },
}

export function ResellerSalesChart({ resellerId }) {
    const { data, isLoading } = useQuery({
        queryKey: ["resellerSalesSeries", resellerId],
        queryFn: () => api(`/api/v1/users/${resellerId}/sales-series`),
        enabled: !!resellerId,
        staleTime: 5 * 60 * 1000,
    })

    const chartData = data?.data?.chartData ?? []

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Sales — This vs Last Month</CardTitle>
                <CardDescription>Daily revenue comparison</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Loading chart…</div>
                ) : chartData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No sales data</div>
                ) : (
                    <ChartContainer config={chartConfig}>
                        <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(v) => `Day ${v}`}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Area
                                dataKey="lastMonthRevenue"
                                type="monotone"
                                fill="#9CA3AF"
                                fillOpacity={0.15}
                                stroke="#9CA3AF"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Area
                                dataKey="thisMonthRevenue"
                                type="monotone"
                                fill="#262626"
                                fillOpacity={0.15}
                                stroke="#262626"
                                strokeWidth={2.5}
                                dot={false}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}