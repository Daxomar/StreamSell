



"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Zap, LogOut, User, Menu, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Imports
// import { UserProvider, useUser } from "../contexts/UserContext"
// import {AuthProvider, useAuth } from "../contexts/AuthContext"
import { UserProvider, useUser } from "../contexts/UserContext"
// import { fetchWithAuth } from "@/lib/utility/fetchWithAuth"
import RoleGate from "../contexts/RoleGate"
import ProfileCompletionGate from "../contexts/ProfileCompletionGate"
import toast from "react-hot-toast"
import DevModeBadge from "@/components/environmentbadge/devmodebadge"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "../../lib/auth-client"


// ✅ Renamed to ResellerLayoutContent
function ResellerLayoutContent({ children }) {

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const handleLogout = async () => {
    try {
      await signOut()
      queryClient.clear()               // wipe cached user data (no stale flash)
      toast.success("Logged out")
      router.push("/auth/login")        // explicit redirect (wins the race, no flicker)
    } catch (err) {
      console.error(err)
      toast.error("Logout failed")
    }
  }

  const pathname = usePathname()
  const { reseller, isLoadingReseller, isErrorReseller } = useUser()
  console.log("Called By ResellerLayoutContent:", reseller)

  const isActive = (path) => {
    if (path === "/reseller") {
      return pathname === "/reseller"
    }
    return pathname?.startsWith(path)
  }

  const navLinks = [
    { href: "/reseller", label: "Dashboard" },
    { href: "/reseller/pricing", label: "Pricing" },
    { href: "/reseller/earnings", label: "Earnings" },
    { href: "/reseller/support", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/reseller" className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:opacity-80 transition-opacity">

            <img src="/logo.jpg" alt="Logo" className="w-12 h-12 " />

            <div>
              <span className="block">JoyBundle</span>
              <span className="text-xs text-slate-500 font-normal">Reseller</span>
            </div>
          </Link>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className=" ">
              <DevModeBadge />
            </div>


            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="h-8 w-px bg-slate-200 hidden md:block" />


            {/* User Profile Section */}
            <div className="flex items-center gap-3">
              {isLoadingReseller ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{reseller?.name || "User"}</p>
                    <p className="text-xs text-slate-500">{reseller?.resellerCode || "---"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-semibold shadow-sm">
                    {reseller?.name?.charAt(0) || <User className="h-5 w-5" />}
                  </div>
                </>
              )}

              {/* Desktop Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 hidden md:flex transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-600">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0 bg-white">
                    <div className="flex flex-col h-full">
                      {/* User Info */}
                      <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 px-6 py-6 border-b border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                            {reseller?.name?.charAt(0) || <User className="h-6 w-6" />}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{reseller?.name || "User"}</p>
                            <p className="text-xs text-slate-600">ID: {reseller?.resellerCode || "---"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <nav className="flex-1 px-4 py-6 space-y-2">
                        {navLinks.map((link) => (
                          <SheetClose asChild key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "block px-4 py-3 rounded-lg font-medium transition-all",
                                isActive(link.href)
                                  ? "bg-blue-50 text-cyan-500 border-l-4 border-cyan-500 hover:text-white hover:bg-cyan-600"
                                  : "text-slate-700 hover:bg-slate-100"
                              )}
                            >
                              {link.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </nav>

                      {/* Logout Button */}
                      <div className="border-t border-slate-200 p-4">
                        <SheetClose asChild>
                          <Button
                            onClick={handleLogout}
                            className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                            variant="ghost"
                          >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                          </Button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

// ✅ Main layout component wraps with UserProvider
export default function ResellerLayout({ children }) {

  console.log("ResellerLayout rendered")

  return (
    <UserProvider>
      <RoleGate allowedRoles={["user"]}>
        <ProfileCompletionGate>
          <ResellerLayoutContent>{children}</ResellerLayoutContent>
        </ProfileCompletionGate>
      </RoleGate>
    </UserProvider>
  )
}