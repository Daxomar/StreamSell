"use client"

import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Copy, Check, Menu, HelpCircle, Search, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const LIMIT = 10
type Order = {
  reference: string
  subscriptionName: string
  service?: string
  amount: number
  deliveryStatus: string
  credentials?: { loginEmail?: string; loginPassword?: string } | null   // ← was string
  createdAt: string
}

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 border-green-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  failed: "bg-red-100 text-red-700 border-red-200",
}

// Real brand logos (white, for the dark #262626 circle) via simpleicons
const SERVICE_LOGOS: Record<string, string> = {
  "Netflix": "https://cdn.simpleicons.org/netflix/ffffff",
  "Spotify": "https://cdn.simpleicons.org/spotify/ffffff",
  "HBO Max": "https://cdn.simpleicons.org/hbo/ffffff",
  "Disney+": "https://cdn.simpleicons.org/disneyplus/ffffff",
  "YouTube": "https://cdn.simpleicons.org/youtube/ffffff",
}

function getLogo(order: Order): string | null {
  const key =
    order.service ||
    Object.keys(SERVICE_LOGOS).find((s) => order.subscriptionName?.toLowerCase().includes(s.toLowerCase()))
  return key ? SERVICE_LOGOS[key] || null : null
}

function formatCurrency(n: number) {
  return `₵${Number(n || 0).toFixed(2)}`
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

// ── Credentials block — renders the { loginEmail, loginPassword } object ──
function Credentials({ value }: { value?: { loginEmail?: string; loginPassword?: string } | null }) {
  const [shown, setShown] = useState(false)

  if (!value || (!value.loginEmail && !value.loginPassword)) {
    return (
      <div className="text-sm text-slate-400 italic">
        Not delivered yet — you'll receive an SMS when ready.
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-slate-50 border border-slate-200 divide-y divide-slate-200">
      {value.loginEmail && (
        <CredentialRow label="Email" value={value.loginEmail} masked={!shown} />
      )}
      {value.loginPassword && (
        <CredentialRow label="Password" value={value.loginPassword} masked={!shown} />
      )}
      <div className="flex justify-end px-3 py-2">
        <button
          onClick={() => setShown((s) => !s)}
          className="text-xs font-medium text-slate-500 hover:text-[#262626] flex items-center gap-1 transition-colors"
        >
          {shown ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
        </button>
      </div>
    </div>
  )
}

// ── One credential row (label + value + copy) ──
function CredentialRow({ label, value, masked }: { label: string; value: string; masked: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success(`${label} copied`)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy")
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className="text-xs font-medium text-slate-400 w-16 shrink-0">{label}</span>
      <code className="flex-1 text-sm text-slate-800 break-all">
        {masked ? "•".repeat(Math.min(value.length, 20)) : value}
      </code>
      <button onClick={copy} className="text-slate-400 hover:text-[#262626] transition-colors shrink-0" aria-label={`Copy ${label}`}>
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
export default function MyOrdersPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["myOrders", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/transactions/my-orders?page=${page}&limit=${LIMIT}`,
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

  const orders: Order[] = data?.orders || []
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 }
  const noSession = data?.noSession

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/buy/bundlepurchase" className="font-bold text-lg text-slate-900">StreamHub</Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link href="/track-order" className="text-sm font-medium text-slate-600 hover:text-[#262626] flex items-center gap-1">
              <Search className="h-4 w-4" /> Track Order
            </Link>
            <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-[#262626] flex items-center gap-1">
              <HelpCircle className="h-4 w-4" /> Support
            </Link>
          </nav>
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600"><Menu className="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-white">
                <nav className="flex-1 px-4 py-6 space-y-2">
                  <Link href="/track-order" className="block px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100">Track Orders</Link>
                  <Link href="/support" className="block px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-100">Support</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Your recent purchases on this device.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
          </div>
        ) : isError ? (
          <Card className="p-8 text-center text-slate-500">
            Something went wrong loading your orders. Please try again.
          </Card>
        ) : noSession || orders.length === 0 ? (
          <Card className="p-10 text-center">
            <PackageOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-700">No orders on this device yet</p>
            <p className="text-sm text-slate-500 mt-1">Orders you buy on this device will appear here.</p>
            <Link href="/buy/bundlepurchase">
              <Button className="mt-5 bg-[#262626] hover:bg-[#3a3a3a] text-white">Browse Subscriptions</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {orders.map((order) => {
                const logo = getLogo(order)
                return (
                  <Card key={order.reference} className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Brand avatar — rounded #262626 */}
                      <div className="w-11 h-11 rounded-full bg-[#262626] flex items-center justify-center shrink-0">
                        {logo ? (
                          <img src={logo} alt="" className="w-5 h-5" />
                        ) : (
                          <i className="fa-solid fa-play text-white text-lg" />
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 flex-1 min-w-0">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{order.subscriptionName}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{order.reference}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="font-bold text-[#262626]">{formatCurrency(order.amount)}</span>
                          <Badge variant="outline" className={cn("uppercase text-[10px]", STATUS_STYLES[order.deliveryStatus] || STATUS_STYLES.pending)}>
                            {order.deliveryStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500 mb-1.5">Login details</p>
                      <Credentials value={order.credentials} />
                    </div>

                    <p className="text-xs text-slate-400 mt-3">Ordered {formatDate(order.createdAt)}</p>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.pages} · {pagination.total} orders
                </span>
                <div className="flex gap-2 items-center">
                  {isFetching && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}