// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Loader2, CheckCircle2, AlertTriangle, Menu, HelpCircle, Search } from "lucide-react"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { cn, formatCurrency } from "@/lib/utils"
// import Link from "next/link"
// import { useResellerCode } from "@/app/contexts/ResellerCodeContext"
// import toast from "react-hot-toast"
// import { useQuery } from "@tanstack/react-query"

// const PAYSTACK_FEES = 0.03

// // ── Service visual config (icon + color per service) ──
// // Keys should match the `service` value on your subscriptions.
// const SERVICE_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
//   "Netflix":     { icon: "fa-brands fa-square-facebook", color: "#E50914", bg: "bg-red-50 hover:bg-red-100" }, // FA has no netflix icon — see note
//   "Spotify":     { icon: "fa-brands fa-spotify",         color: "#1DB954", bg: "bg-green-50 hover:bg-green-100" },
//   "HBO Max":     { icon: "fa-solid fa-clapperboard",     color: "#8b5cf6", bg: "bg-purple-50 hover:bg-purple-100" },
//   "Disney+":     { icon: "fa-brands fa-disney" as any,   color: "#113CCF", bg: "bg-blue-50 hover:bg-blue-100" },
//   "YouTube":     { icon: "fa-brands fa-youtube",         color: "#FF0000", bg: "bg-red-50 hover:bg-red-100" },
// }
// // fallback for any service without a mapping
// const DEFAULT_SERVICE_STYLE = { icon: "fa-solid fa-play", color: "#262626", bg: "bg-slate-50 hover:bg-slate-100" }

// // ── Types ──
// type Subscription = {
//   _id: string
//   subscription_id: string
//   name: string
//   service: string
//   plan?: string
//   duration?: string
//   imageUrl?: string
//   price: number
//   isActive: boolean
// }

// type PaymentData = { status: string; reference?: string; amount?: number; [key: string]: any }

// export default function BuyPage() {
//   // Flow: 1 = choose service, 2 = choose subscription, 3 = details/pay, 4 = success
//   const [step, setStep] = useState<number>(1)
//   const [selectedService, setSelectedService] = useState<string | null>(null)
//   const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
//   const [customerPhone, setCustomerPhone] = useState("")
//   const [emailAddress, setEmailAddress] = useState("")
//   const [processing, setProcessing] = useState(false)

//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const pathname = usePathname()

//   const [error, setError] = useState<string | null>(null)
//   const [verifying, setVerifying] = useState(false)
//   const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
//   const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

//   const { resellerCode, isLoaded } = useResellerCode()

//   // ── Fetch subscriptions ──
//   const fetchSubscriptions = async (): Promise<Subscription[]> => {
//     const url = resellerCode
//       ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reseller-pricing/public/${resellerCode}`
//       : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reseller-pricing/public`

//     const response = await fetch(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
//     })

//     if (!response.ok) {
//       const err = await response.json().catch(() => ({}))
//       if (response.status === 404) return []
//       throw new Error(err.message || "Failed to fetch subscriptions")
//     }

//     const data = await response.json()
//     if (!data.success) throw new Error(data.message || "Failed to fetch subscriptions")
//     return data.data as Subscription[]
//   }

//   const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
//     queryKey: ["publicSubscriptions", resellerCode],
//     queryFn: fetchSubscriptions,
//     refetchInterval: step <= 2 ? 30000 : false,
//     refetchOnWindowFocus: true,
//     staleTime: 20000,
//     enabled: isLoaded,
//   })

//   // ── Derive unique services from subscriptions ──
//   const services = useMemo(() => {
//     const set = new Set<string>()
//     subscriptions.forEach((s) => s.service && set.add(s.service))
//     return Array.from(set)
//   }, [subscriptions])

//   // ── Subscriptions filtered by the chosen service ──
//   const filteredSubscriptions = useMemo(
//     () => subscriptions.filter((s) => s.service === selectedService),
//     [subscriptions, selectedService]
//   )

