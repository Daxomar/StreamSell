// components/ProfileCompletionGate.tsx (or in your contexts folder)
"use client"

import { useUser } from "@/app/contexts/UserContext"
import { PhoneCollectionScreen } from "../../components/PhoneCollectionScreen"
import { Loader2 } from "lucide-react"

export default function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  const { reseller, isLoadingReseller } = useUser()

  // While loading the profile, show a loader (don't flash the collection screen)
  if (isLoadingReseller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#262626]" />
      </div>
    )
  }

  // Profile loaded but no phone → force collection before the app
  if (reseller && !reseller.phoneNumber) {
    return <PhoneCollectionScreen />
  }

  // Phone present (or still resolving) → render the app
  return <>{children}</>
}