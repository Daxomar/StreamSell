// "use client"

// import { Users, ShoppingCart, CreditCard, Activity, RefreshCw, AlertTriangle } from "lucide-react"
// import { formatCurrency } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { useTransactions } from "../contexts/TransactionContext"
// import QuickActions from "@/components/QuickActions"
// import LowStockAlert from "@/components/lowStockAlert"
// import { PageHeader, StatCard, DataPanel } from "@/components/dashboard"



// export default function AdminDashboard() {
//   //JANURY STATS
//   const January = 1904.37;
//   const ClientJanuary = 5420.13
//   const TotalJanuary = January + ClientJanuary;

//   //FEBRUARY STATS
//   const February = 2050.79
//   const ClientFebruary = 5837.69
//   const TotalFebraury = February + ClientFebruary


//   //FEBRUARY STATS
//   const April = 1546.66
//   const ClientApril = 4402.06
//   const TotalApril = April + ClientApril

//   // const paidOuttoDevelopers = January + February + April;
//   // const paidOuttoClient = ClientJanuary + ClientFebruary + ClientApril;
//   // const paidOutMonth = TotalJanuary + TotalFebraury + TotalApril

//   const {
//     transactions,
//     analytics,
//     pagination,
//     isLoadingTransactions,
//     isErrorTransactions,
//     refetchTransactions,
//     fetchTransactions
//   } = useTransactions()

//   // Calculate success rate from analytics
//   const successRate = analytics?.totalOrders > 0
//     ? ((analytics.totalOrders / (analytics.totalOrders + (pagination?.totalItems - analytics.totalOrders || 0))) * 100).toFixed(1)
//     : "0.0"

//   // Calculate your take (80% of total profit) and developer take (20% of total profit)
//   const yourTake = analytics?.totalJBProfit ? (analytics.totalJBProfit - analytics.developersProfit) : 0
//   const developerTake = analytics?.developersProfit || 0

//   const stats = [
//     {
//       title: "Total Revenue",
//       value: analytics?.totalRevenue || 0,
//       subtitle: (
//         <span className="flex gap-2 text-sm">
//           <span className="text-green-600">
//             {formatCurrency(analytics?.totalRevenueBeforePaystackAddition || 0)}
//           </span>
//           <span className="text-gray-400">|</span>
//           <span className="text-red-600">
//             {formatCurrency(analytics?.totalPaystackFees || 0)}
//           </span>
//         </span>
//       ),
//       icon: CreditCard,
//       isCurrency: true,
//     },
//     {
//       title: "Active Orders",
//       value: analytics?.activeOrders || 0,
//       icon: ShoppingCart,
//       isCurrency: false,
//       subtitle: "Holder"
//     },
//     {
//       title: "Total Orders",
//       value: analytics?.totalOrders || 0,
//       icon: Users,
//       isCurrency: false,
//       subtitle: "Holder"

//     },
//     {
//       title: "Total Profit",
//       value: analytics?.totalJBProfit,
//       subtitle: `JBP: ${formatCurrency(yourTake)} | DevP: ${formatCurrency(developerTake)}`,
//       icon: Activity,
//       isCurrency: true,
//     },
//   ]

//   // Get latest 5 successful transactions
//   const latestTransactions = transactions?.filter(txn => txn.status === 'success').slice(0, 5) || []

//   // Network colors
//   const getNetworkColor = (network) => {
//     const colors = {
//       MTN: "bg-yellow-100 text-yellow-600",
//       AT: "bg-red-100 text-red-600",
//       VODAFONE: "bg-red-100 text-red-600",
//       TELECEL: "bg-blue-100 text-blue-600",
//     }
//     return colors[network?.toUpperCase()] || "bg-gray-100 text-gray-600"
//   }

//   // Status colors
//   const getStatusColor = (status) => {
//     const colors = {
//       success: "text-green-600",
//       pending: "text-yellow-600",
//       failed: "text-red-600",
//     }
//     return colors[status?.toLowerCase()] || "text-gray-600"
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Dashboard Overview"
//         actions={
//           <Button
//             variant="outline"
//             size="sm"
//             className="hidden md:flex bg-transparent"
//             onClick={() => refetchTransactions()}
//             disabled={isLoadingTransactions}
//           >
//             <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingTransactions ? 'animate-spin' : ''}`} />
//             Refresh Data
//           </Button>
//         }
//       />

