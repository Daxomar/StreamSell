"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  Shield,
  FileText,
  Settings,
  CreditCard,
  Truck,
  Command,
  Eye,
  Store,
  TrendingUp,
  Wallet
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "../app/contexts/UserContext"
import { useSession } from "@/lib/auth-client"
import DevModeBadge from "@/components/environmentbadge/devmodebadge"

export function AppSidebar({ ...props }) {
  const { reseller } = useUser()
  const {data:session} = useSession()
  const role = session?.user?.role

console.log("SESSION:", session)
console.log("USER:", session?.user)
console.log("ROLE:", session?.user?.role)

  // Get base route based on role
const getBaseRoute = () => {
  console.log("SESSION:", session)
  console.log("ROLE:", role)
  switch (role) {
    case "admin":
      return "/admin"
    case "manager":
      return "/manager"
    case "reseller":
      return "/reseller"
    default:
      return "/reseller"
  }
}

  const baseRoute = getBaseRoute()

  // Admin Navigation
  const adminNav = [
    {
      title: "Core",
      items: [
        {
          title: "Overview",
          url: `${baseRoute}`,
          icon: LayoutDashboard,
          items: [
            { title: "Dashboard Stats", url: `${baseRoute}/stats` },
            { title: "Revenue Report", url: `${baseRoute}/revenue` },
          ],
        },
        {
          title: "Vendors",
          url: `${baseRoute}/vendors`,
          icon: Store,
          items: [
            { title: "All Vendors", url: `${baseRoute}/vendors` },
            { title: "Pending Approval", url: `${baseRoute}/vendors/pending` },
          ],
        },
        {
          title: "Resellers",
          url: `${baseRoute}/resellers`,
          icon: Users,
          items: [
            { title: "All Resellers", url: `${baseRoute}/resellers` },
            { title: "Reseller Performance", url: `${baseRoute}/resellers/performance` },
          ],
        },
        {
          title: "Transactions",
          url: `${baseRoute}/transactions`,
          icon: FileText,
          items: [
            { title: "Transaction Log", url: `${baseRoute}/transactions/log` },
            { title: "Failed Transactions", url: `${baseRoute}/transactions/failed` },
          ],
        },
        //Will Remove this for only vendors later
              {
          title: "Payouts",
          url: `${baseRoute}/confirm-payment`,
          icon: Wallet,
          items: [
            { title: "Request Payout", url: `${baseRoute}/confirm-payment/pending` },
            { title: "Payout History", url: `${baseRoute}/confirm-payment/history` },
            { title: "Bank Details", url: `${baseRoute}/confirm-payment/bank` },
          ],
        },
        {
          title: "Orders",
          url: `${baseRoute}/orders`,
          icon: ShoppingCart,
          items: [
            { title: "Pending Orders", url: `${baseRoute}/orders/pending` },
            { title: "Order History", url: `${baseRoute}/orders/history` },
          ],
        },
      ],
    },
    {
      title: "Management",
      items: [
         {
          title: "Subscriptions",
          url: `${baseRoute}/bundles`,
          icon: Package,
          items: [
            { title: "All Subscription", url: `${baseRoute}/bundles` },
            { title: "Create Subscription", url: `${baseRoute}/bundles/new` },
            { title: "Pricing", url: `${baseRoute}/bundles/pricing` },
          ],
        },
        {
          title: "Complaints",
          url: `${baseRoute}/complaints`,
          icon: AlertCircle,
          items: [
            { title: "Open Complaints", url: `${baseRoute}/complaints/open` },
            { title: "Resolved", url: `${baseRoute}/complaints/resolved` },
          ],
        },
      ],
    },
    {
      title: "Store",
      items: [
        {
          title: "Preview",
          url: `${baseRoute}/store/store-front-preview`,
          icon: Eye,
          items: [
            { title: "Live Preview", url: `${baseRoute}/store/store-front-preview` },
            { title: "Mobile View", url: `${baseRoute}/store/store-front-preview?device=mobile` },
          ],
        },
        {
          title: "Store Settings",
          url: `${baseRoute}/store/store-settings`,
          icon: Store,
          items: [
            { title: "Branding", url: `${baseRoute}/store/store-settings/branding` },
            { title: "Hero Slides", url: `${baseRoute}/store/store-settings/hero` },
            { title: "Navigation", url: `${baseRoute}/store/store-settings/navigation` },
            { title: "Contact & Social", url: `${baseRoute}/store/store-settings/contact` },
            { title: "Trust & Footer", url: `${baseRoute}/store/store-settings/trust` },
          ],
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          title: "Users & Roles",
          url: `${baseRoute}/users`,
          icon: Shield,
          items: [
            { title: "User Management", url: `${baseRoute}/users/manage` },
            { title: "Role Permissions", url: `${baseRoute}/users/permissions` },
          ],
        },
        {
          title: "Settings",
          url: `${baseRoute}/settings`,
          icon: Settings,
          items: [
            { title: "System Settings", url: `${baseRoute}/settings/system` },
            { title: "Notifications", url: `${baseRoute}/settings/notifications` },
          ],
        },
      ],
    },
  ]

  // Vendor Navigation
  const vendorNav = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: `${baseRoute}`,
          icon: LayoutDashboard,
          items: [
            { title: "Dashboard", url: `${baseRoute}` },
            { title: "Analytics", url: `${baseRoute}/analytics` },
          ],
        },
      ],
    },
    {
      title: "Business",
      items: [
        {
          title: "Resellers",
          url: `${baseRoute}/resellers`,
          icon: Users,
          items: [
            { title: "All Resellers", url: `${baseRoute}/resellers` },
            { title: "Approve New", url: `${baseRoute}/resellers/pending` },
            { title: "Performance", url: `${baseRoute}/resellers/performance` },
          ],
        },
        {
          title: "Products",
          url: `${baseRoute}/bundles`,
          icon: Package,
          items: [
            { title: "All Products", url: `${baseRoute}/bundles` },
            { title: "Create Product", url: `${baseRoute}/bundles/new` },
            { title: "Pricing", url: `${baseRoute}/bundles/pricing` },
          ],
        },
        {
          title: "Transactions",
          url: `${baseRoute}/transactions`,
          icon: FileText,
          items: [
            { title: "Sales", url: `${baseRoute}/transactions` },
            { title: "Reports", url: `${baseRoute}/transactions/reports` },
          ],
        },
        {
          title: "Delivery",
          url: `${baseRoute}/delivery`,
          icon: Truck,
          items: [
            { title: "Active Deliveries", url: `${baseRoute}/delivery/active` },
            { title: "Delivery History", url: `${baseRoute}/delivery/history` },
          ],
        },
          {
          title: "Orders",
          url: `${baseRoute}/orders`,
          icon: ShoppingCart,
          items: [
            { title: "Pending Orders", url: `${baseRoute}/orders/pending` },
            { title: "Order History", url: `${baseRoute}/orders/history` },
          ],
        },
      ],
    },
    {
      title: "Financial",
      items: [
        {
          title: "Payouts",
          url: `${baseRoute}/confirm-payment`,
          icon: Wallet,
          items: [
            { title: "Request Payout", url: `${baseRoute}/confirm-payment/pending` },
            { title: "Payout History", url: `${baseRoute}/confirm-payment/history` },
            { title: "Bank Details", url: `${baseRoute}/confirm-payment/bank` },
          ],
        },
      ],
    },
    {
      title: "Store",
      items: [
        {
          title: "Preview",
          url: `${baseRoute}/store/store-front-preview`,
          icon: Eye,
          items: [
            { title: "Live Preview", url: `${baseRoute}/store/store-front-preview` },
            { title: "Mobile View", url: `${baseRoute}/store/store-front-preview?device=mobile` },
          ],
        },
        {
          title: "Store Settings",
          url: `${baseRoute}/store/store-settings`,
          icon: Store,
          items: [
            { title: "Branding", url: `${baseRoute}/store/store-settings/branding` },
            { title: "Hero Slides", url: `${baseRoute}/store/store-settings/hero` },
            { title: "Navigation", url: `${baseRoute}/store/store-settings/navigation` },
            { title: "Contact & Social", url: `${baseRoute}/store/store-settings/contact` },
            { title: "Trust & Footer", url: `${baseRoute}/store/store-settings/trust` },
          ],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Settings",
          url: `${baseRoute}/settings`,
          icon: Settings,
          items: [
            { title: "Profile", url: `${baseRoute}/settings/profile` },
            { title: "Commission Rates", url: `${baseRoute}/settings/commission` },
            { title: "Notifications", url: `${baseRoute}/settings/notifications` },
          ],
        },
      ],
    },
  ]

  // Reseller Navigation
  const resellerNav = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: `${baseRoute}`,
          icon: LayoutDashboard,
          items: [
            { title: "Dashboard", url: `${baseRoute}` },
            { title: "Quick Stats", url: `${baseRoute}/stats` },
          ],
        },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          title: "My Sales",
          url: `${baseRoute}/sales`,
          icon: ShoppingCart,
          items: [
            { title: "Recent Orders", url: `${baseRoute}/sales/orders` },
            { title: "Sales History", url: `${baseRoute}/sales/history` },
          ],
        },
        {
          title: "Products",
          url: `${baseRoute}/products`,
          icon: Package,
          items: [
            { title: "Available Products", url: `${baseRoute}/products` },
            { title: "My Inventory", url: `${baseRoute}/products/inventory` },
          ],
        },
      ],
    },
    {
      title: "Earnings",
      items: [
        {
          title: "Commissions",
          url: `${baseRoute}/commissions`,
          icon: TrendingUp,
          items: [
            { title: "Earnings", url: `${baseRoute}/commissions` },
            { title: "Commission History", url: `${baseRoute}/commissions/history` },
          ],
        },
        {
          title: "Payouts",
          url: `${baseRoute}/payouts`,
          icon: Wallet,
          items: [
            { title: "Request Payout", url: `${baseRoute}/payouts/request` },
            { title: "Payout History", url: `${baseRoute}/payouts/history` },
          ],
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Settings",
          url: `${baseRoute}/settings`,
          icon: Settings,
          items: [
            { title: "Profile", url: `${baseRoute}/settings/profile` },
            { title: "Bank Details", url: `${baseRoute}/settings/bank` },
          ],
        },
      ],
    },
  ]

    const managerNav = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          url: `${baseRoute}`,
          icon: LayoutDashboard,
          items: [
            { title: "Dashboard", url: `${baseRoute}` },
            { title: "Quick Stats", url: `${baseRoute}/stats` },
          ],
        },
      ],
    },
  ]
  // Select nav based on role
  const getNavItems = () => {
    if (role === "admin") return adminNav
    if (role === "manager") return managerNav
    return resellerNav
  }

  const navItems = getNavItems()

  const getRoleLabel = () => {
    if (role === "admin") return "Administrator"
    if (role === "vendor") return "Vendor"
    if (role === "manager") return "Manager"
    return "Reseller"
  }

  const userData = {
    name: reseller?.name || "User",
    email: reseller?.email || "user@example.com",
    avatar: "👤",
    role: getRoleLabel(),
  }

  return (
    <div className="dark">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center gap-2 px-2 py-1 ">
            {/* <div className="relative w-8 h-8 rounded-md overflow-hidden p-0.5">
              <img src="/v.svg" alt="Logo" className="w-full h-full object-contain" />
            </div> */}
            <span className="font-bold text-center sidebar-text text-white p-3 border-2 w-12 h-12 border-white rounded-full ">ST</span>
          </div>
          <div className="px-2 py-2 dev-badge">
            <DevModeBadge />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navItems.map((section) => (
            <NavMain
              key={section.title}
              title={section.title}
              items={section.items}
            />
          ))}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </div>
  )
}