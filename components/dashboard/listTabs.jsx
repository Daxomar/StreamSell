"use client"

import { ResellersList } from "@/components/dashboard/resellerList"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Search, X, } from "lucide-react"
import { Input } from "@/components/ui/input"
import { List } from "./listss"



export function ListTabsView({
    payouts,
    transactions,
    topProducts,
    role = "",
    resellers = [],
    isLoading = false,
    isError = false,
    searchQuery = "",
    onSearchChange = () => { },
    error = null,
    onApprove = () => { },
    approveMutation = {}
}) {
    return (
        <Tabs defaultValue="Top-selling" className="w-full">
            <div className="w-full flex flex-wrap gap-4 lg:justify-between  ">
                <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
                    <TabsTrigger
                        value="Top-selling"
                        className="
                    data-[state=active]:bg-white
                    data-[state=active]:text-black
                    data-[state=active]:border 
                    data-[state=active]:shadow-lg
                    data-[state=active]:scale-105
                    data-[state=active]:-translate-y-0.5
                    transition-all duration-200
                    p-4
                    rounded-md
                    text-gray-500
                    font-medium
                    "
                    >
                        Top Selling
                    </TabsTrigger>
                    <TabsTrigger
                        value="Transactions"
                        className="
                        data-[state=active]:bg-white
                        data-[state=active]:text-black
                        data-[state=active]:border 
                        data-[state=active]:shadow-lg
                        data-[state=active]:scale-105
                        data-[state=active]:-translate-y-0.5
                        transition-all duration-200
                        p-4
                        rounded-md
                        text-gray-500
                        font-medium
                        "
                    >
                        Transactions
                    </TabsTrigger>

                    <TabsTrigger
                        value="Payouts"
                        className="
                    data-[state=active]:bg-white
                    data-[state=active]:text-black
                    data-[state=active]:border 
                    data-[state=active]:shadow-lg
                    data-[state=active]:scale-105
                    data-[state=active]:-translate-y-0.5
                    transition-all duration-200
                    p-4
                    rounded-md
                    text-gray-500
                    font-medium
                    ">
                        Payouts
                    </TabsTrigger>
                </TabsList>

                {/* Search Bar */}

                 </div>


            {/* Resellers Tab - Shows the List */}
            <TabsContent value="Top-selling" >
                <Card className="w-full border-none shadow-none py-2">
                    <List
                        items={topProducts}
                        type="product"
                        role={role}
                        resellers={resellers}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onApprove={onApprove}
                        approveMutation={approveMutation}
                    />
                </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="Transactions">
                <Card className="w-full border-none shadow-none py-2">
                    <List
                        items ={transactions}
                        type="transaction"
                        role={role}
                        resellers={resellers.filter(r => r.status === "active")}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onApprove={onApprove}
                        approveMutation={approveMutation}
                    />
                </Card>
            </TabsContent>

            {/* Pending Approval Tab */}
            <TabsContent value="Payouts">
                <Card className="w-full border-none shadow-none py-2">
                    <List
                        items={payouts}
                        type ="payout"
                        role={role}
                        resellers={resellers.filter(r => r.status === "pending")}
                        isLoading={isLoading}
                        isError={isError}
                        error={error}
                        onApprove={onApprove}
                        approveMutation={approveMutation}
                    />
                </Card>
            </TabsContent>
        </Tabs>
    )
}