//   // ── Verify payment ──
//   const verifyPayment = async (reference: string) => {
//     setVerifying(true)
//     setError(null)
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/paystack/verify/${reference}`,
//         { method: "GET", headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" } }
//       )
//       const data = await response.json()

//       if (response.ok && data.status) {
//         setPaymentStatus(data.data.status)
//         setPaymentData(data.data)
//         setStep(4)
//       } else {
//         setPaymentStatus("failed")
//         setError(data.message || "Payment verification failed")
//         setStep(4)
//       }
//     } catch (err) {
//       console.error("Verification error:", err)
//       setPaymentStatus("error")
//       setError("Unable to verify payment. Please contact support.")
//       setStep(4)
//     } finally {
//       setVerifying(false)
//     }
//   }

//   useEffect(() => {
//     const reference = searchParams.get("reference")
//     if (reference) {
//       router.replace(`/buy/bundlepurchase?resellerCode=${resellerCode}`)
//       verifyPayment(reference)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchParams])

//   const handleServiceSelect = (service: string) => {
//     setSelectedService(service)
//     setStep(2)
//   }

//   const handleSubscriptionSelect = (sub: Subscription) => {
//     setSelectedSubscription(sub)
//     setStep(3)
//   }

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setProcessing(true)
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/paystack/initialize`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: emailAddress,
//           subscriptionId: selectedSubscription?._id,
//           customerPhone: customerPhone,
//           resellerCode: resellerCode,
//           callback_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/buy/bundlepurchase?resellerCode=${resellerCode}`,
//         }),
//       })

//       const data = await response.json()
//       if (!data.status) throw new Error(data.message || "Payment initialization failed")
//       window.location.href = data.data.data.authorization_url
//     } catch (err: any) {
//       console.error("Payment error:", err)
//       toast.error(err.message || "Failed to initialize payment")
//       setProcessing(false)
//     }
//   }

//   const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname?.startsWith(path))

//   const getServiceStyle = (service: string) => SERVICE_STYLES[service] || DEFAULT_SERVICE_STYLE

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="font-bold text-lg text-slate-900">StreamHub</span>
//           </div>
//           <nav className="hidden sm:flex items-center gap-4">
//             <Link href="/track-order" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
//               <Search className="h-4 w-4" /> Track Order
//             </Link>
//             <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-[#262626] transition-colors flex items-center gap-1">
//               <HelpCircle className="h-4 w-4" /> Support
//             </Link>
//           </nav>
//           <div className="sm:hidden">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="text-slate-600">
//                   <Menu className="h-6 w-6" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-72 p-0 bg-white">
//                 <nav className="flex-1 px-4 py-6 space-y-2">
//                   <Link href="/track-order" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/track-order") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
//                     Track Orders
//                   </Link>
//                   <Link href="/support" className={cn("block px-4 py-3 rounded-lg font-medium transition-all", isActive("/support") ? "bg-slate-100 text-[#262626] border-l-4 border-[#262626]" : "text-slate-700 hover:bg-slate-100")}>
//                     Support
//                   </Link>
//                 </nav>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </header>

//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md py-8">
//           {/* Brand + contact */}
//           <Card className="border-0 shadow-none bg-transparent w-full">
//             <CardContent className="p-3 flex items-center justify-between w-full">
//               <div className="flex flex-col items-center gap-2 w-full">
//                 <div className="p-2">
//                   <i className="fa-solid fa-play text-5xl text-[#262626]" />
//                 </div>
//                 <div className="flex gap-4">
//                   <a href="https://wa.me/233555322276?text=Hello%2C%20I%20need%20help%20with%20my%20StreamHub%20order." target="_blank" rel="noopener noreferrer">
//                     <Button size="sm" variant="outline" className="bg-[#262626] hover:bg-[#3a3a3a] text-white">Customer Service</Button>
//                   </a>
//                   <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
//                     <Button size="sm" className="bg-[#262626] hover:bg-[#3a3a3a] text-white">Join For Updates</Button>
//                   </a>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Progress Steps — now 4 */}
//           <div className="flex justify-between mb-8 px-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="flex flex-col items-center gap-2">
//                 <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= i ? "bg-[#262626] text-white" : "bg-slate-200 text-slate-500")}>
//                   {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
//                 </div>
//                 <span className="text-xs text-slate-500 font-medium">
//                   {i === 1 ? "Service" : i === 2 ? "Plan" : i === 3 ? "Details" : "Confirm"}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Delivery info */}
//           <div className="border-2 border-[#262626] rounded-lg p-4 mb-6 bg-slate-50">
//             <p className="text-sm font-semibold text-[#262626]">Delivery Information</p>
//             <p className="text-sm mt-1 text-slate-600">
//               Your subscription details are sent by SMS after payment. Most orders are delivered within <strong>5 mins – 1 hour</strong>. In rare cases of delay it <strong>may</strong> take a little longer — don't worry, it's being processed.
//             </p>
//           </div>

