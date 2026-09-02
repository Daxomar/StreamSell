
// "use client"
// import { useState } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { List } from "../../components/dashboard/listss"
// import { FulfillDialog } from "@/components/dashboard/FulfillDialog"
// import { StatCard } from "../../components/dashboard/stat-card"
// import { api } from "@/lib/api"
// import toast from "react-hot-toast"

// const WalletIcon = ({ className }) => <i className={`fa-solid fa-wallet ${className || ""}`} />
// const LIMIT = 25

// export default function OrdersPage() {
//   const queryClient = useQueryClient()
//   const [fulfillTarget, setFulfillTarget] = useState(null)
//   const [activeTab, setActiveTab] = useState("pending")

//   // per-tab page state
//   const [pages, setPages] = useState({ pending: 1, processing: 1, delivered: 1, failed: 1 })

//   // ── Stats (overall, shared) ──
//   const { data: statsData } = useQuery({
//     queryKey: ["fulfillmentStats"],
//     queryFn: () => api("/api/v1/transactions/fulfillment-stats"),
//     refetchInterval: 30000,
//   })
//   const stats = statsData?.data

//   // ── Queue for the ACTIVE tab (paginated) ──
//   const {
//     data: queueData,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["fulfillmentQueue", activeTab, pages[activeTab]],
//     queryFn: () =>
//       api(`/api/v1/transactions/fulfillment-queue?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
//     keepPreviousData: true,
//   })
//   const orders = queueData?.orders || []
//   const pagination = queueData?.pagination

//   // ── Claim mutation (pending → processing) ──
//   const claimMutation = useMutation({
//     mutationFn: (reference) =>
//       api(`/api/v1/transactions/${reference}/claim`, { method: "PATCH" }),
//     onSuccess: () => {
//       toast.success("Order claimed — moved to Processing")
//       // refresh pending (order leaves) + processing (order appears) + counts
//       queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
//       queryClient.invalidateQueries({ queryKey: ["fulfillmentStats"] })
//     },
//     onError: (err) => {
//       toast.error(err?.message || "Could not claim — it may already be taken")
//       // refresh pending so the taken order disappears
//       queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
//     },
//   })

//   const setPage = (tab, page) => setPages((prev) => ({ ...prev, [tab]: page }))

//   const tabMeta = [
//     { v: "pending", label: "Pending", count: stats?.counts?.pending },
//     { v: "processing", label: "Processing", count: stats?.counts?.processing },
//     { v: "delivered", label: "Delivered", count: null },
//     { v: "failed", label: "Failed", count: stats?.counts?.failed },
//   ]

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold">Orders</h2>
//           <p className="text-muted-foreground">Fulfill paid orders and deliver credentials.</p>
//         </div>
//       </div>

//       {/* Overall stats (shared) */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard
//           title="Realized Revenue (This Month)"
//           value={stats?.revenue?.realized ?? 0}
//           isCurrency
//           subtitle={`Potential: ${stats?.revenue?.potential ?? 0}`}
//           icon={WalletIcon}
//         />
//         <StatCard title="Pending" value={stats?.counts?.pending ?? 0} icon={() => <i className="fa-solid fa-clock" />} />
//         <StatCard title="Processing" value={stats?.counts?.processing ?? 0} icon={() => <i className="fa-solid fa-spinner" />} />
//         <StatCard title="Failed" value={stats?.counts?.failed ?? 0} icon={() => <i className="fa-solid fa-triangle-exclamation" />} />
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
//           {tabMeta.map(({ v, label, count }) => (
//             <TabsTrigger
//               key={v}
//               value={v}
//               className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
//             >
//               {label}{count != null ? ` (${count})` : ""}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {["pending", "processing", "delivered", "failed"].map((tab) => (
//           <TabsContent key={tab} value={tab}>
//             <Card className="w-full border-none shadow-none py-2">
//               <List
//                 items={activeTab === tab ? orders : []}
//                 type="order"
//                 isLoading={activeTab === tab && isLoading}
//                 isError={activeTab === tab && isError}
//                 error={error}
//                 // Pending → Claim button; Processing → Fulfill button
//                 onClaim={tab === "pending" ? (row) => claimMutation.mutate(row.reference) : null}
//                 onFulfill={tab === "processing" ? (row) => setFulfillTarget(row) : null}
//                 claiming={claimMutation.isPending}
//               />

