import { z } from "zod"

// The shape + rules for a subscription form.
// Prices are kept as STRINGS here (form inputs give strings), validated as numeric,
// then converted to real numbers at submit time. This keeps input/output types identical.
export const subscriptionSchema = z
  .object({
    subscription_id: z.string().min(1, "Subscription ID is required"),
    name: z.string().min(1, "Name is required"),
    service: z.string().min(1, "Service is required"),
    plan: z.string().optional(),
    duration: z.string().optional(),
    costPrice: z
      .string()
      .min(1, "Cost price is required")
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
    sellingPrice: z
      .string()
      .min(1, "Selling price is required")
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
    recommendedRange: z.string().optional(),
    stock: z.string().optional(),      // kept for Vendly reuse, not sent to StreamHub
    image: z.any().optional(),         // File object, optional, not sent to StreamHub
  })
  // business rule: selling must be >= cost (mirrors the backend guard)
  .refine((data) => Number(data.sellingPrice) >= Number(data.costPrice), {
    message: "Selling price must be ≥ cost price",
    path: ["sellingPrice"],
  })

// One type — input and output are the same (all strings), so no generic juggling.
export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>