//           {/* Warning */}
//           <div className="border-2 border-red-500 rounded-lg p-4 mb-6 bg-red-50 shadow-md">
//             <p className="text-sm font-bold text-red-700 flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5" /> Warning
//             </p>
//             <p className="text-sm mt-1 text-red-600 font-medium">
//               Report orders not received within <strong>24 hours</strong>. We cannot resolve reports made after 24 hours.
//             </p>
//           </div>

//           <Card className="shadow-xl border-slate-100 ring-0">
//             <CardHeader className="">
//               <CardTitle className="">
//                 {step === 1 && "Choose a Service"}
//                 {step === 2 && `${selectedService} Plans`}
//                 {step === 3 && "Enter Details"}
//                 {step === 4 && "Order Confirmed"}
//               </CardTitle>
//               <CardDescription className="">
//                 {step === 1 && "Which streaming service do you want?"}
//                 {step === 2 && `Available plans for ${selectedService}`}
//                 {step === 3 && "Provide your details to complete the purchase"}
//                 {step === 4 && "Your subscription is on its way!"}
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="">
//               {/* STEP 1 — Choose service */}
//               {step === 1 && (
//                 <div className="space-y-4">
//                   {isLoadingSubscriptions ? (
//                     <div className="flex justify-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
//                     </div>
//                   ) : services.length === 0 ? (
//                     <p className="text-center text-slate-500 py-8">No services available right now.</p>
//                   ) : (
//                     <div className="grid grid-cols-1 gap-3">
//                       {services.map((service) => {
//                         const style = getServiceStyle(service)
//                         return (
//                           <button
//                             key={service}
//                             onClick={() => handleServiceSelect(service)}
//                             className={cn("flex items-center p-4 rounded-xl border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm", style.bg)}
//                           >
//                             <i className={cn(style.icon, "text-2xl mr-3")} style={{ color: style.color }} />
//                             <span className="font-bold text-lg">{service}</span>
//                           </button>
//                         )
//                       })}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* STEP 2 — Choose subscription (filtered by service) */}
//               {step === 2 && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 gap-3">
//                     {filteredSubscriptions.map((sub) => (
//                       <button
//                         key={sub._id}
//                         onClick={() => handleSubscriptionSelect(sub)}
//                         className="flex items-center justify-between p-4 rounded-lg border hover:border-[#262626] hover:bg-slate-50 transition-all bg-white group text-left"
//                       >
//                         <div>
//                           <p className="font-medium group-hover:text-[#262626]">{sub.name}</p>
//                           <p className="text-xs text-slate-500">
//                             {sub.plan ? sub.plan : ""}{sub.plan && sub.duration ? " • " : ""}{sub.duration ? sub.duration : ""}
//                           </p>
//                         </div>
//                         <Badge variant="secondary" className="text-base px-3 py-1">{formatCurrency(sub.price)}</Badge>
//                       </button>
//                     ))}
//                   </div>
//                   <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Back to Services</Button>
//                 </div>
//               )}

