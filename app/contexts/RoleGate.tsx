"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import VendlyLifeAvater from "../../components/vendly-loader"
export default function RoleGate({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
 const [minTimePassed, setMinTimePassed] = useState(false)

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login")
    }
  }, [isPending, session, router])

useEffect(() => {
  const timer = setTimeout(() => setMinTimePassed(true), 1000)  // minimum 800ms
  return () => clearTimeout(timer)
}, [])



  // Still loading the session
  if (isPending || !minTimePassed){
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <VendlyLifeAvater loading={isPending} />
          <p className="text-gray-600 text-5xl font-bold">
            <span className="inline-flex gap-1 ml-1">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        </div>
      </div>
    )
  }

  // Logged in but wrong role → 404 / access denied
  if (session && !allowedRoles.includes(session.user.role ?? "user")) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">Access Denied</p>
          <p className="text-slate-500 mb-8">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push("/buy")}
            className="px-6 py-2 rounded-lg bg-[#262626] hover:bg-gray-500/30 text-white font-semibold transition"
          >
            Go to Store
          </button>
        </div>
      </div>
    )
  }

  if (!session) return null   // redirecting to login

  return <>{children}</>
}