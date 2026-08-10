"use client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search, CheckCircle, XCircle, Eye, Clock, ChevronLeft, ChevronRight, Loader2,
  TrendingUp, Download
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { useTransactions } from "../contexts/TransactionContext"
import { api } from "../../lib/api"
 
export default function ManagerDashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isConfirmDeliveryDialogOpen, setIsConfirmDeliveryDialogOpen] = useState(false)
  const [isMarkFailedDialogOpen, setIsMarkFailedDialogOpen] = useState(false)
  const [failureReason, setFailureReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { transactions, analytics, pagination, isLoadingTransactions, fetchTransactions, handlePageChange, currentPage } = useTransactions()

  const queryClient = useQueryClient()

  const handleSearch = () => {
    handlePageChange(1)
    fetchTransactions({ search: searchQuery, page: 1, deliveryStatus: "pending", sortBy: "createdAt", sortOrder: "asc" })
  }

  const bulkExportMutation = useMutation({
    mutationFn: async ({ network, limit }) => {
      const response = await api(`/api/v1/transaction/bulk-export`, { method: "POST", body: JSON.stringify({ network, limit }) })
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || "Export failed")
      const data = await response.json()
      if (!data.success) throw new Error(data.message || "Export failed")
      return data
    },
    onSuccess: (data) => {
      toast.success(`Exported ${data.count} transactions`)
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries(['bulk-exports']);
      queryClient.invalidateQueries(['export-transactions']);

    },
    onError: (error) => toast.error(error.message || "Export failed")
  })

  const deliveredMutation = useMutation({
    mutationFn: async (transactionId) => {
      const response = await api(`/api/v1/transaction/${transactionId}/delivery`, {
        method: "PATCH",
        body: JSON.stringify({ deliveryStatus: "delivered" })
      })
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || "Failed")
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries(['bulk-exports']);
      queryClient.invalidateQueries(['export-transactions']);
      toast.success("Marked as delivered")
      setIsConfirmDeliveryDialogOpen(false)
      setSelectedTransaction(null)
    },
    onError: (error) => toast.error(error.message)
  })





  const failedMutation = useMutation({
    mutationFn: async ({ transactionId, reason }) => {
      const response = await api(`/api/v1/transaction/${transactionId}/delivery`, {
        method: "PATCH",
        body: JSON.stringify({ deliveryStatus: "failed", failureReason: reason })
      })
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || "Failed")
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      toast.success("Marked as failed")
      setIsMarkFailedDialogOpen(false)
      setSelectedTransaction(null)
      setFailureReason("")
    },
    onError: (error) => toast.error(error.message)
  })

  const getNetworkColor = (network) => ({
    MTN: "bg-yellow-100 text-yellow-600",
    AT: "bg-red-100 text-red-600",
    VODAFONE: "bg-red-100 text-red-600",
    TELECEL: "bg-blue-100 text-blue-600",
  }[network?.toUpperCase()] || "bg-gray-100 text-gray-600")

  const StatusBadge = ({ status }) => {
    const colors = {
      success: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    }
    return <Badge className={colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700"} variant="secondary">{status}</Badge>
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  })







 const pendingCount = analytics?.activeOrders || 0;
  const deliveredCount = analytics?.deliveredOrders || 0;
  const processingCount = analytics?.processingOrders || 0;




  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="">
        <h2 className="text-3xl font-bold text-center md:text-start">Transactions</h2>
        <p className="text-muted-foreground text-center md:text-start">Manage and monitor pending data bundle transactions.</p>
      </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-green-600 text-white">
            <CheckCircle className="w-4 h-4" />
            {deliveredCount} Delivered
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-amber-600 text-white">
            <Clock className="w-4 h-4" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1 bg-blue-600 text-white">
            <Clock className="w-4 h-4" />
            {processingCount} Processing
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" /> : <div className="text-2xl font-bold">{formatCurrency(analytics?.totalRevenue || 0)}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" /> : <div className="text-2xl font-bold">{analytics?.totalOrders || 0}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Orders </CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" /> : <div className="text-2xl font-bold">{analytics?.activeOrders || 0}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" /> :
              <div className=" ">
                <div className="text-md ">Total Cost: {formatCurrency(analytics?.totalCost || 0)}</div>
                <div className="">TJBCP: {formatCurrency(analytics?.totalJBCP || 0)}</div>
                <div className="">TRSP: {formatCurrency(analytics?.totalResellerProfits || 0)}</div>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="space-y-4">
            <div className="flex  flex-col  md:flex-row items-center  justify-around">
              <CardTitle> Transactions View</CardTitle>
              {/* <Button 
                onClick={() => bulkExportMutation.mutate()} 
                disabled={bulkExportMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {bulkExportMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Bulk Export
              </Button> */}


              <div className=" flex flex-col md:flex-row items-center gap-2 p-2">
                {/* MTN EXPORT */}
                <Button
                  onClick={() => bulkExportMutation.mutate({ network: 'mtn', limit: 100 })}
                  disabled={bulkExportMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {bulkExportMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  MTN Export
                </Button>


                {/* Telecel Export */}
                <Button
                  onClick={() => bulkExportMutation.mutate({ network: 'telecel', limit: 100 })}
                  disabled={bulkExportMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {bulkExportMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  TELECEL Export
                </Button>



                {/* Airtel Export */}
                <Button
                  onClick={() => bulkExportMutation.mutate({ network: 'at', limit: 100 })}
                  disabled={bulkExportMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {bulkExportMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                  Airtel Tigo Export
                </Button>



              </div>





            </div>

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by phone, reference, or email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoadingTransactions}
                className="bg-blue-400 hover:bg-blue-500 text-white"
              >
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Bundle</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTransactions ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                      No pending transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn) => (
                    <TableRow key={txn.transactionId}>
                      <TableCell className="font-mono text-xs">{txn.transactionId?.slice(-8)}</TableCell>
                      <TableCell>{txn.customer}</TableCell>
                      <TableCell>{txn.bundleName}</TableCell>
                      <TableCell><Badge className={getNetworkColor(txn.network)}>{txn.network}</Badge></TableCell>
                      <TableCell>{formatCurrency(txn.amount)}</TableCell>
                      <TableCell className="text-green-600 font-medium">{formatCurrency(txn.JBProfit)}</TableCell>
                      <TableCell><StatusBadge status={txn.deliveryStatus} /></TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(txn.dateTime)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => { setSelectedTransaction(txn); setIsConfirmDeliveryDialogOpen(true) }}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          {/* <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => { setSelectedTransaction(txn); setIsMarkFailedDialogOpen(true) }}>
                            <XCircle className="h-4 w-4" />
                          </Button> */}
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedTransaction(txn); setIsViewDialogOpen(true) }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && !isLoadingTransactions && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-slate-500">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoadingTransactions}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoadingTransactions}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages || isLoadingTransactions}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 text-sm">
              <div><p className="text-slate-500">ID</p><p className="font-mono text-xs">{selectedTransaction.transactionId}</p></div>
              <div><p className="text-slate-500">Customer</p><p>{selectedTransaction.customer}</p></div>
              <div><p className="text-slate-500">Bundle</p><p>{selectedTransaction.bundleName}</p></div>
              <div><p className="text-slate-500">Amount</p><p className="font-bold">{formatCurrency(selectedTransaction.amount)}</p></div>
              <div><p className="text-slate-500">Network</p><Badge className={getNetworkColor(selectedTransaction.network)}>{selectedTransaction.network}</Badge></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delivery Dialog */}
      <Dialog open={isConfirmDeliveryDialogOpen} onOpenChange={setIsConfirmDeliveryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>Mark as successfully delivered</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="font-medium">{selectedTransaction.customer}</p>
              <p className="text-sm text-slate-600">{selectedTransaction.bundleName}</p>
              <p className="text-lg font-bold text-green-600 mt-2">{formatCurrency(selectedTransaction.amount)}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeliveryDialogOpen(false)} disabled={deliveredMutation.isPending}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => deliveredMutation.mutate(selectedTransaction.transactionId)} disabled={deliveredMutation.isPending}>
              {deliveredMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Failed Dialog */}
      {/* <Dialog open={isMarkFailedDialogOpen} onOpenChange={setIsMarkFailedDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Failed</DialogTitle>
            <DialogDescription>Provide a reason for delivery failure</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="font-medium">{selectedTransaction.customer}</p>
                <p className="text-sm text-slate-600">{selectedTransaction.bundleName}</p>
                <p className="text-lg font-bold text-red-600 mt-2">{formatCurrency(selectedTransaction.amount)}</p>
              </div>
              <div>
                <Label htmlFor="reason">Failure Reason *</Label>
                <Textarea id="reason" placeholder="Enter reason..." value={failureReason} onChange={(e) => setFailureReason(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMarkFailedDialogOpen(false)} disabled={failedMutation.isPending}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => failedMutation.mutate({ transactionId: selectedTransaction.transactionId, reason: failureReason })} disabled={failedMutation.isPending || !failureReason.trim()}>
              {failedMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
              Mark Failed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}