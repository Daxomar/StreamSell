"use client"

import { useRouter } from "next/navigation"
import { Loader2, X, ShieldCheck, Check, User, MoreVerticalIcon, Eye, Pause, Trash, CheckCircle2, HourglassIcon } from "lucide-react"
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function DropdownMenuAction({ reseller, onApprove, approveMutation }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon size={12} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-0" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuGroup>
                    {!reseller?.isApproved && (
                        <DropdownMenuItem
                            className="bg-white hover:bg-gray-300/30 transition"
                            disabled={approveMutation?.isPending}
                            onClick={(e) => {
                                e.stopPropagation()
                                onApprove(reseller.userId)
                            }}
                        >
                            Approve
                            <DropdownMenuShortcut><Check /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="bg-white hover:bg-gray-300/30 transition">
                        View
                        <DropdownMenuShortcut><Eye /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function ResellersList({
    resellers = [],
    isLoading = false,
    isError = false,
    error = null,
    onApprove = () => { },
    approveMutation = { isPending: false },
    role = ""
}) {
    const router = useRouter()

    // Status colors
    const getStatusColor = (status) => {
        return status === "active"
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-yellow-500 hover:bg-yellow-600 text-white"
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <p className="text-slate-500">Loading resellers...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <X className="h-8 w-8 text-red-500" />
                <p className="text-red-600 font-medium">Failed to load resellers</p>
                <p className="text-sm text-slate-500">{error?.message}</p>
            </div>
        )
    }

    if (resellers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500">No resellers found.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="space-y-3 hidden md:block">
                {resellers.map((reseller) => (
                    <Item
                        key={reseller._id}
                        className="border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all cursor-pointer  grid grid-cols-6"
                        onClick={() => router.push(`/${role}/resellers/${reseller._id}`)}
                    >
                        {/* Verification Badge */}
                        <div className="w-full flex items-center p-2 gap-2">
                            <ItemMedia>
                                <div className=" w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white  bg-[#262626]"
                                >
                                    {reseller.isApproved ? (
                                        <User className="h-5 w-5" />
                                    ) : (
                                        <span>!</span>
                                    )}
                                </div>
                            </ItemMedia>

                            {/* Reseller Info */}
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">
                                    {reseller.name}
                                </ItemTitle>
                                <ItemDescription className="text-xs text-gray-500">
                                    {reseller.phoneNumber}
                                </ItemDescription>
                            </ItemContent>
                        </div>

                        <div className="w-full">
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">
                                    {formatDate(reseller.createdAt)}
                                </ItemTitle>
                                <ItemDescription className="text-xs text-gray-500">
                                    Joined Date
                                </ItemDescription>
                            </ItemContent>
                        </div>

                        <div className="w-full">
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">
                                    {reseller.status === "active" ? (
                                        <Badge className="bg-green-600 text-white">Active</Badge>
                                    ) : (
                                        <Badge className="bg-yellow-600 text-white">Pending</Badge>
                                    )}
                                </ItemTitle>
                                <ItemDescription className="text-xs text-gray-500 pl-2">
                                    Status
                                </ItemDescription>
                            </ItemContent>
                        </div>


                        <div className="w-full">
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">
                                    {reseller.totalCommissionEarned === 0 ? (
                                        <span className="">₵{formatCurrency(reseller.totalCommissionEarned)}</span>
                                    ) : (
                                        <span className="text-green-600">+₵{formatCurrency(reseller.totalCommissionEarned)}</span>
                                    )}
                                </ItemTitle>
                                <ItemDescription className="text-xs text-gray-500">
                                    Profit Earned
                                </ItemDescription>
                            </ItemContent>
                        </div>
                        <div className="">
                            <ItemContent>
                                <ItemTitle className="text-sm font-semibold">
                                    ₵{formatCurrency(reseller.totalCommissionPaidOut)}
                                </ItemTitle>
                                <ItemDescription className="text-xs text-gray-500">
                                    Profit Paidout
                                </ItemDescription>
                            </ItemContent>
                        </div>

                        {/* Balance & Actions */}
                        <ItemActions>
                            <DropdownMenuAction
                                reseller={reseller}
                                onApprove={onApprove}
                                approveMutation={approveMutation}
                            />
                        </ItemActions>
                    </Item>
                ))}
            </div>
            <div className="space-y-3 block md:hidden">
                {resellers.map((reseller) => (
                    <Item
                        key={reseller._id}
                        className="border-y-slate-200/30 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all cursor-pointer  grid"
                        onClick={() => router.push(`/${role}/resellers/${reseller._id}`)}
                    >
                        <div className="w-full flex items-start justify-between ">
                            <div className="w-full flex items-center p-2 gap-2 ">
                                <ItemMedia>
                                    <div className=" w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white  bg-[#262626]"
                                    >
                                        {reseller.isApproved ? (
                                            <User className="h-5 w-5" />
                                        ) : (
                                            <span>!</span>
                                        )}
                                    </div>
                                </ItemMedia>

                                {/* Reseller Info */}
                                <ItemContent className="w-full flex flex-col gap-1">
                                    <ItemTitle className="h-full flex text-[14px] font-semibold">
                                        <span className="">{reseller.name}</span>
                                        <div className=" h-full">
                                            <ItemContent className=" h-full gap-1">
                                                <ItemTitle className="text-sm font-bold">
                                                    {reseller.status === "active" ? (
                                                        <CheckCircle2 size={14} className="bg-green-700 rounded-full text-white"></CheckCircle2>
                                                    ) : (
                                                        <HourglassIcon size={18} className="bg-yellow-600 rounded-full p-1 text-white">Pending</HourglassIcon>
                                                    )}
                                                </ItemTitle>
                                                <ItemDescription className="text-xs text-gray-500 pl-2 hidden">
                                                    Status
                                                </ItemDescription>
                                            </ItemContent>
                                        </div>
                                    </ItemTitle>
                                    <ItemDescription className="text-xs text-gray-500">
                                        {reseller.phoneNumber}
                                    </ItemDescription>
                                </ItemContent>
                            </div>
                            {/* Balance & Actions */}
                            <ItemActions>
                                <DropdownMenuAction
                                    reseller={reseller}
                                    onApprove={onApprove}
                                    approveMutation={approveMutation}
                                />
                            </ItemActions>
                        </div>
                        {/* Verification Badge */}

                        <div className="w-full flex items-center gap-2 hidden">
                            <div className="w-full">
                                <ItemContent>
                                    <ItemTitle className=" font-semibold">
                                        {reseller.totalCommissionEarned === 0 ? (
                                            <span className="">₵{formatCurrency(reseller.totalCommissionEarned)}</span>
                                        ) : (
                                            <span className="text-green-600">+₵{formatCurrency(reseller.totalCommissionEarned)}</span>
                                        )}
                                    </ItemTitle>

                                </ItemContent>
                            </div>
                            <div className="w-full">
                                <ItemContent>
                                    <ItemTitle className="text-sm font-semibold">
                                        ₵{formatCurrency(reseller.totalCommissionPaidOut)}
                                    </ItemTitle>
                                </ItemContent>
                            </div></div>

                        <div className="w-full ">
                            <ItemContent className="w-full flex items-center">
                                <ItemDescription className="text-xs text-gray-500">
                                    Joined {formatDate(reseller.createdAt)}
                                </ItemDescription>
                            </ItemContent>
                        </div>

                    </Item>
                ))}
            </div>
        </div>
    )
}
// <ItemActions className="flex flex-col items-end gap-2">
//                         {/* Balance */}
//                         <div className="text-right">
//                             <div className="text-sm font-semibold text-slate-900">
//                                 {formatCurrency(
//                                     (Number(reseller.totalCommissionEarned) || 0) -
//                                     (Number(reseller.totalCommissionPaidOut) || 0)
//                                 )}
//                             </div>
//                             <div className="text-xs text-slate-500">Available</div>
//                         </div>

//                         {/* Status & Actions */}
//                         <div className="flex items-center gap-2">
//                             {/* Status Badge */}
//                             <Badge
//                                 className={`${getStatusColor(reseller.status)} text-xs font-medium`}
//                             >
//                                 {reseller.isApproved ? "Approved" : "Pending"}
//                             </Badge>

//                             {/* Approve Button */}
//                             {reseller.status === "pending" && (
//                                 <Button
//                                     size="icon"
//                                     variant="ghost"
//                                     className="h-8 w-8 text-green-600 hover:bg-green-50"
//                                     title="Approve"
//                                     onClick={(e) => {
//                                         e.stopPropagation()
//                                         onApprove(reseller._id, "active")
//                                     }}
//                                     disabled={approveMutation.isPending}
//                                 >
//                                     {approveMutation.isPending ? (
//                                         <Loader2 className="h-4 w-4 animate-spin" />
//                                     ) : (
//                                         <Check className="h-4 w-4" />
//                                     )}
//                                 </Button>
//                             )}
//                         </div>
//                     </ItemActions>