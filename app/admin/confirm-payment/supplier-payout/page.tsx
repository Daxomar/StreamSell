// "use client"
// import { useState } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { List } from "@/components/dashboard/listss"
// import { StatCard } from "@/components/dashboard/stat-card"
// import {
//     Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog"
// import { formatCurrency } from "@/lib/utils"
// import { api } from "@/lib/api"
// import toast from "react-hot-toast"

// const LIMIT = 25
// const HandCoinsIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-hand-holding-dollar ${className || ""}`} />
// const ClockIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-clock ${className || ""}`} />
// const SpinnerIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-spinner ${className || ""}`} />
// const CheckIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-check ${className || ""}`} />

// type ValidateResult = {
//     payoutId: string
//     accountName: string
//     phoneNumber: string
//     amount: number
//     reference: string
// }

// export default function SupplierPayoutsPage() {
//     const queryClient = useQueryClient()
//     const [activeTab, setActiveTab] = useState<"pending" | "processing" | "paid">("pending")
//     const [pages, setPages] = useState<{ pending: number; processing: number; paid: number }>({ pending: 1, processing: 1, paid: 1 })
//     const [confirmOpen, setConfirmOpen] = useState(false)
//     const [validated, setValidated] = useState<ValidateResult | null>(null)

//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["supplierPayouts", activeTab, pages[activeTab]],
//         queryFn: () => api(`/api/v1/fulfiller-payouts/all?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
//         placeholderData: (prev: unknown) => prev,
//         refetchInterval: 60000,
//     })
//     const result = data?.data
//     const payouts = result?.payouts || []
//     const pagination = result?.pagination
//     const totals = result?.statusTotals || { pending: 0, processing: 0, paid: 0 }

//     const validateMutation = useMutation({
//         mutationFn: (id: string) => api(`/api/v1/fulfiller-payouts/${id}/validate`, { method: "POST" }),
//         onSuccess: (res: any) => { setValidated(res.data); setConfirmOpen(true) },
//         onError: (e: any) => toast.error(e?.message || "Validation failed"),
//     })

//     const initiateMutation = useMutation({
//         mutationFn: (id: string) => api(`/api/v1/fulfiller-payouts/${id}/initiate`, { method: "POST" }),
//         onSuccess: () => {
//             toast.success("Transfer initiated")
//             setConfirmOpen(false); setValidated(null)
//             queryClient.invalidateQueries({ queryKey: ["supplierPayouts"] })
//         },
//         onError: (e: any) => toast.error(e?.message || "Transfer failed"),
//     })

//     const setPage = (tab: "pending" | "processing" | "paid", page: number) =>
//         setPages((prev) => ({ ...prev, [tab]: page }))

//     const tabMeta: Array<{ v: "pending" | "processing" | "paid"; label: string; count: number }> = [
//         { v: "pending", label: "Pending", count: totals.pending },
//         { v: "processing", label: "Processing", count: totals.processing },
//         { v: "paid", label: "Paid", count: totals.paid },
//     ]

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between gap-4">
//                 <div>
//                     <h2 className="text-3xl font-bold">Supplier Payouts</h2>
//                     <p className="text-muted-foreground">Pay fulfillers for delivered orders via Moolre.</p>
//                 </div>
//             </div>

//             {/* Stats */}
//             <div className="grid gap-4 md:grid-cols-3">
//                 <StatCard subtitle="" className="" title="Pending" value={totals.pending} icon={ClockIcon} />
//                 <StatCard subtitle="" className="" title="Processing" value={totals.processing} icon={SpinnerIcon} />
//                 <StatCard subtitle="" className="" title="Paid" value={totals.paid} icon={CheckIcon} />
//             </div>

//             {/* Tabs */}
//             <Tabs value={activeTab} onValueChange={(v: any) => { setActiveTab(v as any); }} className="w-full">
//                 <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
//                     {tabMeta.map(({ v, label, count }) => (
//                         <TabsTrigger
//                             key={v}
//                             value={v}
//                             className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
//                         >
//                             {label} ({count})
//                         </TabsTrigger>
//                     ))}
//                 </TabsList>

