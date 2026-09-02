// "use client"
// import { useRouter } from "next/navigation"
// import { Loader2, X, User, MoreVerticalIcon, Eye, Pause, Trash, Check, Wallet, ShoppingBag, Receipt } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//     Item,
//     ItemActions,
//     ItemContent,
//     ItemDescription,
//     ItemMedia,
//     ItemTitle,
// } from "@/components/ui/item"
// import { formatCurrency } from "@/lib/utils"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuShortcut,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export function DropdownMenuAction() {
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button><MoreVerticalIcon size={12} /></Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-white border-0">
//                 <DropdownMenuGroup>
//                     <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
//                         Approve
//                         <DropdownMenuShortcut><Check /></DropdownMenuShortcut>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
//                         View
//                         <DropdownMenuShortcut><Eye /></DropdownMenuShortcut>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
//                         Suspend
//                         <DropdownMenuShortcut><Pause /></DropdownMenuShortcut>
//                     </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
//                     Delete
//                     <DropdownMenuShortcut><Trash className="text-red-500" /></DropdownMenuShortcut>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     )
// }

// // ── shared helpers ──────────────────────────────────────────

// const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//     })
// }

// function StatusBadge({ status }) {
//     const normalized = (status || "").toLowerCase()
//     const isPositive = ["active", "success", "completed", "paid"].includes(normalized)
//     return (
//         <Badge className={isPositive ? "bg-green-700 text-white" : "bg-yellow-600 text-white"}>
//             {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
//         </Badge>
//     )
// }

// // ── per-type config ─────────────────────────────────────────
// // Add a new key here to support another list type. Both the
// // desktop grid and mobile card pick it up automatically.

// const LIST_CONFIGS = {
//     reseller: {
//         gridCols: "md:grid-cols-6",
//         icon: (row) => (row.isAccountVerified ? <User className="h-5 w-5" /> : <span>!</span>),
//         title: (row) => row.name || "Unnamed",
//         subtitle: (row) => row.phoneNumber,
//         columns: [
//             { label: "Joined Date", render: (row) => formatDate(row.createdAt) },
//             { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
//             {
//                 label: "Profit Earned",
//                 render: (row) =>
//                     row.totalCommissionEarned > 0 ? (
//                         <span className="text-green-600">+₵{formatCurrency(row.totalCommissionEarned || 0)}</span>
//                     ) : (
//                         <span>₵{formatCurrency(row.totalCommissionEarned || 0)}</span>
//                     ),
//             },
//             { label: "Profit Paid Out", render: (row) => `₵${formatCurrency(row.totalCommissionPaidOut || 0)}` },
//         ],
//         getHref: (row, role) => `/${role}/resellers/${row._id}`,
//         showActions: true,
//     },

//     transaction: {
//         gridCols: "md:grid-cols-5",
//         icon: () => <Receipt className="h-5 w-5" />,
//         title: (row) => row.description || row.saleId || "Transaction",
//         subtitle: (row) => row.saleId,
//         columns: [
//             { label: "Date", render: (row) => formatDate(row.createdAt) },
//             { label: "Service", render: (row) => row.service || "N/A" },
//             { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
//             { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
//         ],
//         getHref: (row, role) => `/${role}/transactions/${row._id}`,
//         showActions: false,
//     },

//     order: {
//         gridCols: "md:grid-cols-6",
//         icon: () => <i className="fa-solid fa-box h-5 w-5" />,
//         title: (row) => row.subscriptionName || "Order",
//         subtitle: (row) => row.customerPhone || "N/A",
//         columns: [
//             { label: "Reference", render: (row) => <span className="font-mono text-xs">{row.reference?.slice(-10)}</span> },
//             { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
//             { label: "Your Cut", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.costPrice || 0)}</span> },
//             { label: "Ordered", render: (row) => formatDate(row.createdAt) },
//             { label: "Status", render: (row) => <StatusBadge status={row.deliveryStatus} /> },
//         ],
//         getHref: null,       // not a navigation — action is the fulfill dialog
//         showActions: true,   // we'll use actions slot for the Fulfill button
//     },