//               {/* Pagination */}
//               {pagination && pagination.pages > 1 && (
//                 <div className="flex items-center justify-between px-4 py-3">
//                   <span className="text-sm text-gray-500">
//                     Page {pagination.page} of {pagination.pages} · {pagination.total} orders
//                   </span>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={pages[tab] <= 1}
//                       onClick={() => setPage(tab, pages[tab] - 1)}
//                     >
//                       Previous
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={pages[tab] >= pagination.pages}
//                       onClick={() => setPage(tab, pages[tab] + 1)}
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </Card>
//           </TabsContent>
//         ))}
//       </Tabs>

//       {/* Fulfill dialog (processing → delivered) */}
//       <FulfillDialog
//         order={fulfillTarget}
//         open={!!fulfillTarget}
//         onOpenChange={(open) => !open && setFulfillTarget(null)}
//         onSuccess={() => {
//           queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
//           queryClient.invalidateQueries({ queryKey: ["fulfillmentStats"] })
//           setFulfillTarget(null)
//         }}
//       />
//     </div>
//   )
// }








"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List } from "../../components/dashboard/listss"
import { FulfillDialog } from "@/components/dashboard/FulfillDialog"
import { StatCard } from "../../components/dashboard/stat-card"
import { api } from "@/lib/api"
import { Search, X } from "lucide-react"

