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
    const isPositive = ["active", "success", "completed", "paid"].includes(normalized)
    return (
        <Badge className={isPositive ? "bg-green-700 text-white" : "bg-yellow-600 text-white"}>
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
            { label: "Amount", render: (row) => `₵${formatCurrency(row.amount || 0)}` },
            { label: "Your Cut", render: (row) => <span className="text-[#262626] font-semibold">₵{formatCurrency(row.costPrice || 0)}</span> },
            { label: "Ordered", render: (row) => formatDate(row.createdAt) },
            { label: "Status", render: (row) => <StatusBadge status={row.deliveryStatus} /> },
        ],
        getHref: null,       // not a navigation — action is the fulfill dialog
        showActions: true,   // we'll use actions slot for the Fulfill button
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

export function List({
    items = [],
    type = "reseller",
    isLoading = false,
    isError = false,
    error = null,
    role = "",
    onFulfill = null,
}) {
    const router = useRouter()
    const config = LIST_CONFIGS[type] ?? LIST_CONFIGS.reseller

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <p className="text-slate-500">Loading {type}s...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <X className="h-8 w-8 text-red-500" />
                <p className="text-red-600 font-medium">Failed to load {type}s</p>
                <p className="text-sm text-slate-500">{error?.message}</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500">No {type}s found.</p>
            </div>
        )
    }

    const handleClick = (row) => {
        if (!config.getHref) return
        router.push(config.getHref(row, role))
    }


    console.log("items", items)

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
                                {type === "order" && onFulfill && row.deliveryStatus === "pending" ? (
                                    <Button
                                        size="sm"
                                        className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
                                        onClick={(e) => { e.stopPropagation(); onFulfill(row); }}
                                    >
                                        <i className="fa-solid fa-paper-plane mr-1" /> Fulfill
                                    </Button>
                                ) : type === "order" ? null : (
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
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#05563E]">
                                        {config.icon(row)}
                                    </div>
                                </ItemMedia>
                                <ItemContent className="w-full flex flex-col gap-1">
                                    <ItemTitle className="flex items-center gap-2 text-[14px] font-semibold">
                                        <span>{config.title(row)}</span>
                                        <StatusBadge status={row.status} />
                                    </ItemTitle>
                                    {config.subtitle(row) && (
                                        <ItemDescription className="text-xs text-gray-500">{config.subtitle(row)}</ItemDescription>
                                    )}
                                </ItemContent>
                            </div>
                            {config.showActions && (
                                <ItemActions>
                                    <DropdownMenuAction />
                                </ItemActions>
                            )}
                        </div>

                        <div className="w-full flex items-center justify-between gap-2 px-2 pb-2">
                            {config.columns
                                .filter((col) => col.label !== "Status")
                                .slice(0, 2)
                                .map((col) => (
                                    <ItemContent key={col.label}>
                                        <ItemTitle className="text-sm font-semibold">{col.render(row)}</ItemTitle>
                                        <ItemDescription className="text-xs text-gray-500">{col.label}</ItemDescription>
                                    </ItemContent>
                                ))}
                        </div>

                        <div className="w-full px-2">
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