//               {/* STEP 3 — Details + payment */}
//               {step === 3 && (
//                 <form onSubmit={handlePayment} className="space-y-6">
//                   <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-500">Service</span>
//                       <span className="font-medium">{selectedService}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-500">Subscription</span>
//                       <span className="font-medium">{selectedSubscription?.name}</span>
//                     </div>
//                     {selectedSubscription?.plan && (
//                       <div className="flex justify-between text-sm">
//                         <span className="text-slate-500">Plan</span>
//                         <span className="font-medium">{selectedSubscription.plan}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-500">Price</span>
//                       <span className="font-medium">{formatCurrency(selectedSubscription?.price || 0)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-500">Fees</span>
//                       <span className="font-medium">{formatCurrency((selectedSubscription?.price || 0) * PAYSTACK_FEES)}</span>
//                     </div>
//                     <div className="border-t pt-2 mt-2 flex justify-between">
//                       <span className="font-bold">Total</span>
//                       <span className="font-bold text-[#262626] text-lg">
//                         {formatCurrency((selectedSubscription?.price || 0) + (selectedSubscription?.price || 0) * PAYSTACK_FEES)}
//                       </span>
//                     </div>
//                   </div>

//                   <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200 flex flex-col items-center justify-center">
//                     <AlertTriangle className="h-6 w-6 text-amber-600" />
//                     <AlertTitle className="text-amber-800 mt-4">Important</AlertTitle>
//                     <AlertDescription className="text-xs leading-relaxed mt-1">
//                       Double-check your phone number below — your subscription credentials are sent there by SMS. The platform is <strong>not responsible</strong> for details sent to a wrong number due to user error. Transactions cannot be reversed once processed.
//                     </AlertDescription>
//                   </Alert>

//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input id="email" type="email" placeholder="example@gmail.com" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="text-lg" required />

//                     <Label htmlFor="phone">Phone Number (receives SMS)</Label>
//                     <Input id="phone" placeholder="024 XXX XXXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="text-lg tracking-widest" required pattern="[0-9]{10}" />
//                   </div>

//                   <div className="flex gap-3">
//                     <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>Back</Button>
//                     <Button type="submit" className="flex-1 bg-[#262626] text-white hover:bg-[#3a3a3a]" disabled={!customerPhone || !emailAddress || processing}>
//                       {processing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>) : "Pay Now"}
//                     </Button>
//                   </div>
//                 </form>
//               )}

//               {/* STEP 4 — Success */}
//               {step === 4 && (
//                 <div className="flex flex-col items-center text-center space-y-4 py-6">
//                   <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-2", paymentStatus === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
//                     <CheckCircle2 className="w-10 h-10" />
//                   </div>
//                   <div className="space-y-1">
//                     <h3 className="font-bold text-xl capitalize">Payment {paymentStatus}!</h3>
//                     {paymentStatus === "success" ? (
//                       <p className="text-slate-500 max-w-[260px] mx-auto">Your {selectedSubscription?.name} subscription is being processed and the details will be sent to {customerPhone} shortly.</p>
//                     ) : (
//                       <p className="text-red-600 max-w-[260px] mx-auto">{error || "Your payment failed. Please try again."}</p>
//                     )}
//                   </div>
//                   <div className="pt-4 w-full">
//                     <Button className="w-full bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold" onClick={() => { setStep(1); setSelectedService(null); setSelectedSubscription(null); setCustomerPhone(""); setEmailAddress(""); setPaymentStatus(null); setError(null); }}>
//                       Buy Another
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }






"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertTriangle, Menu, HelpCircle, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn, formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { useResellerCode } from "@/app/contexts/ResellerCodeContext"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

// remove: const MOOLRE_FEES = 0.03

// add the same fee logic (mirror the backend):
function moolreCollectionFee(amount: number): number {
  const clamp = (amt: number, rate: number, min: number, cap: number) =>
    Math.min(Math.max(amt * rate, min), cap)
  const moolrePart = clamp(amount, 0.01, 0.50, 10)
  const networkPart = clamp(amount, 0.01, 0, 20)
  return moolrePart + networkPart
}

