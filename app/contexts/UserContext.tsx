"use client"

import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import { useSession } from "@/lib/auth-client"

type UserContextValue = {
  reseller: any
  isLoadingReseller: boolean
  isErrorReseller: boolean
  refetch: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()

  const {
    data: reseller,
    isLoading: isLoadingReseller,
    isError: isErrorReseller,
    refetch,
  } = useQuery({
    queryKey: ["resellerProfile"],
    queryFn: async () => {
      const data = await api("/api/v1/users/me")
      return data.data
    },
    enabled: !!session && !isPending,   // ← ONLY fetch when logged in
    staleTime: 5 * 60 * 1000,
  })

  return (
    <UserContext.Provider value={{ reseller, isLoadingReseller, isErrorReseller, refetch }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within UserProvider")
  return context
}