//     payout: {
//         gridCols: "md:grid-cols-5",
//         icon: () => <Wallet className="h-5 w-5" />,
//         title: () => "Payout Request",
//         subtitle: (row) => row.network,
//         columns: [
//             { label: "Date", render: (row) => formatDate(row.createdAt) },
//             { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
//             { label: "Net Amount", render: (row) => `₵${formatCurrency(row.netAmount ?? row.amount ?? 0)}` },
//             { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
//         ],
//         getHref: (row, role) => `/${role}/payouts/${row._id}`,
//         showActions: false,
//     },

//     product: {
//         gridCols: "md:grid-cols-4",
//         icon: () => <ShoppingBag className="h-5 w-5" />,
//         title: (row) => row.name || "Subscription",
//         subtitle: (row) => (row.rank ? `Rank #${row.rank}` : null),
//         columns: [
//             { label: "Sales", render: (row) => row.unitsSold ?? 0 },
//             { label: "Revenue", render: (row) => `₵${formatCurrency(row.revenue || 0)}` },
//         ],
//         getHref: null,
//         showActions: false,
//     },
// }

// // ── List ─────────────────────────────────────────────────────

// export function List({
//     items = [],
//     type = "reseller",
//     isLoading = false,
//     isError = false,
//     error = null,
//     role = "",
//     onFulfill = null,
// }) {
//     const router = useRouter()
//     const config = LIST_CONFIGS[type] ?? LIST_CONFIGS.reseller

//     if (isLoading) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12 gap-2">
//                 <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//                 <p className="text-slate-500">Loading {type}s...</p>
//             </div>
//         )
//     }

//     if (isError) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12 gap-2">
//                 <X className="h-8 w-8 text-red-500" />
//                 <p className="text-red-600 font-medium">Failed to load {type}s</p>
//                 <p className="text-sm text-slate-500">{error?.message}</p>
//             </div>
//         )
//     }

//     if (items.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-slate-500">No {type}s found.</p>
//             </div>
//         )
//     }

//     const handleClick = (row) => {
//         if (!config.getHref) return
//         router.push(config.getHref(row, role))
//     }


//     console.log("items", items)

//     return (
//         <div>
//             {/* ── Desktop ── */}
//             <div className="space-y-3 hidden md:block">
//                 {items.map((row) => (
//                     <Item
//                         key={row._id}
//                         className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid grid-cols-1 ${config.gridCols} ${config.getHref ? "cursor-pointer" : ""}`}
//                         onClick={() => handleClick(row)}
//                     >
//                         <div className="w-full flex items-center p-2 gap-2">
//                             <ItemMedia>
//                                 <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
//                                     {config.icon(row)}
//                                 </div>
//                             </ItemMedia>
//                             <ItemContent>
//                                 <ItemTitle className="text-sm font-semibold">{config.title(row)}</ItemTitle>
//                                 {config.subtitle(row) && (
//                                     <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
//                                 )}
//                             </ItemContent>
//                         </div>

//                         {config.columns.map((col) => (
//                             <div key={col.label} className="w-full">
//                                 <ItemContent>
//                                     <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
//                                     <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
//                                 </ItemContent>
//                             </div>
//                         ))}

//                         {config.showActions && (
//                             <ItemActions>
//                                 {type === "order" && onFulfill && row.deliveryStatus === "pending" ? (
//                                     <Button
//                                         size="sm"
//                                         className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
//                                         onClick={(e) => { e.stopPropagation(); onFulfill(row); }}
//                                     >
//                                         <i className="fa-solid fa-paper-plane mr-1" /> Fulfill
//                                     </Button>
//                                 ) : type === "order" ? null : (
//                                     <DropdownMenuAction />
//                                 )}
//                             </ItemActions>
//                         )}
//                     </Item>
//                 ))}
//             </div>

