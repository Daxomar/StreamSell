"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, MoreHorizontal, Plus, Search, ArrowUpDown, Loader2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BulkTimestampSelector } from "@/components/admin/bulk-timestamp-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { formatCurrency } from "@/lib/utils"
import { Ta } from "zod/v4/locales"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { ResellersTabsView } from "@/components/dashboard/resellerListTabs"
import { useUser } from "../../contexts/UserContext"
import { useSession } from "../../../lib/auth-client"
import { api } from "../../../lib/api"

// Send Invite Schema
const sendInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ResellersPage() {
  const router = useRouter();
  const queryClient = useQueryClient()
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const {reseller} = useUser()
  const {data:session} =useSession()
  const role = session?.user?.role


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedResellers, setSelectedResellers] = useState([])
  const [confirmData, setConfirmData] = useState(null)

  // React Hook Form for invite
  const {
    register,
    handleSubmit: handleInvite,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(sendInviteSchema),
  })

  // Fetch all resellers with pagination
  const {
    data: resellersResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["resellers", currentPage, pageSize, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const data = await api(`/api/v1/users?${params.toString()}`)

      if (!data.success) {
        throw new Error(err.message || "Failed to fetch resellers")
      }

      return data
    },
    refetchOnWindowFocus: true,
    keepPreviousData: true,
  })

  const resellers = resellersResponse?.data || []
  const pagination = resellersResponse?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  }
  const analytics = resellersResponse?.analytics || {
    totalResellers: 0,
    activeResellers: 0,
    pendingResellers: 0,
    totalCommissionEarned: 0,
    totalCommissionPaidOut: 0,
    availableBalance: 0,
    currency: "GHS",
  }

 // Invite reseller mutation will delete trust me
  const inviteMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api(`/users/invite`, {
        method: "POST",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.message || "Failed to send invitation")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to send invitation")
      }

      return result
    },
    onSuccess: (data) => {
      toast.success(`Invitation sent to ${data.email}`)
      reset()
      setIsInviteOpen(false)
      queryClient.invalidateQueries(["resellers"])
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation")
    },
  })



  // Approve reseller mutation
  const approveMutation = useMutation({
    mutationFn: async (userId) => {
      const data = await api(`/api/v1/users/${userId}/approve`)

       if (!data.success) {
        throw new Error(err.message || "Failed to approve reseller")
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resellers"])
      toast.success("Reseller approved successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve reseller")
    },
  })

  // Reject reseller mutation
  const rejectMutation = useMutation({
    mutationFn: async (userId) => {
      const data = await api(`/api/v1/users/${userId}/reject`)

        if (!data.success) {
        throw new Error(err.message || "Failed to approve reseller")
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resellers"])
      toast.success("Reseller rejected/suspended successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject reseller")
    },
  })

  const onSubmitInvite = (data) => {
    inviteMutation.mutate(data)
  }

  const updateStatus = (id, newStatus) => {
    if (newStatus === "active") {
      approveMutation.mutate(id)
    } else if (newStatus === "suspended") {
      rejectMutation.mutate(id)
    }
  }

  // Client-side filter and sort (for current page only)
  const filteredResellers = useMemo(() => {
    let result = [...resellers]

    // Status filter (client-side on current page)
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter)
    }

    // Sorting (client-side on current page)
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "sales":
          comparison = (b.salesVolume || 0) - (a.salesVolume || 0)
          break
        case "joined":
          comparison = new Date(a.createdAt) - new Date(b.createdAt)
          break
        default:
          comparison = 0
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [resellers, statusFilter, sortBy, sortOrder])

  const toggleSelectReseller = (resellerId) => {
    setSelectedResellers((prev) =>
      prev.includes(resellerId) ? prev.filter((id) => id !== resellerId) : [...prev, resellerId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedResellers.length === filteredResellers.length) {
      setSelectedResellers([])
    } else {
      setSelectedResellers(filteredResellers.map((r) => r._id))
    }
  }

  const handleBulkAction = (action) => {
    if (action === "approve") {
      selectedResellers.forEach((id) => {
        const reseller = resellers.find((r) => r._id === id)
        if (reseller && reseller.status === "pending") {
          approveMutation.mutate(id)
        }
      })
      setSelectedResellers([])
    } else if (action === "reject") {
      selectedResellers.forEach((id) => {
        const reseller = resellers.find((r) => r._id === id)
        if (reseller && reseller.status === "pending") {
          rejectMutation.mutate(id)
        }
      })
      setSelectedResellers([])
    }
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    setSelectedResellers([])
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize))
    setCurrentPage(1)
    setSelectedResellers([])
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setCurrentPage(1)
    setSelectedResellers([])
  }

  // Calculate stats from analytics
  const totalActiveResellers = analytics?.activeResellers
  const totalResellers = analytics?.totalResellers
  const pendingCount = analytics?.pendingResellers
  const totalSalesVolume = analytics?.totalCommissionEarned
  const totalPaidOut = analytics?.totalCommissionPaidOut

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reseller Management</h2>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Reseller
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-white/95 shadow-2xl border border-slate-200">
            <form onSubmit={handleInvite(onSubmitInvite)}>
              <DialogHeader>
                <DialogTitle>Invite New Reseller</DialogTitle>
                <DialogDescription>Send an invitation email to add a new reseller to your platform.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="reseller@example.com"
                    disabled={inviteMutation.isPending}
                    {...register("email")}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
              <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                  disabled={inviteMutation.isPending}
                  className="min-w-[90px] justify-center border-2 border-black"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="min-w-[90px] justify-center border-2 border-black bg-green-500 text-white hover:bg-green-800"
                  disabled={inviteMutation.isPending}
                >
                  {inviteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Invite"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Active Resellers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">{totalActiveResellers}</div>
            )}
          </CardContent>
        </Card>
         <Card className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Sales Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">GHS {totalSalesVolume.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Paid volume</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="text-2xl font-bold">GHS {totalPaidOut.toFixed(2)}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection */}
      {selectedResellers.length > 0 && (
        <BulkTimestampSelector
          onBulkAction={handleBulkAction}
          selectedCount={selectedResellers.length}
          totalCount={filteredResellers.length}
          actions={["approve", "reject"]}
        />
      )}

      <Card className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
        <CardHeader className="">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-3 border-[#EEEEEE] ">
            <div className="flex flex-col gap-2">
              <CardTitle className="sm:text-sm md:text-md lg:text-lg font-semibold">All Resellers</CardTitle>
              <CardDescription className="">Manage reseller accounts and approvals. View key insights into each reseller</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">

              {/* Sort */}
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="joined">Joined Date</SelectItem>
                </SelectContent>
              </Select> */}

              {/* <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button> */}

              {/* <Button
                onClick={() => queryClient.invalidateQueries(["resellers"])}
                className="border-2 border-slate-600 bg-blue-500 text-white hover:bg-green-700"
              >
                Refresh
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResellersTabsView
            role={role}
            resellers={resellers}
            isLoading={isLoading}
            isError={isError}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            error={error}
            onApprove={(id, status) => approveMutation.mutate({ id, status })}
            approveMutation={approveMutation}
          />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4 sm:flex-row flex-col gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">
                Showing {filteredResellers.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, pagination.totalUsers)} of {pagination.totalUsers} resellers
              </p>
            </div>

            <div className="flex items-center gap-6 sm:flex-row flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600">Rows per page:</p>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  <p className="text-sm text-slate-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage || isLoading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}