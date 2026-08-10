"use client"

import { useState } from "react"
import { Copy, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ReferralLinkCard({
  link,
  label = "Your Referral Link",
  isLoading = false,
  className,
  onCopy,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!link || isLoading) return

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      onCopy?.(link)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className={cn(
        "liquid-referral-card flex w-full min-w-0 items-center gap-3 rounded-xl p-4 md:w-auto",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-[#03563E]/70">{label}</p>
        <div className="flex w-full items-center gap-2 rounded-md border border-[#03563E]/10 bg-white/80 px-3 py-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#03563E]/40" />
          ) : (
            <code className="flex-1 truncate text-sm text-[#03563E]/85">{link || "—"}</code>
          )}
        </div>
      </div>

      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={handleCopy}
        disabled={isLoading || !link}
        className={cn(
          "shrink-0 border-[#03563E]/15 text-[#03563E] hover:bg-[#03563E]/5",
          copied && "border-[#03563E] bg-[#03563E] text-white hover:bg-[#03563E]/90"
        )}
        aria-label={copied ? "Link copied" : "Copy referral link"}
      >
        {copied ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
