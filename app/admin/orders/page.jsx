
// "use client"
// import { useState } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { List } from "../../../components/dashboard/listss"
// import { FulfillDialog } from "@/components/dashboard/FulfillDialog"
// import { StatCard } from "../../../components/dashboard/stat-card"
// import { api } from "@/lib/api"

// const MOCK_ORDERS = [
//   // ── PENDING (3) ──
//   {
//     _id: "1", reference: "SUBpay_1785640000_100001",
//     subscriptionName: "Netflix Premium 1 Month", plan: "Premium 4K",
//     customerPhone: "0555322276", amount: 76.22, costPrice: 45,
//     deliveryStatus: "pending", createdAt: "2026-08-04T08:15:00Z",
//   },
//   {
//     _id: "2", reference: "SUBpay_1785641000_100002",
//     subscriptionName: "Spotify Premium 1 Month", plan: "Individual",
//     customerPhone: "0244815003", amount: 39.14, costPrice: 20,
//     deliveryStatus: "pending", createdAt: "2026-08-04T06:40:00Z",
//   },
//   {
//     _id: "3", reference: "SUBpay_1785642000_100003",
//     subscriptionName: "HBO Max 1 Month", plan: "Standard",
//     customerPhone: "0501234567", amount: 71.07, costPrice: 35,
//     deliveryStatus: "pending", createdAt: "2026-08-03T22:10:00Z",
//   },

//   // ── PROCESSING (2) ──
//   {
//     _id: "4", reference: "SUBpay_1785630000_100004",
//     subscriptionName: "Disney+ 1 Month", plan: "Premium",
//     customerPhone: "0598492924", amount: 56.65, costPrice: 30,
//     deliveryStatus: "processing", createdAt: "2026-08-03T14:20:00Z",
//   },
//   {
//     _id: "5", reference: "SUBpay_1785631000_100005",
//     subscriptionName: "YouTube Premium 1 Month", plan: "Individual",
//     customerPhone: "0261112223", amount: 42.23, costPrice: 18,
//     deliveryStatus: "processing", createdAt: "2026-08-03T11:05:00Z",
//   },

//   // ── DELIVERED (3) ──
//   {
//     _id: "6", reference: "SUBpay_1785500000_100006",
//     subscriptionName: "Netflix Premium 1 Month", plan: "Premium 4K",
//     customerPhone: "0557778889", amount: 79.31, costPrice: 45,
//     deliveryStatus: "delivered", createdAt: "2026-08-02T09:30:00Z",
//   },
//   {
//     _id: "7", reference: "SUBpay_1785501000_100007",
//     subscriptionName: "Spotify Premium 1 Month", plan: "Individual",
//     customerPhone: "0243334445", amount: 38.90, costPrice: 20,
//     deliveryStatus: "delivered", createdAt: "2026-08-02T16:45:00Z",
//   },
//   {
//     _id: "8", reference: "SUBpay_1785502000_100008",
//     subscriptionName: "HBO Max 1 Month", plan: "Standard",
//     customerPhone: "0509998887", amount: 58.71, costPrice: 35,
//     deliveryStatus: "delivered", createdAt: "2026-08-01T13:15:00Z",
//   },

//   // ── FAILED (2) ──
//   {
//     _id: "9", reference: "SUBpay_1785490000_100009",
//     subscriptionName: "Disney+ 1 Month", plan: "Premium",
//     customerPhone: "0555000111", amount: 55.20, costPrice: 30,
//     deliveryStatus: "failed", createdAt: "2026-08-01T10:00:00Z",
//     failureReason: "SMS delivery failed — invalid number",
//   },
//   {
//     _id: "10", reference: "SUBpay_1785491000_100010",
//     subscriptionName: "YouTube Premium 1 Month", plan: "Individual",
//     customerPhone: "0269876543", amount: 41.20, costPrice: 18,
//     deliveryStatus: "failed", createdAt: "2026-07-31T19:30:00Z",
//     failureReason: "Customer phone unreachable",
//   },
// ]

