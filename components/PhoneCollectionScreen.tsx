// components/PhoneCollectionScreen.tsx
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

export function PhoneCollectionScreen() {
  const [phone, setPhone] = useState("")
  const queryClient = useQueryClient()

  const savePhone = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const data = await api("/api/v1/users/me/phone", {
        method: "PATCH",
        body: JSON.stringify({ phoneNumber }),
      })
      if (!data.success) throw new Error(data.message || "Failed to save phone number")
      return data
    },
    onSuccess: () => {
      // refetch the user so the gate sees the new phone and lets them in
      queryClient.invalidateQueries({ queryKey: ["resellerProfile"] })  // match your user query key
      toast.success("Profile completed!")
    },
    onError: (err: any) => toast.error(err.message || "Failed to save"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // basic validation — 10 digits (Ghana)
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number")
      return
    }
    savePhone.mutate(phone)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#262626] rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-phone text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 mt-2 text-sm">
            We need your phone number to send you payouts and order notifications. This is required to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="024 XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#262626] focus:outline-none text-lg tracking-wide"
              required
            />
          </div>

          <button
            type="submit"
            disabled={savePhone.isPending || !phone}
            className="w-full bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savePhone.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}