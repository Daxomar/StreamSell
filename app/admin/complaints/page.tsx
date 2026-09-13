// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { MessageSquare } from "lucide-react"

// // Mock Complaints
// const initialComplaints = [
//   { id: "TICKET-1", user: "Reseller: John Doe", issue: "Payment not verified", status: "open", date: "1 hour ago" },
//   { id: "TICKET-2", user: "Customer: 024...", issue: "Data not received", status: "resolved", date: "1 day ago" },
// ]

// export default function ComplaintsPage() {
//   const [complaints, setComplaints] = useState(initialComplaints)

//   const resolveTicket = (id) => {
//     setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)))
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold tracking-tight">Complaints Center</h2>

//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-4">
//           {complaints.map((ticket) => (
//             <Card key={ticket.id} className="cursor-pointer hover:border-blue-500 transition-colors">
//               <CardHeader className="pb-2">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-base">{ticket.id}</CardTitle>
//                     <CardDescription>
//                       {ticket.date} • {ticket.user}
//                     </CardDescription>
//                   </div>
//                   <Badge variant={ticket.status === "resolved" ? "default" : "destructive"}>{ticket.status}</Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm font-medium">{ticket.issue}</p>
//                 {ticket.status === "open" && (
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="mt-4 w-full bg-transparent"
//                     onClick={() => resolveTicket(ticket.id)}
//                   >
//                     Mark Resolved
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <Card className="h-fit">
//           <CardHeader>
//             <CardTitle>Ticket Details</CardTitle>
//             <CardDescription>Select a ticket to view conversation.</CardDescription>
//           </CardHeader>
//           <CardContent className="text-center text-slate-500 py-12">
//             <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
//             <p>No ticket selected</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"

type SortOrder = "oldest" | "newest"
type StatusFilter = "all" | "open" | "assigned" | "investigating" | "resolved" | "rejected"

interface Complaint {
  _id: string
  transactionReference: string
  filedByRole: "customer" | "reseller" | "admin"
  filedByPhone?: string
  complaintType: string
  description: string
  status: string
  resolutionNotes?: string
  createdAt: string
  updatedAt: string
}

