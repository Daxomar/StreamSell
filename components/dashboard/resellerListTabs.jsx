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



export function ResellersTabsView({
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
        <Tabs defaultValue="resellers" className="w-full">
            <div className="w-full flex flex-wrap gap-4 lg:justify-between  ">
                <TabsList className="border border-gray-200/50 bg-gray-200/50 rounded-md px-2 py-5 gap-2">
                    <TabsTrigger
                        value="resellers"
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
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
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
                        Active
                    </TabsTrigger>

                    <TabsTrigger
                        value="pending"
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
                        Pending
                    </TabsTrigger>
                </TabsList>

                {/* Search Bar */}
                    <div className="h-full w-full md:max-w-sm lg:max-w-md flex  items-center gap-2">
                      <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="
                            w-full pl-10 
                            py-2
                            rounded-lg
                            border border-[#EEEEEE]
                            bg-gray-200/50
                            focus:outline-none
                            focus:ring-2
                            focus:ring-gray-500/20
                            placeholder:text-gray-500
                            transition-all
                            "
                                        />
                         {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                          )}
                          </div>
                    </div>
                 </div>


            {/* Resellers Tab - Shows the List */}
            <TabsContent value="resellers" >
                <Card className="w-full border-none shadow-none py-2">
                    <ResellersList
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
            <TabsContent value="active">
                <Card className="w-full border-none shadow-none py-2">
                    <ResellersList
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
            <TabsContent value="pending">
                <Card className="w-full border-none shadow-none py-2">
                    <ResellersList
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