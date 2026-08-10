"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Search, ArrowUpDown, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { api } from "@/lib/api"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SubscriptionsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState("")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  // FETCH
  const { data: subsData, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => api("/api/v1/subscriptions/all"),
    staleTime: 5 * 60 * 1000,
  })
  const subscriptions = subsData?.data || []

  // TOGGLE ACTIVE (stays — it's a list-level action)
  const toggleActiveMutation = useMutation({
    mutationFn: ({ subscriptionId }: { subscriptionId: string }) =>
      api(`/api/v1/subscriptions/${subscriptionId}/toggle-status`, { method: "PATCH" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
    onError: (err: any) => toast.error(err.message),
  })

  const handleToggleActive = (sub: any) => {
    toggleActiveMutation.mutate({ subscriptionId: sub._id })
  }

  // Navigate to the full create/edit pages
  const handleAddNew = () => router.push("/admin/subscriptions/new")
  const handleEdit = (sub: any) => router.push(`/admin/subscriptions/${sub._id}`)

  const filtered = subscriptions
    .filter((s: any) => {
      if (
        searchQuery &&
        !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.plan?.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false
      if (serviceFilter !== "all" && s.service !== serviceFilter) return false
      return true
    })
    .sort((a: any, b: any) => {
      let c = 0
      if (sortBy === "name") c = a.name?.localeCompare(b.name)
      else if (sortBy === "price") c = a.sellingPrice - b.sellingPrice
      else if (sortBy === "plan") c = (a.plan || "").localeCompare(b.plan || "")
      return sortOrder === "desc" ? -c : c
    })

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Failed to load subscriptions: {(error as any).message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-sm text-slate-500">Manage subscription offerings, pricing, and availability.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Add New Subscription
        </Button>
      </div>

      <Card className="">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="">Subscription Plans</CardTitle>
              <CardDescription className="">View and maintain active subscription plans.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem className="" value="all">All Services</SelectItem>
                  <SelectItem className="" value="Netflix">Netflix</SelectItem>
                  <SelectItem className="" value="Spotify">Spotify</SelectItem>
                  <SelectItem className="" value="HBO Max">HBO Max</SelectItem>
                  <SelectItem className="" value="Disney+">Disney+</SelectItem>
                  <SelectItem className="" value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="">
                  <SelectItem className="" value="name">Name</SelectItem>
                  <SelectItem className="" value="price">Price</SelectItem>
                  <SelectItem className="" value="plan">Plan</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="">
                <TableHeader className="">
                  <TableRow className="">
                    <TableHead className="whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Service</TableHead>
                    <TableHead className="whitespace-nowrap">Plan</TableHead>
                    <TableHead className="whitespace-nowrap">Cost</TableHead>
                    <TableHead className="whitespace-nowrap">Price</TableHead>
                    <TableHead className="whitespace-nowrap">Duration</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {filtered.length === 0 ? (
                    <TableRow className="">
                      <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((sub: any) => (
                      <TableRow className="" key={sub._id}>
                        <TableCell className="whitespace-nowrap">{sub.subscription_id}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{sub.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{sub.service}</TableCell>
                        <TableCell className="whitespace-nowrap">{sub.plan}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(sub.costPrice)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(sub.sellingPrice)}</TableCell>
                        <TableCell className="whitespace-nowrap">{sub.duration}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Switch
                              className="border-2 border-[#949596]"
                              checked={sub.isActive}
                              onCheckedChange={() => handleToggleActive(sub)}
                              disabled={toggleActiveMutation.isPending}
                            />
                            <Badge
                              variant={sub.isActive ? "default" : "secondary"}
                              className={
                                sub.isActive
                                  ? "bg-green-500 hover:bg-green-600 text-white font-semibold"
                                  : "bg-slate-200 text-slate-600"
                              }
                            >
                              {sub.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-slate-100"
                            onClick={() => handleEdit(sub)}
                          >
                            <Edit2 className="h-4 w-4 text-slate-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}