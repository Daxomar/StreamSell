"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { motion } from "framer-motion"

export function PremiumLightNav({ accent = "#03563E", registerHref = "/vendor-auth/register", loginHref = "/vendor-auth/login" }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "border-b border-black/[0.06] bg-white/80 shadow-sm backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/vendor-landers" className="group flex items-center gap-2.5">
          <motion.div  transition={{ duration: 0.5 }} className="relative">
            <img src="/v.svg" alt="Vendly" className="h-8 w-8" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight" style={{ color: accent }}>Vendly</span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-16 md:flex ">
          <Link href="/" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Home
          </Link>
          <Link href="about" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            About
          </Link>
          <Link href="contact" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Contact
          </Link>
          <Link href="features" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Pricing
          </Link>
          <Link href="FAQ" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            FAQ
          </Link>
        </nav>

        <div className="hidden items-center gap-8 md:flex">
          {/* <Link href="/vendor-landers" className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Variations
          </Link> */}
          <Link href={loginHref} className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900">
            Sign in
          </Link>
          <Link href={registerHref}>
            <Button
              className="rounded-full px-6 font-semibold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: accent, boxShadow: `0 8px 30px ${accent}40` }}
            >
              Become a Vendor
            </Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="mt-8 flex flex-col gap-3">
                <SheetClose asChild><Link href="/" className="rounded-lg px-4 py-3 font-medium">Home</Link></SheetClose>
                <SheetClose asChild><Link href="#about" className="rounded-lg px-4 py-3 font-medium">About</Link></SheetClose>
                <SheetClose asChild><Link href="#contact" className="rounded-lg px-4 py-3 font-medium">Contact</Link></SheetClose>
                <SheetClose asChild><Link href="#features" className="rounded-lg px-4 py-3 font-medium">Features</Link></SheetClose>
                <SheetClose asChild><Link href="#pricing" className="rounded-lg px-4 py-3 font-medium">Pricing</Link></SheetClose>
                <SheetClose asChild><Link href="#faq" className="rounded-lg px-4 py-3 font-medium">FAQ</Link></SheetClose>
                <SheetClose asChild><Link href="/vendor-landers" className="rounded-lg px-4 py-3 font-medium">Variations</Link></SheetClose>
                <SheetClose asChild><Link href={loginHref} className="rounded-lg px-4 py-3 font-medium">Sign in</Link></SheetClose>
                <SheetClose asChild>
                  <Link href={registerHref}>
                    <Button className="mt-2 w-full rounded-full text-white" style={{ backgroundColor: accent }}>Become a Vendor</Button>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
