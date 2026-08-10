

"use client"

import { Loader2, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { DashboardShell } from "@/components/dashboard"
import { liquidDisplay, liquidBody } from "@/components/dashboard/fonts"
import "@/components/dashboard/theme.css"

// Auth & Context imports
import { UserProvider, useUser } from "../contexts/UserContext"
import { TransactionProvider } from "../contexts/TransactionContext"
import RoleGate from "../contexts/RoleGate"
import { api } from "../../lib/api"
import toast from "react-hot-toast"
import { useTheme } from "next-themes"


// Header Component
function DashboardHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { reseller, isLoadingReseller } = useUser()


  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean) // Remove empty strings

    return paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/")
      const label = path
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return { label, href }
    })
  }

  const breadcrumbs = getBreadcrumbs()


  const handleLogout = async () => {
    try {
      const res = await api(`/auth/sign-out`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Logged out successfully');
        window.location.href = '/auth/login';
      } else {
        toast.error('Logout failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
    }
  };

  return (
    <header className="liquid-font-body sticky left-0 top-0 z-20 flex h-16 w-full shrink-0 items-center gap-2 border-b border-[#C4A962]/25 bg-[#262626] px-4 text-white shadow-[inset_0_1px_0_rgba(196,169,98,0.12)]">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-white hover:bg-[#C4A962]/15" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-[#C4A962]/40" />

        <Breadcrumb>
          <BreadcrumbList className="text-white">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-white hover:text-[#C4A962]">
            
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbItem key={crumb.href} className="text-white">
                <BreadcrumbSeparator className="" />

                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="text-white font-semibold">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="text-white font-semibold hover:text-white/80"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-4 text-white font-semibold">
        {isLoadingReseller ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-white/70" />
          </div>
        ) : null}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-white hover:bg-[#C4A962]/15"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-white" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-white hover:bg-[#C4A962]/15"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  )
}

// Main Layout Content
function AdminLayoutContent({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        {/* <DashboardShell
          className={`${liquidDisplay.variable} ${liquidBody.variable} min-h-svh`}
          header={<DashboardHeader />}
        > */}
        <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        {/* </DashboardShell> */}
      </SidebarInset>
    </SidebarProvider>
  )
}

// Main Layout with Providers
export default function AdminLayout({ children }) {
  return (
  
      <UserProvider>
        <RoleGate allowedRoles={["admin",]}>
          <TransactionProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </TransactionProvider>
        </RoleGate>
      </UserProvider>
 
  )
}