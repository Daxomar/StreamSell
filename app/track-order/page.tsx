"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Package, CheckCircle, Clock, XCircle, Home, Calendar, Loader2, AlertCircle, PhoneIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

type Order = {
  _id?: string
  reference: string
  subscriptionName: string
  amount: number
  status: string
  deliveryStatus?: string
  deliveredAt?: string
  failureReason?: string
  createdAt: string
  metadata?: { service?: string }
}

const trackOrderByReference = async (reference: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/transactions/track/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    }
  )
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || "Order not found")
  }
  return response.json()
}

export default function TrackOrderPage() {
  const [reference, setReference] = useState("")
  const [searchRef, setSearchRef] = useState("")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["trackOrder", searchRef],
    queryFn: () => trackOrderByReference(searchRef),
    enabled: !!searchRef,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reference.trim()) {
      toast.error("Please enter your order reference")
      return
    }
    setSearchRef(reference.trim())
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: any }> = {
      delivered: { color: "bg-green-600", icon: CheckCircle },
      processing: { color: "bg-blue-600", icon: Clock },
      pending: { color: "bg-amber-500", icon: Package },
      failed: { color: "bg-red-600", icon: XCircle },
    }
    const config = statusMap[status] || { color: "bg-slate-500", icon: Package }
    const Icon = config.icon
    return (
      <Badge variant={2} className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    })
  }

  const order: Order | null = data?.data || null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-xl text-slate-900">StreamHub</span>
          <Link href="/buy/bundlepurchase">
            <Button variant="ghost" size="sm" className="">
              <Home className="mr-2 h-4 w-4" />
              Buy Subscription
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Track Your Order</h1>
          <p className="text-lg text-slate-600">
            Enter your order reference (sent to you by SMS) to check your subscription status.
          </p>
        </div>

        <div className="w-full max-w-md border-2 border-red-500 rounded-lg p-4 mb-6 bg-red-50 shadow-md">
          <p className="text-sm font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Warning
          </p>
          <p className="text-sm mt-1 text-red-600 font-medium">
            Report orders not received within <strong>24 hours</strong>. We cannot resolve reports made after 24 hours.
          </p>
        </div>

        <Card className="w-full max-w-md shadow-lg mb-8 border-none">
          <CardHeader className="">
            <CardTitle className="">Order Lookup</CardTitle>
            <CardDescription className="">Search by your order reference</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="e.g. SUBpay_1787..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    disabled={isLoading}
                    className="pl-8 font-mono text-sm"
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e) }}
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  className="bg-[#262626] text-white font-semibold hover:bg-[#3a3a3a]"
                  disabled={isLoading || !reference}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                  ) : "Track"}
                </Button>
              </div>

              {isError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {(error as any)?.message || "Order not found"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order result */}
        {searchRef && (
          <Card className="w-full max-w-2xl shadow-lg border-none">
            <CardHeader className="">
              <CardTitle className="">Order Details</CardTitle>
              <CardDescription className="">Reference: {searchRef}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-[#262626] mx-auto mb-4 animate-spin" />
                  <p className="text-slate-500">Looking up your order...</p>
                </div>
              ) : order ? (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 text-lg">{order.subscriptionName}</p>
                      {order.metadata?.service && (
                        <p className="text-sm text-slate-600 mt-1">{order.metadata.service}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.deliveryStatus || order.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                    <div>
                      <p className="text-slate-500">Amount</p>
                      <p className="font-medium text-slate-900">GHS {order.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Order Date</p>
                      <p className="font-medium text-slate-900">{formatDate(order.createdAt)}</p>
                    </div>
                    {order.deliveredAt && (
                      <div className="col-span-2">
                        <p className="text-green-600 font-medium">Delivered — check your SMS for details</p>
                      </div>
                    )}
                    {order.failureReason && (
                      <div className="col-span-2">
                        <p className="text-slate-500">Failure Reason</p>
                        <p className="font-medium text-red-600">{order.failureReason}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-3 font-mono">Ref: {order.reference}</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No order found for this reference</p>
                  <p className="text-sm text-slate-400 mt-2">Double-check the reference from your SMS and try again</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6 w-full max-w-2xl">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Need immediate help?</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">WhatsApp us</p>
                <p className="text-sm text-slate-500">0555322276</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Clock className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Response Time</p>
                <p className="text-sm text-slate-500">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-white text-center text-sm text-slate-500">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} StreamHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}