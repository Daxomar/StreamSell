// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Copy, CheckCircle, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react"
// import { formatCurrency } from "@/lib/utils"
// import { useQuery } from "@tanstack/react-query"
// import toast from "react-hot-toast"
// import { useUser } from "../contexts/UserContext"
// import { VerifyEmailButton } from "../../components/reseller/email-verify-button"
// import { api } from "../../lib/api"

// export default function ResellerDashboard() {
//   const [copied, setCopied] = useState(false)

//   const { reseller, isLoadingReseller, isErrorReseller } = useUser()

//   // ── Referral link ──
//   const fetchReferralLink = async () => {
//     const data = await api(`/api/v1/users/reseller-link`)   // fixed: removed stray `}`
//     if (!data.success) {
//       throw new Error(data.message || "Failed to fetch referral link")  // fixed: was undefined `err`
//     }
//     return data // { success, message, referralURL }
//   }

//   // ── Recent commissions ──
//   const fetchRecentCommissions = async () => {
//     const data = await api(`/api/v1/commissions/my-commissions?page=1&limit=5`)  // fixed: api() + prefix + `?page`
//     if (!data.success) {
//       throw new Error(data.message || "Failed to fetch commissions")
//     }
//     return data // { success, commissions: [...], pagination: {...} }
//   }

//   // ============================================
//   // REACT QUERY HOOKS
//   // ============================================

//   const {
//     data: referralData,
//     isLoading: isLoadingReferral,
//     isError: isErrorReferral,
//   } = useQuery({
//     queryKey: ["referralLink", reseller?._id],
//     queryFn: fetchReferralLink,
//     enabled: !!reseller?._id,
//   })

//   const {
//     data: commissionsData,
//     isLoading: isLoadingCommissions,
//     isError: isErrorCommissions,
//   } = useQuery({
//     queryKey: ["recentCommissions", reseller?._id],
//     queryFn: fetchRecentCommissions,
//     enabled: !!reseller?._id,
//   })

//   // ============================================
//   // HANDLERS
//   // ============================================

//   const copyLink = () => {
//     if (referralData?.referralURL) {
//       navigator.clipboard.writeText(referralData.referralURL)
//       setCopied(true)
//       toast.success("Link copied!")
//       setTimeout(() => setCopied(false), 2000)
//     }
//   }

//   // ============================================
//   // DATA EXTRACTION
//   // ============================================

//   const referralLink = referralData?.referralURL || "Loading..."

//   const stats = {
//     totalEarned: reseller?.totalCommissionEarned || 0,          // check field name vs your backend
//     totalPaid: reseller?.totalCommissionPaidOut || 0,
//     totalSales: reseller?.totalSales || 0,
//     pendingPayout: (reseller?.totalCommissionEarned || 0) - (reseller?.totalCommissionPaidOut || 0),
//   }
//   const commissions = commissionsData?.commissions || []

//   // ============================================
//   // RENDER
//   // ============================================

//   return (
//     <div className="space-y-8">
//       {/* Advertising policy notice */}
//       <div className="border-2 border-[#262626] rounded-lg p-4 mb-6 bg-slate-50">
//         <p className="text-sm font-black text-[#262626]">Reseller Advertising Policy</p>
//         <p className="text-sm mt-1 text-slate-600">
//           Resellers are <strong>not allowed</strong> to publicly advertise their reseller links on platforms such as Facebook or Instagram. Any account found violating this rule will be <strong>immediately deactivated</strong>.
//           <br /><br />
//           To help keep the platform fair, anyone who reports a confirmed violation will receive <strong>50% of the offending reseller's total earnings</strong> as a reward.
//         </p>
//       </div>

//       {/* Welcome & Link Section */}
//       <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
//           <p className="text-slate-500">{reseller?.name}</p>
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
//           <p className="text-slate-500">Track your sales and commissions.</p>
//         </div>

