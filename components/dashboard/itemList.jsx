"use client"
import { Plus } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import EmptyPage from "../ui/emptyPageButton"

export function ItemList({ transactions = [] }) {
    // Network colors for badge display
    const getNetworkColor = (network) => {
        const colors = {
            MTN: "bg-yellow-100 text-yellow-700",
            AT: "bg-red-100 text-red-700",
            VODAFONE: "bg-blue-100 text-blue-700",
            TELECEL: "bg-purple-100 text-purple-700",
        }
        return "bg-[#262626] text-white"
    }

    // Status colors
    const getStatusColor = (status) => {
        const colors = {
            success: "text-green-600 ",
            pending: "text-yellow-600 bg-yellow-50",
            failed: "text-red-600 bg-red-50",
        }
        return colors[status?.toLowerCase()] || "text-gray-600 bg-gray-50"
    }

    // Empty state
    if (!transactions || transactions.length === 0) {
        return (
            <div className="flex w-full max-w-2xl flex-col gap-2 rounded-xl   lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all border-slate-200/50  bg-white/40 ">
                <div className="text-sm font-semibold flex justify-between p-3">
                    <ItemTitle className="">Recent Transactions</ItemTitle>
                    <ItemActions className="flex flex-col items-end gap-1">View All</ItemActions>
                </div>
                <Item variant="" >
                    <EmptyPage Title="No transactions yet" Description="Make your first transaction" buttonType="no button" />
                </Item>
            </div>
        )
    }

    return (
        <div className="flex w-full max-w-3xl flex-col gap-3 rounded-xl p-2 lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all border-slate-200/50  bg-white/40">
            <div className="text-sm font-semibold flex justify-between p-3">
                <ItemTitle className="">Recent Transactions</ItemTitle>
                <ItemActions className="flex flex-col items-end gap-1">View All</ItemActions>
            </div>
            {transactions.map((transaction) => (
                <Item key={transaction.transactionId} variant="outline"
                    className="border-slate-200/50 bg-white/40 lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
                    {/* Service Badge */}
                    <ItemMedia>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-white ${getNetworkColor(
                                transaction.service
                            )}`}
                        >
                            {transaction.service?.slice(0, 2).toUpperCase() || "??"}
                        </div>
                    </ItemMedia>

                    {/* Customer & Subscription Info */}
                    <ItemContent>
                        <ItemTitle className="text-sm font-semibold">
                            {transaction.customer || "Unknown Customer"}
                        </ItemTitle>
                        <ItemDescription className="text-xs text-slate-600">
                            {transaction.subscriptionName || "Subscription"}
                        </ItemDescription>
                    </ItemContent>

                    {/* Amount */}
                    <ItemActions className="flex flex-col items-end gap-1">
                        <div className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(
                            transaction.status
                        )}`}>
                            +₵{formatCurrency(transaction.amount)}
                        </div>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
}