export function EditCredentialsDialog({ order, open, onOpenChange, onSuccess }) {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // prefill from the order's existing credentials
  useEffect(() => {
    if (order) {
      setLoginEmail(order.credentials?.loginEmail || "")
      setLoginPassword(order.credentials?.loginPassword || "")
    }
  }, [order])

  const editMutation = useMutation({
    mutationFn: () =>
      api(`/api/v1/transactions/${order.reference}/update-credentials`, {
        method: "PATCH",
        body: JSON.stringify({ credentials: { loginEmail, loginPassword } }),
      }),
    onSuccess: () => {
      toast.success("Credentials updated")
      onSuccess?.()
    },
    onError: (err) => toast.error(err?.message || "Update failed"),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none">
        <DialogHeader>
          <DialogTitle>Edit Credentials</DialogTitle>
          <DialogDescription>
            {order?.subscriptionName} · {order?.reference}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-email">Login Email</Label>
            <Input id="edit-email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-pass">Login Password</Label>
            <Input id="edit-pass" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={editMutation.isPending}>Cancel</Button>
          <Button
            className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
            disabled={editMutation.isPending}
            onClick={() => editMutation.mutate()}
          >
            {editMutation.isPending ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


const WalletIcon = ({ className }) => <i className={`fa-solid fa-wallet ${className || ""}`} />
const LIMIT = 25

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [fulfillTarget, setFulfillTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [pages, setPages] = useState({ pending: 1, processing: 1, delivered: 1, failed: 1 })

  // search
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // ── Stats ──
  const { data: statsData } = useQuery({
    queryKey: ["fulfillmentStats"],
    queryFn: () => api("/api/v1/transactions/fulfillment-stats"),
    refetchInterval: 30000,
  })
  const stats = statsData?.data

  // ── Queue for active tab ──
  const { data: queueData, isLoading, isError, error } = useQuery({
    queryKey: ["fulfillmentQueue", activeTab, pages[activeTab]],
    queryFn: () =>
      api(`/api/v1/transactions/fulfillment-queue?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
    keepPreviousData: true,
    enabled: !searchQuery, // pause queue when searching
  })
  const orders = queueData?.orders || []
  const pagination = queueData?.pagination

  // ── Search query ──
  const { data: searchData, isLoading: isSearching, isError: isSearchError, error: searchError } = useQuery({
    queryKey: ["orderSearch", searchQuery],
    queryFn: () => api(`/api/v1/transactions/search?q=${encodeURIComponent(searchQuery)}`),
    enabled: !!searchQuery,
  })
  const searchResults = searchData?.data || []

  // ── Claim mutation ──
  const claimMutation = useMutation({
    mutationFn: (reference) => api(`/api/v1/transactions/${reference}/claim`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Order claimed — moved to Processing")
      queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
      queryClient.invalidateQueries({ queryKey: ["fulfillmentStats"] })
    },
    onError: (err) => {
      toast.error(err?.message || "Could not claim — it may already be taken")
      queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
    },
  })

  const setPage = (tab, page) => setPages((prev) => ({ ...prev, [tab]: page }))

  const handleSearch = () => {
    if (!searchInput.trim()) return
    setSearchQuery(searchInput.trim())
  }
  const clearSearch = () => {
    setSearchInput("")
    setSearchQuery("")
  }

  const tabMeta = [
    { v: "pending", label: "Pending", count: stats?.counts?.pending },
    { v: "processing", label: "Processing", count: stats?.counts?.processing },
    { v: "delivered", label: "Delivered", count: stats?.counts?.delivered }, // ← needs backend
    { v: "failed", label: "Failed", count: stats?.counts?.failed },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Orders</h2>
          <p className="text-muted-foreground">Fulfill paid orders and deliver credentials.</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search by reference or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 py-2 rounded-lg border border-[#EEEEEE] bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 placeholder:text-gray-500 transition-all"
          />
          {searchInput && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} className="bg-[#262626] hover:bg-[#3a3a3a] text-white">
          Search
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Realized Revenue (This Month)"
          value={stats?.revenue?.realized ?? 0}
          isCurrency
          subtitle={`Potential: ${stats?.revenue?.potential ?? 0}`}
          icon={WalletIcon}
        />
        <StatCard title="Pending" value={stats?.counts?.pending ?? 0} icon={() => <i className="fa-solid fa-clock text-gray-500" />} />
        <StatCard title="Processing" value={stats?.counts?.processing ?? 0} icon={() => <i className="fa-solid fa-spinner text-gray-500" />} />
        <StatCard title="Failed" value={stats?.counts?.failed ?? 0} icon={() => <i className="fa-solid fa-triangle-exclamation text-gray-500" />} />
      </div>

      {/* SEARCH RESULTS (replaces tabs while searching) */}
      {searchQuery ? (
        <Card className="w-full border-none shadow-none py-2">
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-sm text-slate-500">
              Results for "<span className="font-medium text-slate-700">{searchQuery}</span>"
            </p>
            <Button variant="outline" size="sm" onClick={clearSearch}>Clear</Button>
          </div>
          <List
            items={searchResults}
            type="order"
            isLoading={isSearching}
            isError={isSearchError}
            error={searchError}
            // in search, allow claim (pending), fulfill (processing), edit (delivered)
            onClaim={(row) => row.deliveryStatus === "pending" && claimMutation.mutate(row.reference)}
            onFulfill={(row) => row.deliveryStatus === "processing" && setFulfillTarget(row)}
            onEdit={(row) => row.deliveryStatus === "delivered" && setEditTarget(row)}
            claiming={claimMutation.isPending}
          />
        </Card>
      ) : (
        /* NORMAL TABS */
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2 hidden md:flex">
            {tabMeta.map(({ v, label, count }) => (
              <TabsTrigger
                key={v}
                value={v}
                className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
              >
                {label}{count != null ? ` (${count})` : ""}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="w-full flex overflow-x-auto md:hidden border border-gray-200/50 bg-gray-200/50 rounded-md p-1 gap-1 justify-start">
            {tabMeta.map(({ v, label, count }) => (
              <TabsTrigger
                key={v}
                value={v}
                className="shrink-0 md:shrink data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-200 px-3 py-2.5 rounded-md text-gray-500 font-medium text-sm whitespace-nowrap"
              >
                {label}{count != null ? ` (${count})` : ""}
              </TabsTrigger>
            ))}
          </TabsList>

          {["pending", "processing", "delivered", "failed"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="w-full border-none shadow-none py-2">
                <List
                  items={activeTab === tab ? orders : []}
                  type="order"
                  isLoading={activeTab === tab && isLoading}
                  isError={activeTab === tab && isError}
                  error={error}
                  onClaim={tab === "pending" ? (row) => claimMutation.mutate(row.reference) : null}
                  onFulfill={tab === "processing" ? (row) => setFulfillTarget(row) : null}
                  onEdit={tab === "delivered" ? (row) => setEditTarget(row) : null}
                  claiming={claimMutation.isPending}
                />

                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.pages} · {pagination.total} orders
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={pages[tab] <= 1} onClick={() => setPage(tab, pages[tab] - 1)}>Previous</Button>
                      <Button variant="outline" size="sm" disabled={pages[tab] >= pagination.pages} onClick={() => setPage(tab, pages[tab] + 1)}>Next</Button>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Fulfill dialog (processing → delivered) */}
      <FulfillDialog
        order={fulfillTarget}
        open={!!fulfillTarget}
        onOpenChange={(open) => !open && setFulfillTarget(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
          queryClient.invalidateQueries({ queryKey: ["fulfillmentStats"] })
          setFulfillTarget(null)
        }}
      />

      {/* Edit dialog (delivered — update credentials + re-send) */}
      <EditCredentialsDialog
        order={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
          queryClient.invalidateQueries({ queryKey: ["orderSearch"] })
          setEditTarget(null)
        }}
      />
    </div>
  )
}