// const MOCK_EARNINGS = {
//   thisMonth: 253,      // sum of costPrice on this-month delivered/processing (adjust as you like)
//   ordersThisMonth: 7,
// }

// const WalletIcon = ({ className }) => <i className={`fa-solid fa-wallet ${className || ""}`} />

// export default function OrdersPage() {
//   const queryClient = useQueryClient()
//   const [fulfillTarget, setFulfillTarget] = useState(null) // the order being fulfilled

//   // Fetch the fulfillment queue (scoped DTO from backend)
//   // const { data, isLoading, isError, error } = useQuery({
//   //   queryKey: ["fulfillmentQueue"],
//   //   queryFn: () => api("/api/v1/transactions/fulfillment-queue"),
//   //   staleTime: 30 * 1000,
//   // })

//   // const orders = data?.data?.orders || []
//   // const earnings = data?.data?.earnings || { thisMonth: 0, ordersThisMonth: 0 }

// const orders = MOCK_ORDERS
// const earnings = MOCK_EARNINGS
// const isLoading = false
// const isError = false
// const error = null


//   // Split by delivery status
//   const pending = orders.filter((o) => o.deliveryStatus === "pending")
//   const processing = orders.filter((o) => o.deliveryStatus === "processing")
//   const delivered = orders.filter((o) => o.deliveryStatus === "delivered")
//   const failed = orders.filter((o) => o.deliveryStatus === "failed")

//   return (
//     <div className="space-y-6">
//       {/* Header + earnings */}
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold">Orders</h2>
//           <p className="text-muted-foreground">Fulfill paid orders and deliver credentials.</p>
//         </div>
//       </div>

//       {/* Earnings + status counts */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard
//           title="Your Earnings (This Month)"
//           value={earnings.thisMonth}
//           isCurrency
//           subtitle={`${earnings.ordersThisMonth} orders fulfilled`}
//           icon={WalletIcon}
//         />
//         <StatCard title="Pending" value={pending.length} icon={() => <i className="fa-solid fa-clock" />} />
//         <StatCard title="Processing" value={processing.length} icon={() => <i className="fa-solid fa-spinner" />} />
//         <StatCard title="Delivered" value={delivered.length} icon={() => <i className="fa-solid fa-circle-check" />} />
//       </div>

//       {/* Tabs — reuse your list pattern */}
//       <Tabs defaultValue="pending" className="w-full">
//         <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
//           {[
//             { v: "pending", label: `Pending (${pending.length})` },
//             { v: "processing", label: `Processing (${processing.length})` },
//             { v: "delivered", label: `Delivered (${delivered.length})` },
//             { v: "failed", label: `Failed (${failed.length})` },
//           ].map(({ v, label }) => (
//             <TabsTrigger
//               key={v}
//               value={v}
//               className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border data-[state=active]:shadow-lg data-[state=active]:scale-105 data-[state=active]:-translate-y-0.5 transition-all duration-200 p-4 rounded-md text-gray-500 font-medium"
//             >
//               {label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <TabsContent value="pending">
//           <Card className="w-full border-none shadow-none py-2">
//             <List
//               items={pending}
//               type="order"
//               isLoading={isLoading}
//               isError={isError}
//               error={error}
//               onFulfill={(row) => setFulfillTarget(row)}   // ← fulfill opens dialog
//             />
//           </Card>
//         </TabsContent>

//         <TabsContent value="processing">
//           <Card className="w-full border-none shadow-none py-2">
//             <List items={processing} type="order" isLoading={isLoading} isError={isError} error={error} />
//           </Card>
//         </TabsContent>

//         <TabsContent value="delivered">
//           <Card className="w-full border-none shadow-none py-2">
//             <List items={delivered} type="order" isLoading={isLoading} isError={isError} error={error} />
//           </Card>
//         </TabsContent>

