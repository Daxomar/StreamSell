"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useState } from "react"

export function LanderNav({
  theme = "light",
  registerHref = "/vendor-auth/register",
  loginHref = "/vendor-auth/login",
  galleryHref = "/vendor-landers",
  accentClass = "text-[#03563E]",
  ctaClass = "bg-[#03563E] hover:bg-[#024a34] text-white",
  logoClass = "text-[#03563E]",
}) {
  const [open, setOpen] = useState(false)
  const isDark = theme === "dark" || theme === "neon"

  const textMuted = isDark ? "text-white/60 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
  const border = isDark ? "border-white/10 bg-black/80" : "border-neutral-200 bg-white/90"
  const logoColor = theme === "neon" ? "text-[#00FF88]" : isDark ? "text-white" : logoClass

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur ${border}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={galleryHref} className={`flex items-center gap-2 font-bold text-xl ${logoColor}`}>
          <img src="/v.svg" alt="Vendly" className="h-7 w-7" />
          Vendly
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={galleryHref} className={`text-sm font-medium ${textMuted} transition-colors`}>
            All Variations
          </Link>
          <Link href={loginHref} className={`text-sm font-medium ${textMuted} transition-colors`}>
            Vendor Login
          </Link>
          <Link href={registerHref}>
            <Button size="sm" className={`rounded-full px-5 font-semibold ${ctaClass}`}>
              Become a Vendor
            </Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isDark ? "text-white" : ""}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className={isDark ? "bg-neutral-950 text-white border-white/10" : "bg-white"}>
              <nav className="mt-8 flex flex-col gap-3">
                <SheetClose asChild>
                  <Link href={galleryHref} className="rounded-lg px-4 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-white/5">
                    All Variations
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={loginHref} className="rounded-lg px-4 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-white/5">
                    Vendor Login
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={registerHref}>
                    <Button className={`mt-2 w-full rounded-full ${ctaClass}`}>Become a Vendor</Button>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