//       <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <StatCard
//             key={stat.title}
//             title={stat.title}
//             value={stat.value}
//             subtitle={stat.subtitle}
//             icon={stat.icon}
//             isCurrency={stat.isCurrency}
//             isLoading={isLoadingTransactions}

//           />
//         ))}
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <DataPanel
//           className="col-span-4"
//           title="Recent Orders"
//           description="Latest 5 transactions from customers"
//         >
//           {isLoadingTransactions ? (
//             <div className="space-y-4">
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 animate-pulse">
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 rounded-full bg-gray-200" />
//                     <div>
//                       <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
//                       <div className="h-3 w-32 bg-gray-200 rounded" />
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="h-4 w-20 bg-gray-200 rounded mb-2 ml-auto" />
//                     <div className="h-3 w-16 bg-gray-200 rounded ml-auto" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : isErrorTransactions ? (
//             <div className="flex flex-col items-center justify-center py-8 text-center">
//               <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
//               <p className="text-sm text-slate-500 mb-4">Failed to load transactions</p>
//               <Button onClick={() => refetchTransactions()} variant="outline" size="sm">
//                 Try Again
//               </Button>
//             </div>
//           ) : latestTransactions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-8 text-center">
//               <ShoppingCart className="h-12 w-12 text-slate-300 mb-4" />
//               <p className="text-sm text-slate-500">No transactions yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {latestTransactions.map((transaction) => (
//                 <div
//                   key={transaction.transactionId}
//                   className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${getNetworkColor(transaction.network)}`}>
//                       {transaction.network}
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium">{transaction.customer}</p>
//                       <p className="text-xs text-slate-500">{transaction.phoneNumber}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
//                     <p className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
//                       {transaction.status}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </DataPanel>

//         <div className="col-span-3 space-y-4">
//           <div className="space-y-4">
//             <QuickActions />
//             <LowStockAlert lowStock={stats?.low_stock || 1} />
//           </div>

//           <DataPanel
//             title="System Health"
//             description="API & Service Status"
//           >
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Storage API</span>
//                 <span className="flex h-2 w-2 rounded-full bg-green-500" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Delivery API</span>
//                 <span className="flex h-2 w-2 rounded-full bg-green-500" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium"> API</span>
//                 <span className="flex h-2 w-2 rounded-full bg-yellow-500" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">SMS Service</span>
//                 <span className="flex h-2 w-2 rounded-full bg-green-500" />
//               </div>
//             </div>
//           </DataPanel>
//         </div>
//       </div>
//     </div>
//   )
// }




"use client"

