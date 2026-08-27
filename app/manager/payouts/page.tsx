"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List } from "@/components/dashboard/listss"
import { StatCard } from "@/components/dashboard/stat-card"
import { api } from "@/lib/api"

const LIMIT = 25

type PayoutStats = {
    earned: { thisMonth: number; lastMonth: number; today: number; yesterday: number }
    balances: { pending: number; paid: number }
    counts: { pending: number; paid: number }
}

type PayoutRecord = {
    _id: string
    reference: string
    subscriptionName?: string
    amount: number
    status: string
    month?: string
    createdAt: string
    paidAt?: string | null
}

type Pagination = { page: number; limit: number; total: number; pages: number }

function pctChange(current: number, previous: number): number {
    if (!previous) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
}

// Icon components (StatCard expects a component for `icon`)
const WalletIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-wallet ${className || ""}`} />
const CalendarIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-calendar-day ${className || ""}`} />
const CheckIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-check ${className || ""}`} />
const ClockIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-clock ${className || ""}`} />
const HourglassIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-hourglass-half ${className || ""}`} />

export default function ManagerPayoutsPage() {
    const [activeTab, setActiveTab] = useState<"pending" | "paid">("pending")
    const [pages, setPages] = useState<{ pending: number; paid: number }>({ pending: 1, paid: 1 })

    // ── Stats ──
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ["myPayoutStats"],
        queryFn: () => api("/api/v1/fulfiller-payouts/my-stats"),
        refetchInterval: 30000,
    })
    const stats: PayoutStats | undefined = statsData?.data

    // ── History (paginated per tab) ──
    const { data: histData, isLoading, isError, error } = useQuery({
        queryKey: ["myPayoutHistory", activeTab, pages[activeTab]],
        queryFn: () =>
            api(`/api/v1/fulfiller-payouts/my-history?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
        placeholderData: (prev: unknown) => prev,
    })
    const payouts: PayoutRecord[] = histData?.payouts || []
    const pagination: Pagination | undefined = histData?.pagination

    const setPage = (tab: "pending" | "paid", page: number) =>
        setPages((prev) => ({ ...prev, [tab]: page }))

    const monthChange = pctChange(stats?.earned?.thisMonth ?? 0, stats?.earned?.lastMonth ?? 0)
    const dayChange = pctChange(stats?.earned?.today ?? 0, stats?.earned?.yesterday ?? 0)

    const tabs: Array<{ v: "pending" | "paid"; label: string; count?: number }> = [
        { v: "pending", label: "Pending", count: stats?.counts?.pending },
        { v: "paid", label: "Paid", count: stats?.counts?.paid },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold">My Payouts</h2>
                <p className="text-muted-foreground">Your earnings from fulfilled orders — paid and pending.</p>
            </div>

            {/* 4 top cards — earned (paid + pending) by period */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                    className=""
                    title="Earned This Month"
                    value={stats?.earned?.thisMonth}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle={`${monthChange >= 0 ? "+" : ""}${monthChange}% vs last month`}
                    icon={WalletIcon}
                />
                <StatCard
                    className=""
                    title="Earned Last Month"
                    value={stats?.earned?.lastMonth}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle="Previous month total"
                    icon={CalendarIcon}
                />
                <StatCard
                    className=""
                    title="Earned Today"
                    value={stats?.earned?.today}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle={`${dayChange >= 0 ? "+" : ""}${dayChange}% vs yesterday`}
                    icon={CheckIcon}
                />
                <StatCard
                    className=""
                    title="Earned Yesterday"
                    value={stats?.earned?.yesterday}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle="Previous day total"
                    icon={ClockIcon}
                />
            </div>

            {/* Balance strip — pending vs paid (StatCard, no hardcoded borders) */}
            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                    className=""
                    title="Pending Payout"
                    value={stats?.balances?.pending}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle="Awaiting disbursement"
                    icon={HourglassIcon}
                />
                <StatCard
                    className=""
                    title="Total Paid Out"
                    value={stats?.balances?.paid}
                    isCurrency
                    isLoading={statsLoading}
                    subtitle="Disbursed to you"
                    icon={CheckIcon}
                />
            </div>

            {/* Tabs — pending / paid lists */}
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v as "pending" | "paid")} className="w-full">
                <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
                    {tabs.map(({ v, label, count }) => (
                        <TabsTrigger
                            key={v}
                            value={v}
                            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
                        >
                            {label}{count != null ? ` (${count})` : ""}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {(["pending", "paid"] as const).map((tab) => (
                    <TabsContent key={tab} value={tab} className="">
                        <Card className="w-full border-none shadow-none py-2">
                            <List
                                items={(activeTab === tab ? payouts : []) as any}
                                type="fulfillerPayout"
                                isLoading={activeTab === tab && isLoading}
                                isError={activeTab === tab && isError}
                                error={error as any}
                            />

                            {pagination && pagination.pages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500">
                                        Page {pagination.page} of {pagination.pages} · {pagination.total} payouts
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pages[tab] <= 1}
                                            onClick={() => setPage(tab, pages[tab] - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={pages[tab] >= pagination.pages}
                                            onClick={() => setPage(tab, pages[tab] + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}