//             {/* ── Mobile ── */}
//             <div className="space-y-3 block md:hidden">
//                 {items.map((row) => (
//                     <Item
//                         key={row._id}
//                         className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid ${config.getHref ? "cursor-pointer" : ""}`}
//                         onClick={() => handleClick(row)}
//                     >
//                         <div className="w-full flex items-start justify-between">
//                             <div className="w-full flex items-center p-2 gap-2">
//                                 <ItemMedia>
//                                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#05563E]">
//                                         {config.icon(row)}
//                                     </div>
//                                 </ItemMedia>
//                                 <ItemContent className="w-full flex flex-col gap-1">
//                                     <ItemTitle className="flex items-center gap-2 text-[14px] font-semibold">
//                                         <span>{config.title(row)}</span>
//                                         <StatusBadge status={row.status} />
//                                     </ItemTitle>
//                                     {config.subtitle(row) && (
//                                         <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
//                                     )}
//                                 </ItemContent>
//                             </div>
//                             {config.showActions && (
//                                 <ItemActions>
//                                     <DropdownMenuAction />
//                                 </ItemActions>
//                             )}
//                         </div>

//                         <div className="w-full flex items-center justify-between gap-2 px-2 pb-2">
//                             {config.columns
//                                 .filter((col) => col.label !== "Status")
//                                 .slice(0, 2)
//                                 .map((col) => (
//                                     <ItemContent key={col.label}>
//                                         <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
//                                         <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
//                                     </ItemContent>
//                                 ))}
//                         </div>

//                         <div className="w-full px-2">
//                             <ItemDescription className="text-xs text-gray-500">
//                                 Created {formatDate(row.createdAt)}
//                             </ItemDescription>
//                         </div>
//                     </Item>
//                 ))}
//             </div>
//         </div>
//     )
// }