//                 {(["pending", "processing", "paid"] as const).map((tab) => (
//                     <TabsContent key={tab} value={tab} className="">
//                         <Card className="w-full border-none shadow-none py-2">
//                             <List
//                                 items={(activeTab === tab ? payouts : []) as any}
//                                 type="supplierPayout"
//                                 isLoading={activeTab === tab && isLoading}
//                                 isError={activeTab === tab && isError}
//                                 error={error as any}
//                                 onPay={(tab === "pending" ? (row :any) => validateMutation.mutate(row._id) : null) as any}
//                                 paying={validateMutation.isPending}
//                             />

//                             {pagination && pagination.pages > 1 && (
//                                 <div className="flex items-center justify-between px-4 py-3">
//                                     <span className="text-sm text-gray-500">
//                                         Page {pagination.page} of {pagination.pages} · {pagination.total} payouts
//                                     </span>
//                                     <div className="flex gap-2">
//                                         <Button variant="outline" size="sm" disabled={pages[tab] <= 1} onClick={() => setPage(tab, pages[tab] - 1)}>
//                                             Previous
//                                         </Button>
//                                         <Button variant="outline" size="sm" disabled={pages[tab] >= pagination.pages} onClick={() => setPage(tab, pages[tab] + 1)}>
//                                             Next
//                                         </Button>
//                                     </div>
//                                 </div>
//                             )}
//                         </Card>
//                     </TabsContent>
//                 ))}
//             </Tabs>

//             {/* Release money confirm popup */}
//             <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader className="">
//                         <DialogTitle className="">Release Money?</DialogTitle>
//                         <DialogDescription className="">Confirm before sending via Moolre.</DialogDescription>
//                     </DialogHeader>
//                     {validated && (
//                         <div className="py-2">
//                             <div className="rounded-lg border-2 border-[#262626]/10 bg-slate-50 p-5">
//                                 <p className="text-sm text-slate-500">Release money for</p>
//                                 <p className="text-xl font-bold text-[#262626] mt-1">{validated.accountName}</p>
//                                 <p className="font-mono text-sm text-slate-700 mt-1">{validated.phoneNumber}</p>
//                                 <div className="mt-3 pt-3 border-t flex items-center justify-between">
//                                     <span className="text-sm text-slate-500">Amount</span>
//                                     <span className="text-2xl font-bold text-[#262626]">{formatCurrency(validated.amount)}</span>
//                                 </div>
//                                 <p className="text-xs text-slate-400 mt-2">Ref: {validated.reference}</p>
//                             </div>
//                         </div>
//                     )}
//                     <DialogFooter className="">
//                         <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={initiateMutation.isPending}>Cancel</Button>
//                         <Button
//                             className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
//                             disabled={initiateMutation.isPending}
//                             onClick={() => validated && initiateMutation.mutate(validated.payoutId)}
//                         >
//                             {initiateMutation.isPending ? "Sending..." : "Confirm & Send"}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }




"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List } from "@/components/dashboard/listss"
import { StatCard } from "@/components/dashboard/stat-card"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

