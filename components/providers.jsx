

"use client"
//I Added these imports myself
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, useEffect } from "react"

import { Toaster } from "react-hot-toast";
import { UserProvider } from "../app/contexts/UserContext"


export function Providers({ children }) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          cacheTime: 60 * 60 * 1000, // 1 hour
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  )

return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={true} />
      </UserProvider>
    </QueryClientProvider>
  )
}


