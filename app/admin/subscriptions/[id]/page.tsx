"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { SubscriptionForm } from "@/components/dashboard/SubscriptionForm"

export default function EditSubscriptionPage() {
  const params = useParams()
  const id = params.id as string   // the [id] from the URL

  // 1. Fetch the subscription to edit
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscription", id],
    queryFn: () => api(`/api/v1/subscriptions/${id}`),  // needs a get-by-id endpoint
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    )
  }

  if (isError || !data?.data) {
    return <div className="p-6 text-red-500">Subscription not found.</div>
  }

  const sub = data.data

  // 2. Map the fetched subscription → form values (strings, since inputs are strings)
  const initialData = {
    subscription_id: sub.subscription_id ?? "",
    name: sub.name ?? "",
    service: sub.service ?? "",
    plan: sub.plan ?? "",
    duration: sub.duration ?? "",
    costPrice: String(sub.costPrice ?? ""),       // number → string for the form
    sellingPrice: String(sub.sellingPrice ?? ""), // number → string
    recommendedRange: sub.recommendedRange ?? "",
    stock: "",
  }

  // 3. Render the shared form in edit mode, pre-filled
  return <SubscriptionForm mode="edit" subscriptionId={id} initialData={initialData} />
}