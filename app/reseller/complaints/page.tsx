"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"

type StatusFilter = "all" | "open" | "assigned" | "investigating" | "resolved" | "rejected"

interface Complaint {
  _id: string
  transactionReference?: string
  complaintType: string
  description: string
  status: string
  resolutionNotes?: string
  createdAt: string
  updatedAt: string
}

const ITEMS_PER_PAGE = 10

export default function MyComplaintsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Fetch reseller's complaints
  const {
    data: complaintsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myComplaints", currentPage, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        skip: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
        limit: ITEMS_PER_PAGE.toString(),
        status: statusFilter !== "all" ? statusFilter : "",
      })
      return api(`/api/v1/complaints/my?${params.toString()}`)
    },
  })

  const complaints = complaintsResponse?.complaints || []
  const total = complaintsResponse?.total || 0
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Complaints</h2>
        <p className="text-sm text-slate-500 mt-1">View and track your complaints and inquiries</p>
      </div>

      {/* Filter */}
      <div className="w-full md:w-64">
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Filter by Status</label>
        <Select value={statusFilter} onValueChange={(val) => {
          setStatusFilter(val as StatusFilter)
          setCurrentPage(1)
        }}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem className="" value="all">All Status</SelectItem>
            <SelectItem  className="" value="open">Open</SelectItem>
            <SelectItem  className="" value="assigned">Assigned</SelectItem>
            <SelectItem className="" value="investigating">Investigating</SelectItem>
            <SelectItem className="" value="resolved">Resolved</SelectItem>
            <SelectItem className="" value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints List */}
      <div className="space-y-2">
        {isLoading && (
          <Card className="bg-white/40 backdrop-blur-sm border-slate-200">
            <CardContent className="py-8 text-center text-slate-500">
              <p>Loading complaints...</p>
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
              <p>No complaints found</p>
            </CardContent>
          </Card>
        )}

        {complaints.map((complaint :any) => (
          <Card
            key={complaint._id}
            className="rounded-xl bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all border-slate-200 hover:border-slate-300 cursor-pointer"
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}