"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export function SendMessageDialog({ open, onOpenChange, reseller }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  // SMS segment math: 160 chars = 1 segment, then 153 per segment after
  const len = message.length
  const segments = len === 0 ? 0 : len <= 160 ? 1 : Math.ceil(len / 153)

  // TODO: swap this stub for the real backend SMS endpoint later
  const sendMessage = async () => {
    setSending(true)
    try {
      // await api("/api/v1/messages/send", {
      //   method: "POST",
      //   body: JSON.stringify({ phone: reseller.phoneNumber, message }),
      // })
      await new Promise((r) => setTimeout(r, 600)) // simulate
      toast.success(`(stub) Would send to ${reseller.phoneNumber}`)
      setMessage("")
      onOpenChange(false)
    } catch (e) {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send message to {reseller?.name}</DialogTitle>
          <DialogDescription>
            To {reseller?.phoneNumber || "N/A"} via SMS
          </DialogDescription>
        </DialogHeader>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Type your message..."
          className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#262626]/20 resize-none"
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>{len} characters</span>
          <span className={segments > 1 ? "text-amber-600 font-medium" : ""}>
            {segments} segment{segments !== 1 ? "s" : ""}
            {segments > 1 && " (costs more)"}
          </span>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={sendMessage}
            disabled={sending || len === 0}
            className="bg-[#262626] hover:bg-[#3a3a3a] text-white"
          >
            {sending ? "Sending..." : "Send SMS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}