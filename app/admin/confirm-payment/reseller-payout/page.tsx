"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/dashboard/stat-card"
import { List } from "@/components/dashboard/listss"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

const LIMIT = 25

const ClockIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-clock ${className || ""}`} />
const CheckIconC = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-check ${className || ""}`} />
const XIconC = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-xmark ${className || ""}`} />

export default function ConfirmPaymentPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "rejected">("pending")
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  // ── Fetch (same endpoint, now driven by activeTab) ──
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminPayouts", activeTab, page],
    queryFn: () => api(`/api/v1/payout/all?status=${activeTab}&page=${page}&limit=${LIMIT}`),
    refetchInterval: 60000,
    placeholderData: (prev: unknown) => prev,
  })
  const result = data?.data
  const payouts = result?.payouts || []
  const pagination = result?.pagination || { page: 1, pages: 1, total: 0 }
  const totals = result?.statusTotals || { pending: 0, completed: 0, rejected: 0 }

  // ── Confirm mutation (unchanged logic) ──
  const confirmMutation = useMutation({
    mutationFn: (payoutId: string) =>
      api(`/api/v1/payout/${payoutId}/process`, {
        method: "PATCH",
        body: JSON.stringify({ action: "approve", transactionReference: `JPAY-${Date.now()}` }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] })
      toast.success("Payout confirmed successfully")
      setIsConfirmOpen(false); setSelectedPayout(null)
    },
    onError: (e: any) => toast.error(e?.message || "Failed to confirm payout"),
  })

  // ── Reject mutation (unchanged logic) ──
  const rejectMutation = useMutation({
    mutationFn: ({ payoutId, reason }: { payoutId: string; reason: string }) =>
      api(`/api/v1/payout/${payoutId}/process`, {
        method: "PATCH",
        body: JSON.stringify({ action: "reject", rejectionReason: reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPayouts"] })
      toast.success("Payout rejected")
      setIsRejectOpen(false); setSelectedPayout(null); setRejectReason("")
    },
    onError: (e: any) => toast.error(e?.message || "Failed to reject payout"),
  })

  // client-side search
  const filtered = payouts.filter((p: any) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      p._id?.toLowerCase().includes(s) ||
      p.phoneNumber?.includes(search) ||
      p.reseller?.name?.toLowerCase().includes(s) ||
      p.accountName?.toLowerCase().includes(s)
    )
  })

  const setTab = (t: "pending" | "completed" | "rejected") => { setActiveTab(t); setPage(1) }

  const tabMeta: Array<{ v: "pending" | "completed" | "rejected"; label: string; count: number }> = [
    { v: "pending", label: "Pending", count: totals.pending },
    { v: "completed", label: "Completed", count: totals.completed },
    { v: "rejected", label: "Rejected", count: totals.rejected },
  ]

  const doReject = () => {
    if (!selectedPayout || !rejectReason.trim()) { toast.error("Please provide a rejection reason"); return }
    rejectMutation.mutate({ payoutId: selectedPayout._id, reason: rejectReason })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Confirm Payouts</h2>
          <p className="text-muted-foreground">Review and confirm reseller payout requests.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard className="" subtitle="" title="Pending" value={totals.pending} icon={ClockIcon} />
        <StatCard className="" subtitle="" title="Completed" value={totals.completed} icon={CheckIconC} />
        <StatCard className="" subtitle="" title="Rejected" value={totals.rejected} icon={XIconC} />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input placeholder="Search by name, MoMo number, ID..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setTab(v as any)} className="w-full">
        <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
          {tabMeta.map(({ v, label, count }) => (
            <TabsTrigger
              key={v}
              value={v}
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
            >
              {label} ({count})
            </TabsTrigger>
          ))}
        </TabsList>

        {(["pending", "completed", "rejected"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="">
            <Card className="w-full border-none shadow-none py-2">
              <List
                items={(activeTab === tab ? filtered : []) as any}
                type="resellerPayout"
                isLoading={activeTab === tab && isLoading}
                isError={activeTab === tab && isError}
                error={error as any}
                onView={((row: any) => { setSelectedPayout(row); setIsViewOpen(true) }) as any}
                onConfirm={((row: any) => { setSelectedPayout(row); setIsConfirmOpen(true) }) as any}
                onReject={((row: any) => { setSelectedPayout(row); setIsRejectOpen(true) }) as any}
              />

              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages} · {pagination.total} total</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* View dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="">
            <DialogTitle className="">Payout Request Details</DialogTitle>
            <DialogDescription className="">Review before processing.</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-500">Payout ID</p><p className="font-mono font-medium">{selectedPayout._id?.slice(-12)}</p></div>
                <div><p className="text-slate-500">Amount</p><p className="font-medium text-lg">{formatCurrency(selectedPayout.amount)}</p></div>
                <div><p className="text-slate-500">Reseller</p><p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p></div>
                <div><p className="text-slate-500">Net Amount</p><p className="font-medium">{formatCurrency(selectedPayout.netAmount || 0)}</p></div>
                <div><p className="text-slate-500">MoMo Number</p><p className="font-mono font-medium">{selectedPayout.phoneNumber}</p></div>
                <div><p className="text-slate-500">Network</p><p className="font-medium">{selectedPayout.network}</p></div>
                <div><p className="text-slate-500">Account Name</p><p className="font-medium">{selectedPayout.accountName}</p></div>
                <div><p className="text-slate-500">Fee</p><p className="font-medium text-red-600">{formatCurrency(selectedPayout.payoutCharge || 0)}</p></div>
              </div>
              <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">Send {formatCurrency(selectedPayout.netAmount)} to:</p>
                <p className="text-lg font-mono font-bold text-yellow-900 mt-1">{selectedPayout.phoneNumber}</p>
                <p className="text-sm text-yellow-700 mt-1">via {selectedPayout.network}</p>
                <p className="text-xs text-yellow-700 mt-2">Account Name: {selectedPayout.accountName}</p>
              </div>
            </div>
          )}
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button className="bg-[#262626] hover:bg-[#3a3a3a] text-white" onClick={() => { setIsViewOpen(false); setIsConfirmOpen(true) }}>
              <CheckCircle className="w-4 h-4 mr-2" /> Confirm Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="">
            <DialogTitle className="">Confirm Payout Sent</DialogTitle>
            <DialogDescription className="">Confirm you've sent the payout via MoMo. Marks it completed.</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="py-4">
              <div className="bg-slate-50 border rounded-md p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p>
                  <p className="text-sm text-slate-500">{selectedPayout.phoneNumber} • {selectedPayout.network}</p>
                </div>
                <p className="text-xl font-bold text-[#262626]">{formatCurrency(selectedPayout.netAmount || selectedPayout.amount)}</p>
              </div>
            </div>
          )}
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={confirmMutation.isPending}>Cancel</Button>
            <Button className="bg-[#262626] hover:bg-[#3a3a3a] text-white" onClick={() => selectedPayout && confirmMutation.mutate(selectedPayout._id)} disabled={confirmMutation.isPending}>
              {confirmMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><CheckCircle className="w-4 h-4 mr-2" /> Confirm Sent</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="">
            <DialogTitle className="">Reject Payout Request</DialogTitle>
            <DialogDescription className="">Provide a reason. The reseller will be notified.</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedPayout.reseller?.name || "Unknown"}</p>
                  <p className="text-sm text-slate-500">{selectedPayout.phoneNumber}</p>
                </div>
                <p className="text-xl font-bold text-red-600">{formatCurrency(selectedPayout.amount)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea className="" id="reason" placeholder="Enter the reason..." value={rejectReason} onChange={(e :any) => setRejectReason(e.target.value)} disabled={rejectMutation.isPending} />
              </div>
            </div>
          )}
          <DialogFooter className="">
            <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={rejectMutation.isPending}>Cancel</Button>
            <Button className="bg-red-500 text-white hover:bg-red-700" onClick={doReject} disabled={rejectMutation.isPending || !rejectReason.trim()}>
              {rejectMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rejecting...</> : <><XCircle className="w-4 h-4 mr-2" /> Reject</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}