"use client"

import * as React from "react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Item, ItemContent } from "@/components/ui/item"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const inputStyles = `w-full h-full px-4 py-3 rounded-xl border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 resize-none font-normal placeholder:text-gray-500 transition-all`

// ============================================
// CARD ONE — Subscription Details
// ============================================
export function SubscriptionCardDetails({ className }: { className?: string }) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className={cn("grid w-full space-y-4 bg-[#F9F9F9]", className)}>
      <Card className="gap-4 border-none">
        <CardHeader className="">
          <CardTitle className="">Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Subscription Name</Label>
              <Input id="name" {...register("name")} placeholder="Netflix Premium 1 Month" className={inputStyles} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subscription_id">Subscription ID</Label>
              <Input id="subscription_id" {...register("subscription_id")} placeholder="SUB-NETFLIX-1M" className={inputStyles} />
              {errors.subscription_id && <p className="text-xs text-red-500">{errors.subscription_id.message as string}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="plan">Plan</Label>
              <Input id="plan" {...register("plan")} placeholder="Premium 4K" className={inputStyles} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" {...register("duration")} placeholder="1 month" className={inputStyles} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportDevice">Support Device</Label>
              <Input id="supportDevice" {...register("supportDevice")} placeholder="Smart TV, Mobile, Desktop" className={inputStyles} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// CARD TWO — Image Upload (OPTIONAL)
// ============================================
export function SubscriptionCardImage({ className }: { className?: string }) {
  const { setValue, watch } = useFormContext()
  const image = watch("image")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert("Image must be less than 5MB"); return }
    if (!file.type.startsWith("image/")) { alert("Please select a valid image"); return }
    setValue("image", file)
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setValue("image", null)
    setPreviewUrl(null)
  }

  return (
    <div className={cn("grid w-full space-y-4 bg-[#F9F9F9]", className)}>
      <Card className="w-full gap-4 border-none">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            Upload Image <span className="text-xs font-normal text-slate-400">(optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="w-full h-80 bg-slate-50 rounded-xl border-2 border-slate-200/50 mb-6 relative flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Subscription" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <p className="text-sm text-slate-400">No image selected</p>
            )}
            {image && (
              <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 transition-colors">
              <p className="text-sm font-medium text-slate-600">{image ? "Change image" : "Upload image (optional)"}</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// CARD THREE — Service
// ============================================
export function SubscriptionCardService({ className }: { className?: string }) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className={cn("grid w-full space-y-4 bg-[#F9F9F9]", className)}>
      <Card className="w-full gap-4 border-none">
        <Item>
          <ItemContent className="space-y-4">
            <CardTitle className="">Service</CardTitle>
            <div className="grid gap-4">
              <Label htmlFor="service">Streaming Service</Label>
              <Input id="service" {...register("service")} placeholder="Netflix" className={inputStyles} />
              {errors.service && <p className="text-xs text-red-500">{errors.service.message as string}</p>}
            </div>
          </ItemContent>
        </Item>
      </Card>
    </div>
  )
}

// ============================================
// CARD FOUR — Pricing (stock grayed out)
// ============================================
export function SubscriptionCardPricing({ className }: { className?: string }) {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className={cn("w-full space-y-4 bg-[#F9F9F9]", className)}>
      <Card className="w-full gap-4 border-none">
        <CardHeader className="">
          <CardTitle className="">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-2 gap-4">
            <Item>
              <ItemContent className="space-y-4">
                <div className="grid gap-4">
                  <Label htmlFor="costPrice">Cost Price (GHS)</Label>
                  <Input id="costPrice" type="number" step="0.01" {...register("costPrice")} placeholder="45.00" className={inputStyles} />
                  {errors.costPrice && <p className="text-xs text-red-500">{errors.costPrice.message as string}</p>}
                </div>
              </ItemContent>
            </Item>

            <Item>
              <ItemContent className="space-y-4">
                <div className="grid gap-4">
                  <Label htmlFor="sellingPrice">Selling Price (GHS)</Label>
                  <Input id="sellingPrice" type="number" step="0.01" {...register("sellingPrice")} placeholder="60.00" className={inputStyles} />
                  {errors.sellingPrice && <p className="text-xs text-red-500">{errors.sellingPrice.message as string}</p>}
                </div>
              </ItemContent>
            </Item>

            <Item>
              <ItemContent className="space-y-4">
                <div className="grid gap-4">
                  <Label htmlFor="recommendedRange">Recommended Selling Range</Label>
                  <Input id="recommendedRange" {...register("recommendedRange")} placeholder="60 - 75" className={inputStyles} />
                </div>
              </ItemContent>
            </Item>

            {/* STOCK — grayed out (kept for Vendly reuse) */}
            <Item>
              <ItemContent className="space-y-4">
                <div className="grid gap-4">
                  <Label htmlFor="stock" className="text-slate-400">Stock <span className="text-xs">(not used)</span></Label>
                  <Input id="stock" type="number" {...register("stock")} placeholder="—" disabled className={cn(inputStyles, "opacity-50 cursor-not-allowed")} />
                </div>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}