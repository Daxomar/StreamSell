"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import toast from "react-hot-toast"

export function FulfillDialog({ order, open, onOpenChange, onSuccess }) {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [extraInfo, setExtraInfo] = useState("")

  // reset on open
  useEffect(() => {
    if (open) { setLoginEmail(""); setLoginPassword(""); setExtraInfo("") }
  }, [open])

  const fulfillMutation = useMutation({
    mutationFn: () =>
      api(`/api/v1/transactions/${order.reference}/deliver`, {
        method: "PATCH",
        body: JSON.stringify({
          deliveryStatus: "delivered",   // backend will save creds + SMS + mark processing
          credentials: { loginEmail, loginPassword, extraInfo },
        }),
      }),
    onSuccess: () => {
      toast.success("Credentials sent — order marked processing")
      onSuccess?.()
    },
    onError: (err) => toast.error(err.message || "Fulfillment failed"),
  })

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fulfill: {order.subscriptionName}</DialogTitle>
          <DialogDescription>Deliver to {order.customerPhone}</DialogDescription>
        </DialogHeader>

        {/* Order context (read-only) */}
        <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Subscription</span><span className="font-medium">{order.subscriptionName}</span></div>
          {order.plan && <div className="flex justify-between"><span className="text-slate-500">Plan</span><span className="font-medium">{order.plan}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">Reference</span><span className="font-mono text-xs">{order.reference}</span></div>
        </div>

        {/* Credential inputs */}
        <div className="space-y-3">
          <div className="grid gap-1.5">
            <Label htmlFor="loginEmail">Login Email</Label>
            <Input id="loginEmail" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="account@service.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="loginPassword">Login Password</Label>
            <Input id="loginPassword" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="password" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="extraInfo">Extra Info (optional)</Label>
            <Input id="extraInfo" value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} placeholder="e.g. Use profile 2, PIN 1234" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={fulfillMutation.isPending}>Cancel</Button>
          <Button
            className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
            onClick={() => fulfillMutation.mutate()}
            disabled={fulfillMutation.isPending || !loginEmail || !loginPassword}
          >
            {fulfillMutation.isPending ? "Sending..." : "Deliver & Send SMS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}