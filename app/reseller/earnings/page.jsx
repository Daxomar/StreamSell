"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Calendar, Wallet, ArrowDownRight, Loader2, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { PayoutPopup } from "@/components/reseller/payout-popup"
import { useUser } from "@/app/contexts/UserContext"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

export default function ResellerEarningsPage() {
  const [activeTab, setActiveTab] = useState("commissions")
  const { reseller, isLoadingReseller, isErrorReseller } = useUser()   // fixed: lowercase `reseller`

  // ── Commissions ──
  const fetchRecentCommissions = async () => {
    const data = await api(`/api/v1/commissions/my-commissions?page=1&limit=5`)  // api() + prefix + `?page`
    if (!data.success) throw new Error(data.message || "Failed to fetch commissions")
    return data // { success, commissions: [...], pagination: {...} }
  }

  const {
    data: commissionsData,
    isLoading: isLoadingCommissions,
    isError: isErrorCommissions,
  } = useQuery({
    queryKey: ["recentCommissions", reseller?._id],
    queryFn: fetchRecentCommissions,
    enabled: !!reseller?._id,
  })

  const commissions = commissionsData?.commissions || []

  // ── Payouts ──
  const fetchRecentPayouts = async () => {
    const data = await api(`/api/v1/payout/my-payouts?page=1&limit=5`)   // api() + prefix + `?page`
    if (!data.success) throw new Error(data.message || "Failed to fetch payouts")
    return data.data
  }

  const {
    data: payoutData,
    isLoading: isLoadingPayouts,
    isError: isErrorPayout,
  } = useQuery({
    queryKey: ["recentPayouts", reseller?._id],
    queryFn: fetchRecentPayouts,
    enabled: !!reseller?._id,
  })

  const payouts = payoutData?.payouts || []

  const exportData = (data, filename) => {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(",")
    const csvContent = [headers, ...data.map((row) => Object.values(row).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // derived earnings (field names — verify against your backend)
  const totalEarned = reseller?.totalCommissionEarned || 0
  const totalPaidOut = reseller?.totalCommissionPaidOut || 0
  const availableBalance = totalEarned - totalPaidOut

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border border-[#262626]/30 bg-slate-50 px-5 py-4">
        <CheckCircle size={18} className="mt-0.5 shrink-0 text-[#262626]" aria-hidden="true" />
        <div>
          <p className="mb-1 text-[15px] font-medium text-[#262626]">Payouts are now available</p>
          <p className="text-sm leading-relaxed text-slate-600">
            You're all set to request a payout. Head to your wallet to get started.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Earnings & Payouts</h1>
          <p className="text-slate-500 mt-1">Track your profits and manage withdrawals</p>
        </div>
        <PayoutPopup availableBalance={availableBalance} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEarned)}</div>
            <p className="text-xs text-slate-500 mt-1">Lifetime Profit Made</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(availableBalance)}</div>
            <p className="text-xs text-slate-500 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Payout</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPaidOut)}</div>
            <p className="text-xs text-slate-500 mt-1">Hurray!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Payout In Queue</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#262626]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(payoutData?.pendingAmount || 0)}</div>
            <Badge variant="secondary" className="mt-1">Silver Tier</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "commissions" ? "default" : "ghost"}
          onClick={() => setActiveTab("commissions")}
          className={activeTab === "commissions" ? "bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold" : ""}
        >
          Profit History
        </Button>
        <Button
          variant={activeTab === "payouts" ? "default" : "ghost"}
          onClick={() => setActiveTab("payouts")}
          className={activeTab === "payouts" ? "bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold" : ""}
        >
          Payout History
        </Button>
      </div>

      {/* Commission History Table */}
      {activeTab === "commissions" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profit Breakdown</CardTitle>
                <CardDescription>Latest earnings from your referral link</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead className="min-w-[120px]">Subscription</TableHead>
                    <TableHead>Order Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Profits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingCommissions ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                          <span className="text-slate-500">Loading commissions...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : commissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No profits yet. Share your referral link to start earning!
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="text-slate-500 whitespace-nowrap">
                          {new Date(commission.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{commission.orderId}</TableCell>
                        <TableCell className="whitespace-nowrap">{commission.subscription}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(commission.orderAmount)}</TableCell>
                        <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
                          {commission.status === "earned" ? (
                            <span className="capitalize rounded-md p-1 text-white bg-green-500">{commission.status}</span>
                          ) : (
                            <span className="capitalize rounded-md p-2 text-white bg-gray-500">{commission.status}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
                          {commission.status === "earned" ? (
                            <span className="text-green-600">+{formatCurrency(commission.commission)}</span>
                          ) : (
                            <span className="text-gray-500">+{formatCurrency(commission.commission)}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout History Table */}
      {activeTab === "payouts" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Withdrawal History</CardTitle>
                <CardDescription>Latest payouts to your account</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPayouts ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        <span className="text-slate-500">Loading Payouts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      You've not made any payouts yet
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout) => (
                    <TableRow key={payout._id}>
                      <TableCell className="text-slate-500">
                        {new Date(payout.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{payout.transactionReference || "—"}</TableCell>
                      <TableCell>{payout.network}</TableCell>
                      <TableCell className="text-right font-bold">
                        <span className="flex items-center justify-end gap-1">
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                          {formatCurrency(payout.netAmount ?? payout.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payout.status === "completed"
                              ? "bg-green-500 hover:bg-green-600 text-white/90"
                              : payout.status === "pending"
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white/90"
                                : "bg-red-500 hover:bg-red-600 text-white/90"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}