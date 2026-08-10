"use client"

import Link from "next/link"
import { Mail, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LiquidCommerceFooter() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="w-full text-white bg-[#F6F4ED] ">
      <div className="relative  overflow-hidden rounded-t-[3rem] bg-[#03563E] text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#03563E]/20 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-[#C4A962]/15 blur-2xl" />
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-16 md:py-20 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/10 p-4">
                <Mail className="h-8 w-8 text-[#C4A962]" />
              </div>
            </div>
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-4xl font-bold">
              Join Our Community
            </h2>
            <p className="mb-8 text-white/70">
              Get exclusive access to new arrivals, secret sales, and sourcing stories from Vendly.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 rounded-full bg-white/10 px-6 py-3 text-white placeholder-white/50 outline-none transition-all hover:bg-white/15 focus:bg-white/20 focus:ring-2 focus:ring-[#C4A962]"
              />
              <Button
                onClick={handleSubscribe}
                className="rounded-full bg-[#C4A962] px-8 font-semibold text-[#03563E] hover:bg-[#D4B570] transition-colors"
              >
                {subscribed ? "✓ Joined" : "Join"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <img src="/v.svg" alt="Vendly" className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">Vendly</span>
            </div>
            <p className="mb-6 text-sm text-white/70">
              Premium Quality Products For Less. Empowering vendors across Ghana with reseller networks.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="#instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C4A962] hover:text-[#03563E]"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C4A962] hover:text-[#03563E]"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C4A962] hover:text-[#03563E]"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="mb-6 font-[family-name:var(--font-display)] text-lg font-bold">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#all-products" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#categories" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="#reseller-program" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Reseller Program
                </Link>
              </li>
              <li>
                <Link href="#new-arrivals" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div>
            <h3 className="mb-6 font-[family-name:var(--font-display)] text-lg font-bold">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#contact" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#track-order" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link href="#shipping-info" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#returns" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="mb-6 font-[family-name:var(--font-display)] text-lg font-bold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#about" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-white/70 transition-colors hover:text-[#C4A962]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 border-b border-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Vendly. Built for vendors across Ghana.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#privacy" className="text-white/60 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="#terms" className="text-white/60 transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="#contact" className="text-white/60 transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