//         <TabsContent value="failed">
//           <Card className="w-full border-none shadow-none py-2">
//             <List items={failed} type="order" isLoading={isLoading} isError={isError} error={error} />
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Fulfill dialog */}
//       <FulfillDialog
//         order={fulfillTarget}
//         open={!!fulfillTarget}
//         onOpenChange={(open) => !open && setFulfillTarget(null)}
//         onSuccess={() => {
//           queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
//           setFulfillTarget(null)
//         }}
//       />
//     </div>
//   )
// }




"use client"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { List } from "../../../components/dashboard/listss"
import { FulfillDialog } from "@/components/dashboard/FulfillDialog"
import { StatCard } from "../../../components/dashboard/stat-card"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

const WalletIcon = ({ className }) => <i className={`fa-solid fa-wallet ${className || ""}`} />
const LIMIT = 25

export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [fulfillTarget, setFulfillTarget] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")

  // per-tab page state
  const [pages, setPages] = useState({ pending: 1, processing: 1, delivered: 1, failed: 1 })

  // ── Stats (overall, shared) ──
  const { data: statsData } = useQuery({
    queryKey: ["fulfillmentStats"],
    queryFn: () => api("/api/v1/transactions/fulfillment-stats"),
    refetchInterval: 30000,
  })
  const stats = statsData?.data

  // ── Queue for the ACTIVE tab (paginated) ──
  const {
    data: queueData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fulfillmentQueue", activeTab, pages[activeTab]],
    queryFn: () =>
      api(`/api/v1/transactions/fulfillment-queue?status=${activeTab}&page=${pages[activeTab]}&limit=${LIMIT}`),
    keepPreviousData: true,
  })
  const orders = queueData?.orders || []
  const pagination = queueData?.pagination

  // ── Claim mutation (pending → processing) ──
  const claimMutation = useMutation({
    mutationFn: (reference) =>
      api(`/api/v1/transactions/${reference}/claim`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Order claimed — moved to Processing")
      // refresh pending (order leaves) + processing (order appears) + counts
      queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
      queryClient.invalidateQueries({ queryKey: ["fulfillmentStats"] })
    },
    onError: (err) => {
      toast.error(err?.message || "Could not claim — it may already be taken")
      // refresh pending so the taken order disappears
      queryClient.invalidateQueries({ queryKey: ["fulfillmentQueue"] })
    },
  })

  const setPage = (tab, page) => setPages((prev) => ({ ...prev, [tab]: page }))

  const tabMeta = [
    { v: "pending", label: "Pending", count: stats?.counts?.pending },
    { v: "processing", label: "Processing", count: stats?.counts?.processing },
    { v: "delivered", label: "Delivered", count: null },
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

      {/* Overall stats (shared) */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Realized Revenue (This Month)"
          value={stats?.revenue?.realized ?? 0}
          isCurrency
          subtitle={`Potential: ${stats?.revenue?.potential ?? 0}`}
          icon={WalletIcon}
        />
        <StatCard title="Pending" value={stats?.counts?.pending ?? 0} icon={() => <i className="fa-solid fa-clock" />} />
        <StatCard title="Processing" value={stats?.counts?.processing ?? 0} icon={() => <i className="fa-solid fa-spinner" />} />
        <StatCard title="Failed" value={stats?.counts?.failed ?? 0} icon={() => <i className="fa-solid fa-triangle-exclamation" />} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
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

        {["pending", "processing", "delivered", "failed"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="w-full border-none shadow-none py-2">
              <List
                items={activeTab === tab ? orders : []}
                type="order"
                isLoading={activeTab === tab && isLoading}
                isError={activeTab === tab && isError}
                error={error}
                // Pending → Claim button; Processing → Fulfill button
                onClaim={tab === "pending" ? (row) => claimMutation.mutate(row.reference) : null}
                onFulfill={tab === "processing" ? (row) => setFulfillTarget(row) : null}
                claiming={claimMutation.isPending}
              />

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages} · {pagination.total} orders
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
    </div>
  )
}