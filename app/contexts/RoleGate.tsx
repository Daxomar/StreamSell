"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export default function RoleGate({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode
  allowedRoles?: string[]
}) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login")
    }
  }, [isPending, session, router])

  // Still loading the session
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600 mx-auto mb-4" />
          <p className="text-slate-600 text-sm">Verifying access...</p>
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
            className="px-6 py-2 rounded-lg bg-[#05563E] hover:bg-green-700 text-white font-semibold transition"
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