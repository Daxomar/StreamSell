"use client"

import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { HelpCircle, Menu, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname} from "next/navigation"

interface Complaint {
  _id: string
  transactionReference?: string
  complaintType: string
  description: string
  status: string
  resolutionNotes?: string
  createdAt: string
}



const ITEMS_PER_PAGE = 10

export default function MyComplaintsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname?.startsWith(path))
const [page, setPage] = useState(1)
  
  // Fetch customer's complaints
//   const {
//     data: complaintsResponse,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["myPublicComplaints", currentPage],
//     queryFn: async () => {
//       return api(`/api/v1/complaints/public/my?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
//     },
//   })

   const { data: complaintsResponse, isLoading, isError, isFetching } = useQuery({
    queryKey: ["myOrders", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/complaints/public/my?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
          credentials: "include",
        }
      )
      if (res.status === 401) {
        return { orders: [], pagination: { page: 1, pages: 1, total: 0 }, noSession: true }
      }
      if (!res.ok) throw new Error("Failed to load orders")
      const json = await res.json()
      return { ...json.data, noSession: false }
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })


  const complaints = complaintsResponse?.complaints || []
  const pagination = complaintsResponse?.pagination 
  const totalPages = pagination?.pages || 1

  console.log("Complaints :", complaints)
  console.log("Complaints Response:", complaintsResponse)

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "assigned":
        return "secondary"
      case "investigating":
        return "outline"
      case "resolved":
        return "default"
      case "rejected":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getComplaintTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      credentials_wrong: "Credentials Invalid",
      not_delivered: "Not Delivered",
      payment_issue: "Payment Issue",
      reseller_scam: "Reseller Scam",
      how_it_works: "How It Works",
      account_help: "Account Help",
      subscription_question: "Subscription Question",
      billing: "Billing",
      other: "Other",
    }
    return labels[type] || type
  }

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
          <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900">StreamHub</span>
          </div>
          <nav className="hidden sm:flex items-center gap-4">
            <Link href="/track-order" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
              <Search className="h-4 w-4" /> Track Order
            </Link>
            <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> Support
            </Link>
            <Link href="/recent-orders" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> Recent Orders
            </Link>
            <Link href="/complaints" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> Complaints
            </Link>
          </nav>
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-white">
                <nav className="flex-1 px-4 py-6 space-y-2">
                  <Link href="/track-order" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/track-order") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
                    Track Orders
                  </Link>
                  <Link href="/support" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/support") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
                    Support
                  </Link>
                  <Link href="/recent-orders" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/support") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
                    Recent Orders
                  </Link>
                  <Link href="/complaints" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/complaints") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
                    Complaints
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="space-y-1 p-2">
        <h2 className="text-2xl font-bold tracking-tight">My Complaints & Inquiries</h2>
        <p className="text-sm text-slate-500 mt-1">Track the status of your complaints and support requests</p>
      </div>

      {/* Complaints List */}
      <div className="space-y-2">
        {isLoading && (
          <Card className="bg-white/40 backdrop-blur-sm border-slate-200">
            <CardContent className="py-8 text-center text-slate-500">
              <p>Loading...</p>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="bg-white/40 backdrop-blur-sm border-slate-200">
            <CardContent className="py-8 text-center text-red-600">
              <p>Error loading complaints</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && complaints.length === 0 && (
          <Card className="bg-white/40 backdrop-blur-sm border-slate-200">
            <CardContent className="py-12 text-center text-slate-500">
              <i className="fa-solid fa-inbox w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No complaints yet</p>
            </CardContent>
          </Card>
        )}

        {complaints.map((complaint: any) => (
          <Card
            key={complaint._id}
            className="rounded-xl bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all border-slate-200 hover:border-slate-300 cursor-pointer mx-2"
            onClick={() => handleViewDetails(complaint)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    {getComplaintTypeLabel(complaint.complaintType)}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
                    {complaint.transactionReference && ` • Ref: ${complaint.transactionReference}`}
                  </CardDescription>
                </div>
                <Badge variant={statusBadgeVariant(complaint.status)} className="text-xs shrink-0">
                  {complaint.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-slate-700 line-clamp-2">{complaint.description}</p>
              {complaint.status === "resolved" && complaint.resolutionNotes && (
                <p className="text-xs text-green-700 bg-green-50 rounded px-2 py-1.5 mt-2">
                  ✓ {complaint.resolutionNotes.slice(0, 80)}...
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-xs h-8"
          >
            ← Previous
          </Button>

          <div className="text-xs text-slate-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-xs h-8"
          >
            Next →
          </Button>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="">
            <DialogTitle className="">{getComplaintTypeLabel(selectedComplaint?.complaintType || "")}</DialogTitle>
            <DialogDescription className="">
              {selectedComplaint?.transactionReference || "General Inquiry"}
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Status</p>
                <Badge className="" variant={statusBadgeVariant(selectedComplaint.status)}>
                  {selectedComplaint.status}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Filed</p>
                <p className="text-sm text-slate-700">
                  {formatDistanceToNow(new Date(selectedComplaint.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Description</p>
                <p className="text-sm text-slate-700 bg-slate-50 rounded p-2">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.resolutionNotes && (
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Resolution</p>
                  <p className="text-sm text-slate-700 bg-green-50 rounded p-2">
                    {selectedComplaint.resolutionNotes}
                  </p>
                </div>
              )}

              {selectedComplaint.status === "open" && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs text-blue-700">
                    <i className="fa-solid fa-info-circle mr-2" />
                    Your complaint is being reviewed. You'll be notified when we respond.
                  </p>
                </div>
              )}

              {selectedComplaint.status === "investigating" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-xs text-yellow-700">
                    <i className="fa-solid fa-hourglass-half mr-2" />
                    We're currently investigating your complaint.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}