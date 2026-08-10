"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return   // wait for the session to load

    if (!session) {
      router.replace("/auth/login")   // no session → back to login
      return
    }

    // Route based on the role in the session
    const role = session.user.role?.toLowerCase()
    if (role === "admin") router.replace("/admin")
    else router.replace("/reseller")   // resellers (and future fulfillers)
  }, [session, isPending, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      <span className="ml-2 text-slate-600">Signing you in...</span>
    </div>
  )
}