import { Users, ShoppingCart, CreditCard, Activity, RefreshCw, AlertTriangle, Icon, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTransactions } from "../contexts/TransactionContext"
import QuickActions from "@/components/QuickActions"
import LowStockAlert from "@/components/lowStockAlert"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { PageHeader, StatCard, DataPanel, ReferralLinkCard } from "@/components/dashboard"
import { useUser } from "../contexts/UserContext"
import { ItemList } from "@/components/dashboard/itemList"
import { ChartBar, ChartBarInteractive } from "@/components/dashboard/chart"
import Link from "next/link"
export default function AdminDashboard() {
  //JANURY STATS
  const January = 1904.37;
  const ClientJanuary = 5420.13
  const TotalJanuary = January + ClientJanuary;

  //FEBRUARY STATS
  const February = 2050.79
  const ClientFebruary = 5837.69
  const TotalFebraury = February + ClientFebruary


  //FEBRUARY STATS
  const April = 1546.66
  const ClientApril = 4402.06
  const TotalApril = April + ClientApril

  const paidOuttoDevelopers = January + February + April;
  const paidOuttoClient = ClientJanuary + ClientFebruary + ClientApril;
  const paidOutMonth = TotalJanuary + TotalFebraury + TotalApril

  const { reseller } = useUser()

  const {
    transactions,
    analytics,
    pagination,
    isLoadingTransactions,
    isErrorTransactions,
    refetchTransactions,
    fetchTransactions
  } = useTransactions()

  // Calculate success rate from analytics
  const successRate = analytics?.totalOrders > 0
    ? ((analytics.totalOrders / (analytics.totalOrders + (pagination?.totalItems - analytics.totalOrders || 0))) * 100).toFixed(1)
    : "0.0"

  // Calculate your take (80% of total profit) and developer take (20% of total profit)
  const yourTake = analytics?.totalPlatformProfit ? (analytics.totalPlatformProfit - analytics.developersProfit) : 0
  const developerTake = analytics?.developersProfit || 0

  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue || 0,
      subtitle: (
        <span className="flex gap-1 text-[12px] md:text-sm">
          <span className="text-green-600">
            {formatCurrency(analytics?.totalRevenueBeforePaystack || 0)}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-red-600 text-[12px] md:text-sm">
            {formatCurrency(analytics?.totalPaystackFees || 0)}
          </span>
        </span>
      ),
      icon: CreditCard,
      isCurrency: true,
    },
    {
      title: "Active Orders",
      value: analytics?.pendingOrders || 0,
      icon: ShoppingCart,
      isCurrency: false,
      subtitle: "Boomm"

    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: Users,
      isCurrency: false,
      subtitle: "Boomm"
    },
    {
      title: "Total Profit",
      value: analytics?.totalPlatformProfit,
      subtitle: `JBP: ${formatCurrency(yourTake)}`,
      icon: Activity,
      isCurrency: true,
    },
  ]

  // Get latest 5 successful transactions
  const latestTransactions = transactions?.filter(txn => txn.status === 'success').slice(0, 5) || []

  // Network colors
  const getNetworkColor = (network) => {
    const colors = {
      MTN: "bg-yellow-100 text-yellow-600",
      AT: "bg-red-100 text-red-600",
      VODAFONE: "bg-red-100 text-red-600",
      TELECEL: "bg-blue-100 text-blue-600",
    }
    return colors[network?.toUpperCase()] || "bg-gray-100 text-gray-600"
  }

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      success: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    }
    return colors[status?.toLowerCase()] || "text-gray-600"
  }

  return (
    <div className="space-y-8 md:space-y-6 ">
      <PageHeader
        title={` ${reseller?.name?.split(' ')[0] || reseller?.name}!`}
        description="Welcome Back"
        actions={
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            {/* <ReferralLinkCard
              link={referralData?.referralURL}
              isLoading={isLoadingReferral}
              onCopy={() => toast.success("Link copied!")}
            /> */}

            <Link href="/admin/subscriptions/new">
              <Button className="bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </Link>
          </div>
        }
      />

      <div className="flex flex-col lg:hidden w-full p-4 rounded-4xl space-y-5 text-white relative bg-[#262626]"
        style={{
          backgroundImage: `
      linear-gradient(135deg, rgba(5, 86, 62, 0.7) 0%, rgba(5, 86, 62, 0.6) 100%),
      url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&auto=format&fit=crop')
    `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* <div className="border-2 w-22 p-2 rounded-3xl">Popular</div> */}
        <div className="flex items-center gap-2 w-fit">
          <div className="bg-[white] text-[#03563E] px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
            ✨ Stream Sub
          </div>
        </div>
        <div className=" w-full space-y-2">
          <div className="text-2xl font-semibold">Track All Sales Here</div>
          <div className="text-sm font-light">Need help with anything, setup or <br></br>configurations</div>
        </div>

        <div className=" border-2 text-center p-3 w-36 text-md rounded-4xl font-medium hover:bg-white hover:text-[#03563E] transition ">Contact</div>
      </div>


      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            isCurrency={stat.isCurrency}
            isLoading={isLoadingTransactions}
          />
        ))}
      </div>

      <div className="grid  gap-4 lg:grid-cols-3">
        {/* Chart Component (Spans 2 columns) */}
        <div className="lg:col-span-2">
          <ChartBarInteractive />
        </div>

        {/* Other Item (Spans 1 column) */}
        <div className="lg:col-span-1 ">
          <div className="flex w-full flex-col md:flex-row lg:flex-col gap-4 ">
            <div className=" w-full flex flex-col gap-4 ">
              <QuickActions />
            </div>
            <div className="w-full">
              <ItemList transactions={latestTransactions} />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