export default function ComplaintsPage() {
  const queryClient = useQueryClient()
  const [searchId, setSearchId] = useState("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")

  // Fetch complaints
  const {
    data: complaintsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["complaints", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: statusFilter !== "all" ? statusFilter : "",
      })
      return api(`/api/v1/complaints?${params.toString()}`)
    },
  })

  // Resolve complaint mutation
  const resolveMutation = useMutation({
    mutationFn: (data: { id: string; resolutionNotes: string }) =>
      api(`/api/v1/complaints/${data.id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "resolved",
          resolutionNotes: data.resolutionNotes,
        }),
      }),
    onSuccess: () => {
      toast.success("Complaint resolved")
      setResolveDialogOpen(false)
      setResolutionNotes("")
      setSelectedComplaint(null)
      queryClient.invalidateQueries({ queryKey: ["complaints"] })
    },
    onError: (e: any) => toast.error(e?.message || "Failed to resolve complaint"),
  })

  const complaints = complaintsResponse?.complaints || []

  // Sort complaints
  const sortedComplaints = [...complaints].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === "oldest" ? dateA - dateB : dateB - dateA
  })

  // Filter by search ID
  const filteredComplaints = searchId.trim()
    ? sortedComplaints.filter((c) =>
        c.transactionReference.toLowerCase().includes(searchId.toLowerCase())
      )
    : sortedComplaints

  const handleResolve = () => {
    if (!selectedComplaint || !resolutionNotes.trim()) return
    resolveMutation.mutate({
      id: selectedComplaint._id,
      resolutionNotes,
    })
  }

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
      other: "Other",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Complaints Center</h2>
        <p className="text-sm text-slate-500 mt-1">Manage and resolve customer complaints</p>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Search by Ref</label>
          <Input
            placeholder="Transaction reference..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Status</label>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilter)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className ="" value="all">All Statuses</SelectItem>
              <SelectItem className ="" value="open">Open</SelectItem>
              <SelectItem className ="" value="assigned">Assigned</SelectItem>
              <SelectItem className ="" value="investigating">Investigating</SelectItem>
              <SelectItem className ="" value="resolved">Resolved</SelectItem>
              <SelectItem className ="" value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Sort</label>
          <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as SortOrder)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className ="" value="oldest">Oldest First</SelectItem>
              <SelectItem className ="" value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Complaints List */}
        <div className="lg:col-span-2 space-y-2">
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

          {!isLoading && filteredComplaints.length === 0 && (
            <Card className="bg-white/40 backdrop-blur-sm border-slate-200">
              <CardContent className="py-12 text-center text-slate-500">
                <i className="fa-solid fa-inbox w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>No complaints found</p>
              </CardContent>
            </Card>
          )}

          {filteredComplaints.map((complaint) => (
            <Card
              key={complaint._id}
              onClick={() => setSelectedComplaint(complaint)}
              className={`rounded-xl bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all cursor-pointer border ${
                selectedComplaint?._id === complaint._id
                  ? "border-[#262626] shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900 truncate">
                      {complaint.transactionReference}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })} •{" "}
                      {complaint.filedByRole === "customer"
                        ? `Customer: ${complaint.filedByPhone?.slice(-4)}`
                        : `Reseller`}
                    </CardDescription>
                  </div>
                  <Badge variant={statusBadgeVariant(complaint.status)} className="text-xs shrink-0">
                    {complaint.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#262626] bg-slate-100/50 rounded px-2 py-1 w-fit">
                    {getComplaintTypeLabel(complaint.complaintType)}
                  </p>
                  <p className="text-sm text-slate-700 line-clamp-2">{complaint.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedComplaint ? (
            <Card className="rounded-xl bg-white/40 backdrop-blur-sm shadow-md border-slate-200 sticky top-6">
              <CardHeader className="">
                <CardTitle className="text-base">Complaint Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Reference</p>
                  <p className="text-sm font-mono text-slate-900">{selectedComplaint.transactionReference}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Type</p>
                  <p className="text-sm text-slate-900">
                    {getComplaintTypeLabel(selectedComplaint.complaintType)}
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
                    <p className="text-xs font-medium text-slate-600 mb-1">Resolution Notes</p>
                    <p className="text-sm text-slate-700 bg-green-50 rounded p-2">
                      {selectedComplaint.resolutionNotes}
                    </p>
                  </div>
                )}

                {selectedComplaint.status !== "resolved" && (
                  <Button
                    onClick={() => setResolveDialogOpen(true)}
                    className="w-full bg-[#262626] hover:bg-[#1a1a1a] text-white text-sm h-9"
                  >
                    Resolve Complaint
                  </Button>
                )}

                {selectedComplaint.status === "resolved" && (
                  <div className="text-center py-3 bg-green-50 rounded text-sm text-green-700 font-medium">
                    ✓ Resolved
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-xl bg-white/40 backdrop-blur-sm shadow-md border-slate-200">
              <CardContent className="py-12 text-center text-slate-500">
                <i className="fa-solid fa-comments w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a complaint to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="">
            <DialogTitle className="">Resolve Complaint</DialogTitle>
            <DialogDescription className="">
              Ref: {selectedComplaint?.transactionReference}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-2 block">Resolution Notes</label>
              <Textarea
                placeholder="Explain how you resolved this complaint..."
                value={resolutionNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResolutionNotes(e.target.value)}
                className="text-sm min-h-[100px] rounded-lg border-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
              className="text-sm h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolutionNotes.trim() || resolveMutation.isPending}
              className="bg-[#262626] hover:bg-[#1a1a1a] text-white text-sm h-9"
            >
              {resolveMutation.isPending ? "Resolving..." : "Mark Resolved"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}