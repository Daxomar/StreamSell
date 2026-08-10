"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { subscriptionSchema, SubscriptionFormValues } from "../../app/admin/subscriptions/subscription.schema"
import { ItemWithButtons } from "@/components/dashboard/itemWithButtons"
import {
  SubscriptionCardDetails,
  SubscriptionCardImage,
  SubscriptionCardService,
  SubscriptionCardPricing,
} from "@/components/dashboard/SubscriptionDetails"
import { api } from "@/lib/api"

type Props = {
  mode: "create" | "edit"
  subscriptionId?: string                    // needed for edit (the DB _id)
  initialData?: Partial<SubscriptionFormValues>   // pre-fill values for edit
}

export function SubscriptionForm({ mode, subscriptionId, initialData }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    // create → empty; edit → pre-filled with initialData
    defaultValues: {
      subscription_id: "", name: "", service: "", plan: "",
      duration: "", costPrice: "", sellingPrice: "", recommendedRange: "", stock: "",
      ...initialData,   // spreads over the empty defaults for edit
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: SubscriptionFormValues) => {
      const payload = {
        subscription_id: data.subscription_id,
        name: data.name,
        service: data.service,
        plan: data.plan,
        duration: data.duration,
        costPrice: Number(data.costPrice),
        sellingPrice: Number(data.sellingPrice),
        recommendedRange: data.recommendedRange,
      }

      // create → POST /create ; edit → PATCH /:id/update
      if (mode === "create") {
        return api("/api/v1/subscriptions/create", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      } else {
        return api(`/api/v1/subscriptions/${subscriptionId}/update`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      }
    },
    onSuccess: () => {
      toast.success(mode === "create" ? "Subscription created" : "Subscription updated")
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] })
      router.push("/admin/subscriptions")
    },
    onError: (error: any) => toast.error(error.message || "Something went wrong"),
  })

  const onSubmit = (data: SubscriptionFormValues) => {
    mutation.mutate(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="min-h-screen bg-slate-50">
          <ItemWithButtons
            isSubmitting={mutation.isPending}
            onBack={() => router.back()}
            submitLabel={mode === "create" ? "Add Subscription" : "Save Changes"}
          />
          <div className="grid md:grid-cols-3 lg:gap-4">
            <div className="md:col-span-2 space-y-4 order-2 md:order-1">
              <SubscriptionCardDetails />
              <SubscriptionCardPricing />
            </div>
            <div className="md:col-span-1 space-y-4 order-1 md:order-2">
              <SubscriptionCardImage />
              <SubscriptionCardService />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}