"use client"

import { cn } from "@/lib/utils"
import "./theme.css"

export function DashboardShell({
  children,
  header,
  showGrid = true,
  className,
  contentClassName,
}) {
  return (
    <div
      className={cn(
        "liquid-surface liquid-font-body relative min-h-full text-[#03563E]",
        className
      )}
    >
      {showGrid && (
        <div
          className="liquid-grid-bg pointer-events-none absolute inset-0 opacity-60"
          aria-hidden
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C4A962]/5 via-transparent to-[#03563E]/5"
        aria-hidden
      />

      <div className={cn("relative z-10 flex min-h-full flex-col", contentClassName)}>
        {header}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