"use client"
import { useRouter } from "next/navigation"
import { Loader2, X, User, MoreVerticalIcon, Eye, Pause, Trash, Check, Wallet, ShoppingBag, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { formatCurrency } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuAction() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button><MoreVerticalIcon size={12} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-0">
                <DropdownMenuGroup>
                    <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
                        Approve
                        <DropdownMenuShortcut><Check /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
                        View
                        <DropdownMenuShortcut><Eye /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
                        Suspend
                        <DropdownMenuShortcut><Pause /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
                    Delete
                    <DropdownMenuShortcut><Trash className="text-red-500" /></DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// ── shared helpers ──────────────────────────────────────────

const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

function StatusBadge({ status }) {
    const normalized = (status || "").toLowerCase()
    const isPositive = ["active", "success", "completed", "paid", "delivered"].includes(normalized)
    const isNegative = ["failed", "cancelled", "rejected"].includes(normalized)
    return (
        <Badge
            className={
                isPositive
                    ? "bg-green-700 text-white"
                    : isNegative
                        ? "bg-red-600 text-white"
                        : "bg-yellow-600 text-white"
            }
        >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
        </Badge>
    )
}

// ── per-type config ─────────────────────────────────────────
// Add a new key here to support another list type. Both the
// desktop grid and mobile card pick it up automatically.

const LIST_CONFIGS = {
    reseller: {
        gridCols: "md:grid-cols-6",
        icon: (row) => (row.isAccountVerified ? <User className="h-5 w-5" /> : <span>!</span>),
        title: (row) => row.name || "Unnamed",
        subtitle: (row) => row.phoneNumber,
        columns: [
            { label: "Joined Date", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
                label: "Profit Earned",
                render: (row) =>
                    row.totalCommissionEarned > 0 ? (
                        <span className="text-green-600">+₵{formatCurrency(row.totalCommissionEarned || 0)}</span>
                    ) : (
                        <span>₵{formatCurrency(row.totalCommissionEarned || 0)}</span>
                    ),
            },
            { label: "Profit Paid Out", render: (row) => `₵${formatCurrency(row.totalCommissionPaidOut || 0)}` },
        ],
        getHref: (row, role) => `/${role}/resellers/${row._id}`,
        showActions: true,
    },

    transaction: {
        gridCols: "md:grid-cols-5",
        icon: () => <Receipt className="h-5 w-5" />,
        title: (row) => row.description || row.saleId || "Transaction",
        subtitle: (row) => row.saleId,
        columns: [
            { label: "Date", render: (row) => formatDate(row.createdAt) },
            { label: "Service", render: (row) => row.service || "N/A" },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
        ],
        getHref: (row, role) => `/${role}/transactions/${row._id}`,
        showActions: false,
    },

    order: {
        gridCols: "md:grid-cols-6",
        icon: () => <i className="fa-solid fa-box h-5 w-5" />,
        title: (row) => row.subscriptionName || "Order",
        subtitle: (row) => row.customerPhone || "N/A",
        columns: [
            { label: "Reference", render: (row) => <span className="font-mono text-xs">{row.reference?.slice(-10)}</span> },
            { label: "Your Cut", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.yourCut || 0)}</span> },
            { label: "Ordered", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.deliveryStatus} /> },
        ],
        getHref: null,       // not a navigation — action is claim/fulfill
        showActions: true,
    },

    payout: {
        gridCols: "md:grid-cols-5",
        icon: () => <Wallet className="h-5 w-5" />,
        title: () => "Payout Request",
        subtitle: (row) => row.network,
        columns: [
            { label: "Date", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { label: "Net Amount", render: (row) => `₵${formatCurrency(row.netAmount ?? row.amount ?? 0)}` },
            { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
        ],
        getHref: (row, role) => `/${role}/payouts/${row._id}`,
        showActions: false,
    },

    // Fulfiller's own payout records (Level 2 — their money)
    fulfillerPayout: {
        gridCols: "md:grid-cols-6",
        icon: () => <Wallet className="h-5 w-5" />,
        title: (row) => row.subscriptionName || row.reference?.slice(-10) || "Payout",
        subtitle: (row) => row.reference,
        columns: [
            { label: "Date", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { label: "Earned", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.amount || 0)}</span> },
            { label: "Fee", render: (row) => <span className="text-slate-500">−₵{formatCurrency(row.transferFee || 0)}</span> },
            { label: "Received", render: (row) => <span className="text-green-600 font-semibold">₵{formatCurrency(row.netAmount ?? row.amount ?? 0)}</span> },
            { label: "Paid", render: (row) => (row.paidAt ? formatDate(row.paidAt) : "—") },
        ],

        getHref: null,
        showActions: false,
    },

    supplierPayout: {
        gridCols: "md:grid-cols-6",
        icon: () => <i className="fa-solid fa-hand-holding-dollar h-5 w-5" />,
        title: (row) => row.managerName || "Manager",
        subtitle: (row) => row.managerPhone || "No number",
        columns: [
            { label: "Reference", render: (row) => <span className="font-mono text-xs">{row.reference?.slice(-10)}</span> },
            { label: "Subscription", render: (row) => row.subscriptionName || "—" },
            { label: "Amount", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.amount || 0)}</span> },
            { label: "Date", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ],
        getHref: null,
        showActions: true,
    },

    resellerPayout: {
        gridCols: "md:grid-cols-6",
        icon: () => <i className="fa-solid fa-money-bill-transfer h-5 w-5" />,
        title: (row) => row.reseller?.name || "Unknown",
        subtitle: (row) => row.phoneNumber || "No number",
        columns: [
            { label: "Payout ID", render: (row) => <span className="font-mono text-xs">{row._id?.slice(-8)}</span> },
            { label: "Network", render: (row) => row.network || "N/A" },
            { label: "Net Amount", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.netAmount || 0)}</span> },
            { label: "Date", render: (row) => formatDate(row.requestedAt || row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        ],
        getHref: null,
        showActions: true,
    },

    product: {
        gridCols: "md:grid-cols-4",
        icon: () => <ShoppingBag className="h-5 w-5" />,
        title: (row) => row.name || "Subscription",
        subtitle: (row) => (row.rank ? `Rank #${row.rank}` : null),
        columns: [
            { label: "Sales", render: (row) => row.unitsSold ?? 0 },
            { label: "Revenue", render: (row) => `₵${formatCurrency(row.revenue || 0)}` },
        ],
        getHref: null,
        showActions: false,
    },
}

// ── List ─────────────────────────────────────────────────────

// export function List({
//     items = [],
//     type = "reseller",
//     isLoading = false,
//     isError = false,
//     error = null,
//     role = "",
//     onFulfill = null,
//     onClaim = null,
//     claiming = false,
//     onPay = null,        // ← add
//     paying = false,
// }) {
//     const router = useRouter()
//     const config = LIST_CONFIGS[type] ?? LIST_CONFIGS.reseller