const LIMIT = 25
const ClockIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-clock ${className || ""}`} />
const SpinnerIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-spinner ${className || ""}`} />
const CheckIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-check ${className || ""}`} />
const XIcon = ({ className }: { className?: string }) => <i className={`fa-solid fa-circle-xmark ${className || ""}`} />

type TabKey = "pending" | "processing" | "paid" | "failed"

type ValidateResult = {
    payoutId: string
    accountName: string
    resolvedName?: string
    phoneNumber: string
    amount: number
    reference: string
}

export default function SupplierPayoutsPage() {
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState<TabKey>("pending")
    const [pages, setPages] = useState<Record<TabKey, number>>({ pending: 1, processing: 1, paid: 1, failed: 1 })
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [validated, setValidated] = useState<ValidateResult | null>(null)

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["supplierPayouts", activeTab, pages[activeTab]],
        queryFn: () => api(`/api/v1/fulfiller-payouts/all?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
        placeholderData: (prev: unknown) => prev,
        refetchInterval: 60000,
    })
    const result = data?.data
    const payouts = result?.payouts || []
    const pagination = result?.pagination
    const totals = result?.statusTotals || { pending: 0, processing: 0, paid: 0, failed: 0 }

    const validateMutation = useMutation({
        mutationFn: (id: string) => api(`/api/v1/fulfiller-payouts/${id}/validate`, { method: "POST" }),
        onSuccess: (res: any) => { setValidated(res.data); setConfirmOpen(true) },
        onError: (e: any) => toast.error(e?.message || "Validation failed"),
    })

    const initiateMutation = useMutation({
        mutationFn: (id: string) => api(`/api/v1/fulfiller-payouts/${id}/initiate`, { method: "POST" }),
        onSuccess: () => {
            toast.success("Transfer initiated")
            setConfirmOpen(false); setValidated(null)
            queryClient.invalidateQueries({ queryKey: ["supplierPayouts"] })
        },
        onError: (e: any) => toast.error(e?.message || "Transfer failed"),
    })

    const setPage = (tab: TabKey, page: number) =>
        setPages((prev) => ({ ...prev, [tab]: page }))

    const tabMeta: Array<{ v: TabKey; label: string; count: number }> = [
        { v: "pending", label: "Pending", count: totals.pending },
        { v: "processing", label: "Processing", count: totals.processing },
        { v: "paid", label: "Paid", count: totals.paid },
        { v: "failed", label: "Failed", count: totals.failed },
    ]

    const nameMatches =
        validated?.resolvedName &&
        validated.resolvedName.toLowerCase() === validated.accountName.toLowerCase()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Supplier Payouts</h2>
                    <p className="text-muted-foreground">Pay fulfillers for delivered orders via Moolre.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <StatCard subtitle="" className="" title="Pending" value={totals.pending} icon={ClockIcon} />
                <StatCard subtitle="" className="" title="Processing" value={totals.processing} icon={SpinnerIcon} />
                <StatCard subtitle="" className="" title="Paid" value={totals.paid} icon={CheckIcon} />
                <StatCard subtitle="" className="" title="Failed" value={totals.failed} icon={XIcon} />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v as TabKey)} className="w-full">
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

                {(["pending", "processing", "paid", "failed"] as const).map((tab) => (
                    <TabsContent key={tab} value={tab} className="">
                        <Card className="w-full border-none shadow-none py-2">
                            <List
                                items={(activeTab === tab ? payouts : []) as any}
                                type="supplierPayout"
                                isLoading={activeTab === tab && isLoading}
                                isError={activeTab === tab && isError}
                                error={error as any}
                                onPay={(((tab === "pending" || tab === "failed") ? (row: any) => validateMutation.mutate(row._id) : null)) as any}
                                paying={validateMutation.isPending}
                            />

                            {pagination && pagination.pages > 1 && (
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-500">
                                        Page {pagination.page} of {pagination.pages} · {pagination.total} payouts
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" disabled={pages[tab] <= 1} onClick={() => setPage(tab, pages[tab] - 1)}>
                                            Previous
                                        </Button>
                                        <Button variant="outline" size="sm" disabled={pages[tab] >= pagination.pages} onClick={() => setPage(tab, pages[tab] + 1)}>
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Release money confirm popup */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="">
                        <DialogTitle className="">Release Money?</DialogTitle>
                        <DialogDescription className="">Confirm the recipient before sending via Moolre.</DialogDescription>
                    </DialogHeader>
                    {validated && (
                        <div className="py-2">
                            <div className="rounded-lg border-2 border-[#262626]/10 bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">Release money for</p>
                                <p className="text-xl font-bold text-[#262626] mt-1">{validated.accountName}</p>
                                <p className="font-mono text-sm text-slate-700 mt-1">{validated.phoneNumber}</p>

                                {validated.resolvedName && (
                                    <div className={`mt-3 rounded-md p-2 text-sm ${nameMatches ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                        <i className="fa-solid fa-shield-halved mr-1" />
                                        Moolre confirms: <strong>{validated.resolvedName}</strong>
                                        {!nameMatches && (
                                            <span className="block text-xs mt-1">
                                                ⚠️ This differs from your records — verify before sending.
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Amount</span>
                                    <span className="text-2xl font-bold text-[#262626]">{formatCurrency(validated.amount)}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Ref: {validated.reference}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={initiateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
                            disabled={initiateMutation.isPending}
                            onClick={() => validated && initiateMutation.mutate(validated.payoutId)}
                        >
                            {initiateMutation.isPending ? "Sending..." : "Confirm & Send"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}