const SERVICE_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  "Netflix": { icon: "fa-brands fa-square-facebook", color: "#E50914", bg: "bg-red-50 hover:bg-red-100" },
  "Spotify": { icon: "fa-brands fa-spotify", color: "#1DB954", bg: "bg-green-50 hover:bg-green-100" },
  "HBO Max": { icon: "fa-solid fa-clapperboard", color: "#8b5cf6", bg: "bg-purple-50 hover:bg-purple-100" },
  "Disney+": { icon: "fa-brands fa-disney" as any, color: "#113CCF", bg: "bg-blue-50 hover:bg-blue-100" },
  "YouTube": { icon: "fa-brands fa-youtube", color: "#FF0000", bg: "bg-red-50 hover:bg-red-100" },
}
const DEFAULT_SERVICE_STYLE = { icon: "fa-solid fa-play", color: "#262626", bg: "bg-slate-50 hover:bg-slate-100" }

type Subscription = {
  _id: string
  subscription_id: string
  name: string
  service: string
  plan?: string
  duration?: string
  imageUrl?: string
  price: number
  isActive: boolean
}

type PaymentData = { status?: string; txstatus?: number; reference?: string; amount?: number;[key: string]: any }

export default function BuyPage() {
  const [step, setStep] = useState<number>(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [customerPhone, setCustomerPhone] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [processing, setProcessing] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const { resellerCode, isLoaded } = useResellerCode()

  // ── Fetch subscriptions ──
  const fetchSubscriptions = async (): Promise<Subscription[]> => {
    const url = resellerCode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reseller-pricing/public/${resellerCode}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reseller-pricing/public`

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      if (response.status === 404) return []
      throw new Error(err.message || "Failed to fetch subscriptions")
    }

    const data = await response.json()
    if (!data.success) throw new Error(data.message || "Failed to fetch subscriptions")
    return data.data as Subscription[]
  }

  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["publicSubscriptions", resellerCode],
    queryFn: fetchSubscriptions,
    refetchInterval: step <= 2 ? 30000 : false,
    refetchOnWindowFocus: true,
    staleTime: 20000,
    enabled: isLoaded,
  })

  const services = useMemo(() => {
    const set = new Set<string>()
    subscriptions.forEach((s) => s.service && set.add(s.service))
    return Array.from(set)
  }, [subscriptions])

  const filteredSubscriptions = useMemo(
    () => subscriptions.filter((s) => s.service === selectedService),
    [subscriptions, selectedService]
  )

  // ── Verify payment (Moolre status check) ──
  const verifyPayment = async (reference: string) => {
    setVerifying(true)
    setError(null)
    try {
    const response = await fetch(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/moolre/verify/${reference}`,
  {
    method: "GET",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    credentials: "include",   // ← stores the Set-Cookie from verify (the device cookie)
  }
)
      const data = await response.json()

      // Moolre verify service returns: { status, reference, txstatus, paid, failed, pending, raw }
      if (response.ok && data.paid) {
        setPaymentStatus("success")
        setPaymentData(data)
        setStep(4)
      } else if (data.failed) {
        setPaymentStatus("failed")
        setError("Payment failed. Please try again.")
        setStep(4)
      } else {
        // pending / unknown — don't call it failed (Moolre's rule)
        setPaymentStatus("pending")
        setPaymentData(data)
        setStep(4)
      }
    } catch (err) {
      console.error("Verification error:", err)
      setPaymentStatus("error")
      setError("Unable to verify payment. Please contact support.")
      setStep(4)
    } finally {
      setVerifying(false)
    }
  }

  // On return from Moolre POS, check for the reference param
  useEffect(() => {
    // Moolre may append externalref or reference — check both
    const reference = searchParams.get("externalref") || searchParams.get("reference")
    if (reference) {
      router.replace(`/buy/bundlepurchase?resellerCode=${resellerCode}`)
      verifyPayment(reference)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleServiceSelect = (service: string) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleSubscriptionSelect = (sub: Subscription) => {
    setSelectedSubscription(sub)
    setStep(3)
  }

  // ── Initialize Moolre payment ──
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/moolre/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({
          email: emailAddress,
          subscriptionId: selectedSubscription?._id,
          customerPhone: customerPhone,
          resellerCode: resellerCode,
          // Moolre server-to-server webhook:
          // callback_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/moolre/webhook`,
          // redirect_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/buy/bundlepurchase?resellerCode=${resellerCode}`,
          callback_url: `https://6071-154-162-23-211.ngrok-free.app/api/v1/payments/moolre/webhook`,
          redirect_url: `http://localhost:3000/buy/bundlepurchase?resellerCode=${resellerCode}`,
        }),
      })

      const data = await response.json()
      if (!data.status) throw new Error(data.message || "Payment initialization failed")

      // Controller returns { status, message, data: <moolre inner data.data> }
      // → data.data.authorization_url
      const authUrl = data.data?.authorization_url
      if (!authUrl) throw new Error("No payment link returned")

      window.location.href = authUrl
    } catch (err: any) {
      console.error("Payment error:", err)
      toast.error(err.message || "Failed to initialize payment")
      setProcessing(false)
    }
  }

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname?.startsWith(path))

  const getServiceStyle = (service: string) => SERVICE_STYLES[service] || DEFAULT_SERVICE_STYLE

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md py-8">
          {/* Brand + contact */}
          <Card className="border-0 shadow-none bg-transparent w-full">
            <CardContent className="p-3 flex items-center justify-between w-full">
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="p-2">
                  <i className="fa-solid fa-play text-5xl text-[#262626]" />
                </div>
                <div className="flex gap-4">
                  <a href="https://wa.me/233555322276?text=Hello%2C%20I%20need%20help%20with%20my%20StreamHub%20order." target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="bg-[#262626] hover:bg-[#3a3a3a] text-white">Customer Service</Button>
                  </a>
                  <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-[#262626] hover:bg-[#3a3a3a] text-white">Join For Updates</Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors", step >= i ? "bg-[#262626] text-white" : "bg-slate-200 text-slate-500")}>
                  {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {i === 1 ? "Service" : i === 2 ? "Plan" : i === 3 ? "Details" : "Confirm"}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div className="border-2 border-[#262626] rounded-lg p-4 mb-6 bg-slate-50">
            <p className="text-sm font-semibold text-[#262626]">Delivery Information</p>
            <p className="text-sm mt-1 text-slate-600">
              Your subscription details are sent by SMS after payment. Most orders are delivered within <strong>5 mins – 1 hour</strong>. In rare cases of delay it <strong>may</strong> take a little longer — don't worry, it's being processed.
            </p>
          </div>

          {/* Warning */}
          <div className="border-2 border-red-500 rounded-lg p-4 mb-6 bg-red-50 shadow-md">
            <p className="text-sm font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Warning
            </p>
            <p className="text-sm mt-1 text-red-600 font-medium">
              Report orders not received within <strong>24 hours</strong>. We cannot resolve reports made after 24 hours.
            </p>
          </div>

          <Card className="shadow-xl border-slate-100 ring-0">
            <CardHeader className="">
              <CardTitle className="">
                {step === 1 && "Choose a Service"}
                {step === 2 && `${selectedService} Plans`}
                {step === 3 && "Enter Details"}
                {step === 4 && "Order Confirmed"}
              </CardTitle>
              <CardDescription className="">
                {step === 1 && "Which streaming service do you want?"}
                {step === 2 && `Available plans for ${selectedService}`}
                {step === 3 && "Provide your details to complete the purchase"}
                {step === 4 && "Your subscription is on its way!"}
              </CardDescription>
            </CardHeader>

            <CardContent className="">
              {/* STEP 1 — Choose service */}
              {step === 1 && (
                <div className="space-y-4">
                  {isLoadingSubscriptions ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
                    </div>
                  ) : services.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No services available right now.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {services.map((service) => {
                        const style = getServiceStyle(service)
                        return (
                          <button
                            key={service}
                            onClick={() => handleServiceSelect(service)}
                            className={cn("flex items-center p-4 rounded-xl border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm", style.bg)}
                          >
                            <i className={cn(style.icon, "text-2xl mr-3")} style={{ color: style.color }} />
                            <span className="font-bold text-lg">{service}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 — Choose subscription */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {filteredSubscriptions.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => handleSubscriptionSelect(sub)}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-[#262626] hover:bg-slate-50 transition-all bg-white group text-left"
                      >
                        <div>
                          <p className="font-medium group-hover:text-[#262626]">{sub.name}</p>
                          <p className="text-xs text-slate-500">
                            {sub.plan ? sub.plan : ""}{sub.plan && sub.duration ? " • " : ""}{sub.duration ? sub.duration : ""}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-base px-3 py-1">{formatCurrency(sub.price)}</Badge>
                      </button>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Back to Services</Button>
                </div>
              )}

              {/* STEP 3 — Details + payment */}
              {step === 3 && (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 border">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Service</span>
                      <span className="font-medium">{selectedService}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Subscription</span>
                      <span className="font-medium">{selectedSubscription?.name}</span>
                    </div>
                    {selectedSubscription?.plan && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Plan</span>
                        <span className="font-medium">{selectedSubscription.plan}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Price</span>
                      <span className="font-medium">{formatCurrency(selectedSubscription?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Fees</span>
                      <span className="font-medium">{formatCurrency(moolreCollectionFee(selectedSubscription?.price || 0))}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-[#262626] text-lg">
                        {formatCurrency((selectedSubscription?.price || 0) + moolreCollectionFee(selectedSubscription?.price || 0))}
                      </span>
                    </div>
                  </div>

                  <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <AlertTitle className="text-amber-800 mt-4">Important</AlertTitle>
                    <AlertDescription className="text-xs leading-relaxed mt-1">
                      Double-check your phone number below — your subscription credentials are sent there by SMS. The platform is <strong>not responsible</strong> for details sent to a wrong number due to user error. Transactions cannot be reversed once processed.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="example@gmail.com" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="text-lg" required />

                    <Label htmlFor="phone">Phone Number (receives SMS)</Label>
                    <Input id="phone" placeholder="024 XXX XXXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="text-lg tracking-widest" required pattern="[0-9]{10}" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setStep(2)}>Back</Button>
                    <Button type="submit" className="flex-1 bg-[#262626] text-white hover:bg-[#3a3a3a]" disabled={!customerPhone || !emailAddress || processing}>
                      {processing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>) : "Pay Now"}
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 4 — Result */}
              {step === 4 && (
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-2",
                    paymentStatus === "success" ? "bg-green-100 text-green-600"
                      : paymentStatus === "pending" ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-600")}>
                    {paymentStatus === "pending"
                      ? <Loader2 className="w-10 h-10 animate-spin" />
                      : <CheckCircle2 className="w-10 h-10" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl capitalize">
                      {paymentStatus === "success" ? "Payment Successful!"
                        : paymentStatus === "pending" ? "Payment Processing"
                          : "Payment Failed"}
                    </h3>
                    {paymentStatus === "success" ? (
                      <p className="text-slate-500 max-w-[260px] mx-auto">Your {selectedSubscription?.name} subscription is being processed and the details will be sent to {customerPhone} shortly.</p>
                    ) : paymentStatus === "pending" ? (
                      <p className="text-amber-600 max-w-[260px] mx-auto">Your payment is being confirmed. If you completed it, your details will arrive by SMS shortly.</p>
                    ) : (
                      <p className="text-red-600 max-w-[260px] mx-auto">{error || "Your payment failed. Please try again."}</p>
                    )}
                  </div>
                  <div className="pt-4 w-full">
                    <Button className="w-full bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold" onClick={() => { setStep(1); setSelectedService(null); setSelectedSubscription(null); setCustomerPhone(""); setEmailAddress(""); setPaymentStatus(null); setError(null); }}>
                      Buy Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}