//     if (isLoading) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12 gap-2">
//                 <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
//                 <p className="text-slate-500">Loading...</p>
//             </div>
//         )
//     }

//     if (isError) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12 gap-2">
//                 <X className="h-8 w-8 text-red-500" />
//                 <p className="text-red-600 font-medium">Failed to load</p>
//                 <p className="text-sm text-slate-500">{error?.message}</p>
//             </div>
//         )
//     }

//     if (items.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center py-12">
//                 <p className="text-slate-500">Nothing here yet.</p>
//             </div>
//         )
//     }

//     const handleClick = (row) => {
//         if (!config.getHref) return
//         router.push(config.getHref(row, role))
//     }

//     // renders the right action button for an order row (claim/fulfill)
//     const renderOrderAction = (row, fullWidth = false) => {
//         const base = `bg-[#262626] hover:bg-[#3a3a3a] text-white disabled:opacity-50 ${fullWidth ? "w-full" : ""}`
//         if (onClaim && row.deliveryStatus === "pending") {
//             return (
//                 <Button
//                     size="sm"
//                     disabled={claiming}
//                     className={base}
//                     onClick={(e) => { e.stopPropagation(); onClaim(row); }}
//                 >
//                     <i className="fa-solid fa-hand mr-1" />
//                     {claiming ? "Claiming..." : "Claim"}
//                 </Button>
//             )
//         }
//         if (onFulfill && row.deliveryStatus === "processing") {
//             return (
//                 <Button
//                     size="sm"
//                     className={base}
//                     onClick={(e) => { e.stopPropagation(); onFulfill(row); }}
//                 >
//                     <i className="fa-solid fa-paper-plane mr-1" /> Fulfill
//                 </Button>
//             )
//         }
//         return null
//     }

//     return (
//         <div>
//             {/* ── Desktop ── */}
//             <div className="space-y-3 hidden md:block">
//                 {items.map((row) => (
//                     <Item
//                         key={row._id}
//                         className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid grid-cols-1 ${config.gridCols} ${config.getHref ? "cursor-pointer" : ""}`}
//                         onClick={() => handleClick(row)}
//                     >
//                         <div className="w-full flex items-center p-2 gap-2">
//                             <ItemMedia>
//                                 <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
//                                     {config.icon(row)}
//                                 </div>
//                             </ItemMedia>
//                             <ItemContent>
//                                 <ItemTitle className="text-sm font-semibold">{config.title(row)}</ItemTitle>
//                                 {config.subtitle(row) && (
//                                     <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
//                                 )}
//                             </ItemContent>
//                         </div>

//                         {config.columns.map((col) => (
//                             <div key={col.label} className="w-full">
//                                 <ItemContent>
//                                     <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
//                                     <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
//                                 </ItemContent>
//                             </div>
//                         ))}

//                         {config.showActions && (
//                             <ItemActions>
//                                 {type === "order" ? (
//                                     renderOrderAction(row)
//                                 ) : (
//                                     <DropdownMenuAction />
//                                 )}
//                             </ItemActions>
//                         )}
//                     </Item>
//                 ))}
//             </div>

//             {/* ── Mobile ── */}
//             <div className="space-y-3 block md:hidden">
//                 {items.map((row) => (
//                     <Item
//                         key={row._id}
//                         className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid ${config.getHref ? "cursor-pointer" : ""}`}
//                         onClick={() => handleClick(row)}
//                     >
//                         <div className="w-full flex items-start justify-between">
//                             <div className="w-full flex items-center p-2 gap-2">
//                                 <ItemMedia>
//                                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
//                                         {config.icon(row)}
//                                     </div>
//                                 </ItemMedia>
//                                 <ItemContent className="w-full flex flex-col gap-1">
//                                     <ItemTitle className="flex items-center gap-2 text-[14px] font-semibold">
//                                         <span>{config.title(row)}</span>
//                                         <StatusBadge status={type === "order" ? row.deliveryStatus : row.status} />
//                                     </ItemTitle>
//                                     {config.subtitle(row) && (
//                                         <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
//                                     )}
//                                 </ItemContent>
//                             </div>
//                             {config.showActions && type !== "order" && (
//                                 <ItemActions>
//                                     <DropdownMenuAction />
//                                 </ItemActions>
//                             )}
//                         </div>

