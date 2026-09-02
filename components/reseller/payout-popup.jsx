
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { api } from "../../lib/api"
// import { fetchWithAuth } from "@/lib/utility/fetchWithAuth"

// Payout validation schema
const payoutSchema = z.object({
  network: z.string().min(1, "Please select a network"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  accountName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 10, {
      message: "Minimum payout amount is GHS 10.00",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function PayoutPopup({ availableBalance = 0, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(payoutSchema),
    mode: "onChange",
    defaultValues: {
      network: "",
      phoneNumber: "",
      accountName: "",
      amount: "",
      password: "",
    },
  })

  const payoutMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api(`/payout/request`, {
        method: "POST",
        body: JSON.stringify({
          network: data.network,
          phoneNumber: data.phoneNumber,
          accountName: data.accountName,
          amount: parseFloat(data.amount),
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to request payout")
      }

      if (!result.success) {
        throw new Error(result.message || "Failed to request payout")
      }

      return result
    },
    onSuccess: (data) => {
      toast.success("Payout request submitted successfully")
      
      // Optimized query invalidation - only invalidate what's needed
      queryClient.invalidateQueries({ 
        queryKey: ["recentPayouts"],
        refetchType: 'active' // Only refetch if component is mounted
      })
      queryClient.invalidateQueries({ 
        queryKey: ["userData"],
        refetchType: 'active'
      })
      queryClient.invalidateQueries({ 
        queryKey: ["resellerData"],
        refetchType: 'active'
      })

      if (onSuccess) {
        onSuccess(data)
      }

      setTimeout(() => {
        setOpen(false)
        reset()
        setSelectedNetwork("")
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to request payout")
    },
  })

  const watchAmount = watch("amount")
  const payoutCharge =
    watchAmount && parseFloat(watchAmount) > 0
      ? parseFloat(watchAmount) * 0.015
      : 0
  const netAmount =
    watchAmount && parseFloat(watchAmount) > 0
      ? parseFloat(watchAmount) - payoutCharge
      : 0

  const onSubmit = (data) => {
    if (parseFloat(data.amount) > availableBalance) {
      toast.error(
        `Insufficient Balance. Available: GHS ${availableBalance.toFixed(2)}`
      )
      return
    }

    payoutMutation.mutate(data)
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
      setSelectedNetwork("")
      payoutMutation.reset()
    }
  }

  const handleNetworkChange = (value) => {
    setSelectedNetwork(value)
    setValue("network", value, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold"
          type="button"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        {payoutMutation.isSuccess ? (
          // Success State
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Payout Requested!
            </h3>
            <p className="text-slate-500 text-center px-4">
              Your payout request has been submitted successfully. You will receive{" "}
              <span className="font-semibold text-green-600">
                GHS {netAmount.toFixed(2)}
              </span>{" "}
              within 24-48 hours.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl">Request Payout</DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                Available balance:{" "}
                <span className="font-semibold text-green-600">
                  GHS {availableBalance.toFixed(2)}
                </span>
              </p>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 pt-4"
            >
              {/* Network Selection */}
              <div className="space-y-2">
                <Label htmlFor="network" className="text-sm font-medium">
                  Network <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedNetwork}
                  onValueChange={handleNetworkChange}
                >
                  <SelectTrigger
                    className={`w-full h-11 ${
                      errors.network ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN">MTN Mobile Money</SelectItem>
                    <SelectItem value="AirtelTigo">AirtelTigo Money</SelectItem>
                    <SelectItem value="Vodafone">Vodafone Cash</SelectItem>
                  </SelectContent>
                </Select>
                {errors.network && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.network.message}
                  </p>
                )}
              </div>

              {/* Name on Wallet */}
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-sm font-medium">
                  Name on Wallet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="JAMES ASARE"
                  {...register("accountName")}
                  className={`h-11 ${
                    errors.accountName
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.accountName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.accountName.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Must match the name registered on your mobile money account
                </p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g. 0241234567"
                  {...register("phoneNumber")}
                  className={`h-11 ${
                    errors.phoneNumber
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (GHS) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="10"
                  max={availableBalance}
                  placeholder="Enter amount"
                  {...register("amount")}
                  className={`h-11 ${
                    errors.amount ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Payout Charge Notice */}
              {watchAmount && parseFloat(watchAmount) > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-800">
                        Payout Breakdown
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        A 1.5% processing fee will be deducted from your
                        requested amount.
                      </p>
                      <div className="mt-3 pt-3 border-t border-amber-200 space-y-1">
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Requested Amount:</span>
                          <span>GHS {parseFloat(watchAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>Processing Fee (1.5%):</span>
                          <span>- GHS {payoutCharge.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-amber-900 pt-1 border-t border-amber-200">
                          <span>You will receive:</span>
                          <span>GHS {netAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`h-11 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  Enter your account password to confirm this request
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={() => setOpen(false)}
                  disabled={payoutMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-green-500 hover:bg-green-600"
                  disabled={!isValid || payoutMutation.isPending}
                >
                  {payoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Request Payout"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}