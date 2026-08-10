"use client"

import { cn } from "@/lib/utils"

export function DataPanel({
  title,
  description,
  children,
  actions,
  className,
  contentClassName,
}) {
  return (
    <section
      className={cn(
        "liquid-panel overflow-hidden rounded-xl",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-1 border-b border-[#03563E]/8 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="liquid-font-display text-lg font-semibold text-[#03563E]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[#03563E]/60">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className={cn("px-6 py-5", contentClassName)}>{children}</div>
    </section>
  )
}