//                         <div className="w-full flex items-center justify-between gap-2 px-2 pb-2">
//                             {config.columns
//                                 .filter((col) => col.label !== "Status")
//                                 .slice(0, 2)
//                                 .map((col) => (
//                                     <ItemContent key={col.label}>
//                                         <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
//                                         <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
//                                     </ItemContent>
//                                 ))}
//                         </div>

//                         {/* Mobile action button for orders */}
//                         {type === "order" && (
//                             <div className="w-full px-2 pb-2">
//                                 {renderOrderAction(row, true)}
//                             </div>
//                         )}

//                         <div className="w-full px-2 pb-2">
//                             <ItemDescription className="text-xs text-gray-500">
//                                 Created {formatDate(row.createdAt)}
//                             </ItemDescription>
//                         </div>
//                     </Item>
//                 ))}
//             </div>
//         </div>
//     )
// }

export function List({
    items = [],
    type = "reseller",
    isLoading = false,
    isError = false,
    error = null,
    role = "",
    onFulfill = null,
    onClaim = null,
    claiming = false,
    onPay = null,
    paying = false,
    onView = null,
    onEdit = null,        // ← add with default null (optional)
    onEditing = false,
    onConfirm = null,
    onReject = null,
}) {
    const router = useRouter()
    const config = LIST_CONFIGS[type] ?? LIST_CONFIGS.reseller

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <p className="text-slate-500">Loading...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <X className="h-8 w-8 text-red-500" />
                <p className="text-red-600 font-medium">Failed to load</p>
                <p className="text-sm text-slate-500">{error?.message}</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500">Nothing here yet.</p>
            </div>
        )
    }

    const handleClick = (row) => {
        if (!config.getHref) return
        router.push(config.getHref(row, role))
    }

    const renderOrderAction = (row, fullWidth = false) => {
        const base = `${fullWidth ? "w-full" : ""}`

        if (row.deliveryStatus === "pending" && onClaim) {
            return (
                <Button size="sm" disabled={claiming} className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
                    onClick={(e) => { e.stopPropagation(); onClaim(row); }}>
                    {claiming ? "..." : "Claim"}
                </Button>
            )
        }
        if (row.deliveryStatus === "processing" && onFulfill) {
            return (
                <Button size="sm" className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
                    onClick={(e) => { e.stopPropagation(); onFulfill(row); }}>
                    Fulfill
                </Button>
            )
        }
        if (row.deliveryStatus === "delivered" && onEdit) {
            return (
                <Button size="sm" variant="outline" className="border-[#262626] text-[#262626] hover:bg-slate-100"
                    onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                    <i className="fa-solid fa-pen mr-1" /> Edit
                </Button>
            )
        }
        return null
    }

    // SUPPLIER PAYOUT row → pay (pending) / processing / paid
    const renderSupplierAction = (row, fullWidth = false) => {
        const base = `bg-[#262626] hover:bg-[#3a3a3a] text-white disabled:opacity-50 ${fullWidth ? "w-full" : ""}`
        if ((row.status === "pending" || row.status === "failed") && onPay) {
            return (
                <Button
                    size="sm"
                    disabled={paying}
                    className={base}
                    onClick={(e) => { e.stopPropagation(); onPay(row); }}
                >
                    <i className="fa-solid fa-hand-holding-dollar mr-1" />
                    {paying ? "..." : (row.status === "failed" ? "Retry" : "Pay")}
                </Button>
            )
        }
        // if (row.status === "processing") {
        //     return <span className="text-xs text-blue-600 font-medium">Processing...</span>
        // }
        // if (row.status === "paid") {
        //     return <span className="text-xs text-green-600 font-medium">Paid</span>
        // }
        // if (row.status === "failed") {
        //     return null  // handled above (Retry button), but safe fallback
        // }
        return null
    }

    // RESELLER PAYOUT row → view + (confirm/reject on pending)
    const renderResellerPayoutAction = (row) => {
        return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {onView && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(row)} title="View">
                        <i className="fa-solid fa-eye" />
                    </Button>
                )}
                {row.status === "pending" && onConfirm && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => onConfirm(row)} title="Confirm">
                        <i className="fa-solid fa-circle-check" />
                    </Button>
                )}
                {row.status === "pending" && onReject && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => onReject(row)} title="Reject">
                        <i className="fa-solid fa-circle-xmark" />
                    </Button>
                )}
            </div>
        )
    }

    // dispatch by type
    const renderAction = (row, fullWidth = false) => {
        if (type === "order") return renderOrderAction(row, fullWidth)
        if (type === "supplierPayout") return renderSupplierAction(row, fullWidth)
        if (type === "resellerPayout") return renderResellerPayoutAction(row)
        return null
    }

    const usesCustomAction =
        type === "order" || type === "supplierPayout" || type === "resellerPayout"

    return (
        <div>
            {/* ── Desktop ── */}
            <div className="space-y-3 hidden md:block">
                {items.map((row) => (
                    <Item
                        key={row._id}
                        className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid grid-cols-1 ${config.gridCols} ${config.getHref ? "cursor-pointer" : ""}`}
                        onClick={() => handleClick(row)}
                    >
                        <div className="w-full flex items-center p-2 gap-2">
                            <ItemMedia>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
                                    {config.icon(row)}
                                </div>
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">{config.title(row)}</ItemTitle>
                                {config.subtitle(row) && (
                                    <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
                                )}
                            </ItemContent>
                        </div>

                        {config.columns.map((col) => (
                            <div key={col.label} className="w-full">
                                <ItemContent>
                                    <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
                                    <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
                                </ItemContent>
                            </div>
                        ))}

                        {config.showActions && (
                            <ItemActions>
                                {usesCustomAction ? (
                                    renderAction(row)
                                ) : (
                                    <DropdownMenuAction />
                                )}
                            </ItemActions>
                        )}
                    </Item>
                ))}
            </div>

            {/* ── Mobile ── */}
            <div className="space-y-3 block md:hidden">
                {items.map((row) => (
                    <Item
                        key={row._id}
                        className={`border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all grid ${config.getHref ? "cursor-pointer" : ""}`}
                        onClick={() => handleClick(row)}
                    >
                        <div className="w-full flex items-start justify-between">
                            <div className="w-full flex items-center p-2 gap-2">
                                <ItemMedia>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
                                        {config.icon(row)}
                                    </div>
                                </ItemMedia>
                                <ItemContent className="w-full flex flex-col gap-1">
                                    <ItemTitle className="flex items-center gap-2 text-[14px] font-semibold">
                                        <span>{config.title(row)}</span>
                                        <StatusBadge status={type === "order" ? row.deliveryStatus : row.status} />
                                    </ItemTitle>
                                    {config.subtitle(row) && (
                                        <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
                                    )}
                                </ItemContent>
                            </div>
                            {config.showActions && !usesCustomAction && (
                                <ItemActions>
                                    <DropdownMenuAction />
                                </ItemActions>
                            )}
                        </div>

                        <div className="w-full flex items-center justify-between gap-2 px-2 pb-2">
                            {(type === "fulfillerPayout"
                                ? config.columns.filter((col) => ["Earned", "Received"].includes(col.label))
                                : type === "supplierPayout"
                                    ? config.columns.filter((col) => ["Subscription", "Amount"].includes(col.label))   // ← admin needs these
                                    : config.columns.filter((col) => col.label !== "Status").slice(0, 2)
                            ).map((col) => (
                                <ItemContent key={col.label}>
                                    <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
                                    <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
                                </ItemContent>
                            ))}
                        </div>

                        {/* Mobile custom action (order / supplierPayout / resellerPayout) */}
                        {usesCustomAction && (
                            <div className="w-full px-2 pb-2 flex justify-end">
                                {renderAction(row, true)}
                            </div>
                        )}

                        <div className="w-full px-2 pb-2">
                            <ItemDescription className="text-xs text-gray-500">
                                Created {formatDate(row.createdAt)}
                            </ItemDescription>
                        </div>
                    </Item>
                ))}
            </div>
        </div>
    )
}