//         <Card className="w-full md:w-auto min-w-0 bg-slate-50 border-slate-100">
//           <CardContent className="p-4 flex items-center gap-3">
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-medium text-[#262626] mb-1">Your Referral Link</p>
//               <div className="flex items-center gap-2 bg-white rounded-md border px-3 py-2 w-full">
//                 {isLoadingReferral ? (
//                   <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
//                 ) : (
//                   <code className="text-sm flex-1 truncate">{referralLink}</code>
//                 )}
//               </div>
//             </div>
//             <Button
//               size="icon"
//               onClick={copyLink}
//               disabled={isLoadingReferral}
//               className={copied ? "bg-green-600 hover:bg-green-700" : "bg-[#262626] hover:bg-[#3a3a3a]"}
//             >
//               {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-3">
//         {/* Total Earnings */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
//             <DollarSign className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingReseller ? (
//               <div className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-sm text-slate-500">Loading...</span>
//               </div>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{formatCurrency(stats.totalEarned)}</div>
//                 <p className="text-xs text-muted-foreground mt-1">Total profits earned from all sales</p>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Total Sales */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Total Sales</CardTitle>
//             <Users className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingReseller ? (
//               <div className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-sm text-slate-500">Loading...</span>
//               </div>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{stats.totalSales}</div>
//                 <p className="text-xs text-muted-foreground mt-1">Completed orders</p>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Reseller Tier */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">Reseller Tier</CardTitle>
//             <TrendingUp className="h-4 w-4 text-slate-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoadingReseller ? (
//               <div className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 <span className="text-sm text-slate-500">Loading...</span>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div>
//                     <div className="text-2xl font-bold text-slate-900">
//                       {stats.totalSales >= 1000 ? "Elite" : stats.totalSales >= 100 ? "Premium" : stats.totalSales >= 50 ? "Silver" : "Starter"}
//                     </div>
//                     <p className="text-xs text-slate-500">{stats.totalSales} total sales</p>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-slate-100">
//                   <VerifyEmailButton />
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Commissions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Profits</CardTitle>
//           <CardDescription>Latest earnings from your referral link.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Transaction ID</TableHead>
//                   <TableHead className="min-w-[120px]">Subscription</TableHead>
//                   <TableHead>Order Amount</TableHead>
//                   <TableHead className="text-right">Status</TableHead>
//                   <TableHead className="text-right">Profits</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoadingCommissions ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8">
//                       <div className="flex items-center justify-center gap-2">
//                         <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
//                         <span className="text-slate-500">Loading commissions...</span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : commissions.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="text-center py-8 text-slate-500">
//                       No commissions yet. Share your referral link to start earning!
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   commissions.map((item) => (
//                     <TableRow key={item.id}>
//                       <TableCell className="text-slate-500 whitespace-nowrap">
//                         {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                       </TableCell>
//                       <TableCell className="font-medium whitespace-nowrap">{item.orderId}</TableCell>
//                       <TableCell className="whitespace-nowrap">{item.subscription}</TableCell>
//                       <TableCell className="whitespace-nowrap">{formatCurrency(item.orderAmount)}</TableCell>
//                       <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
//                         {item.status === "earned" ? (
//                           <span className="capitalize rounded-md p-1 text-white bg-green-500">{item.status}</span>
//                         ) : (
//                           <span className="capitalize rounded-md p-2 text-white bg-gray-500">{item.status}</span>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-right font-bold text-green-600 whitespace-nowrap">
//                         {item.status === "earned" ? (
//                           <span className="text-green-600">+{formatCurrency(item.commission)}</span>
//                         ) : (
//                           <span className="text-gray-500">+{formatCurrency(item.commission)}</span>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, CheckCircle, TrendingUp, Users, DollarSign, Clock, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useUser } from "../contexts/UserContext"
import { api } from "../../lib/api"

export default function ResellerDashboard() {
  const [copied, setCopied] = useState(false)

  const { reseller, isLoadingReseller } = useUser()

  // ── Referral link ──
  const fetchReferralLink = async () => {
    const data = await api(`/api/v1/users/reseller-link`)
    if (!data.success) throw new Error(data.message || "Failed to fetch referral link")
    return data
  }

  // ── Recent commissions ──
  const fetchRecentCommissions = async () => {
    const data = await api(`/api/v1/commissions/my-commissions?page=1&limit=5`)
    if (!data.success) throw new Error(data.message || "Failed to fetch commissions")
    return data
  }

  const { data: referralData, isLoading: isLoadingReferral } = useQuery({
    queryKey: ["referralLink", reseller?._id],
    queryFn: fetchReferralLink,
    enabled: !!reseller?._id,
  })

  const { data: commissionsData, isLoading: isLoadingCommissions } = useQuery({
    queryKey: ["recentCommissions", reseller?._id],
    queryFn: fetchRecentCommissions,
    enabled: !!reseller?._id,
  })

  const copyLink = () => {
    if (referralData?.referralURL) {
      navigator.clipboard.writeText(referralData.referralURL)
      setCopied(true)
      toast.success("Link copied!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const referralLink = referralData?.referralURL || "Loading..."

  const stats = {
    totalEarned: reseller?.totalCommissionEarned || 0,
    totalPending: reseller?.totalCommissionPending || 0,
    totalSales: reseller?.totalSales || 0,
  }

  const commissions = commissionsData?.commissions || []

  const tier =
    stats.totalSales >= 1000 ? "Elite" :
    stats.totalSales >= 100 ? "Premium" :
    stats.totalSales >= 50 ? "Silver" : "Starter"

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Advertising policy notice */}
      {/* <div className="rounded-lg p-4 bg-[#262626]/5">
        <p className="text-sm font-black text-[#262626]">Reseller Advertising Policy</p>
        <p className="text-sm mt-1 text-slate-600">
          Resellers are <strong>not allowed</strong> to publicly advertise their reseller links on platforms such as Facebook or Instagram. Any account found violating this rule will be <strong>immediately deactivated</strong>.
          <br /><br />
          To help keep the platform fair, anyone who reports a confirmed violation will receive <strong>50% of the offending reseller's total earnings</strong> as a reward.
        </p>
      </div> */}

      {/* Welcome & Link Section */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500">{reseller?.name}</p>
        </div>

        <Card className="w-full md:w-auto min-w-0 bg-slate-50 border-none shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#262626] mb-1">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 w-full">
                {isLoadingReferral ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : (
                  <code className="text-sm flex-1 truncate">{referralLink}</code>
                )}
              </div>
            </div>
            <Button
              size="icon"
              onClick={copyLink}
              disabled={isLoadingReferral}
              className={copied ? "bg-gray-400 hover:bg-gray-500" : "bg-[#262626] hover:bg-[#3a3a3a]"}
            >
              {copied ? <CheckCircle className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats — 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Earnings */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#262626]" />
          </CardHeader>
          <CardContent className="">
            {isLoadingReseller ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#262626]">{formatCurrency(stats.totalEarned)}</div>
                <p className="text-xs text-slate-400 mt-1">Withdrawable from delivered orders</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending Commission */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="">
            {isLoadingReseller ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalPending)}</div>
                <p className="text-xs text-slate-400 mt-1">Releases once orders are delivered</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales</CardTitle>
            <Users className="h-4 w-4 text-[#262626]" />
          </CardHeader>
          <CardContent className="">
            {isLoadingReseller ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#262626]">{stats.totalSales}</div>
                <p className="text-xs text-slate-400 mt-1">Completed orders</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Reseller Tier */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Reseller Tier</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#262626]" />
          </CardHeader>
          <CardContent className="">
            {isLoadingReseller ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#262626]">{tier}</div>
                <p className="text-xs text-slate-400 mt-1">{stats.totalSales} total sales</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Commissions */}
      <Card className="border-none shadow-sm">
        <CardHeader className="">
          <CardTitle className="">Recent Profits</CardTitle>
          <CardDescription className="">Latest earnings from your referral link.</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="overflow-x-auto">
            <Table className="">
              <TableHeader className="">
                <TableRow className="border-none">
                  <TableHead className="">Date</TableHead>
                  <TableHead className="">Transaction ID</TableHead>
                  <TableHead className="min-w-[120px]">Subscription</TableHead>
                  <TableHead className="">Order Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Profits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {isLoadingCommissions ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        <span className="text-slate-500">Loading commissions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : commissions.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No commissions yet. Share your referral link to start earning!
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((item) => (
                    <TableRow key={item.id} className="border-none">
                      <TableCell className="text-slate-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{item.orderId}</TableCell>
                      <TableCell className="whitespace-nowrap">{item.subscription}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCurrency(item.orderAmount)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className={`capitalize rounded-md px-2 py-1 text-xs text-white ${item.status === "earned" ? "bg-green-600" : "bg-amber-500"}`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold whitespace-nowrap">
                        <span className={item.status === "earned" ? "text-green-600" : "text-amber-600"}>
                          +{formatCurrency(item.commission)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}