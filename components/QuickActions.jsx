// components/QuickActions.jsx

import Link from "next/link";
import {
  Package,
  Truck,
  PlusCircle,
  Settings,
} from "lucide-react";

const quickActions = [
  {
    label: "Services",
    href: "/dispensary/inventory",
    icon: Package,
    color: "bg-[#262626] text-white",
  },
  {
    label: "Deliveries",
    href: "/admin/delivery-methods",
    icon: Truck,
    color: "bg-[#262626] text-white",
  },
  {
    label: "Add Products",
    href: "/dispensary/add-medication",
    icon: PlusCircle,
    color: "bg-[#262626] text-white",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "bg-[#262626] text-white",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
      <div className="p-4 pb-2">
        <h2 className="text-sm font-semibold">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 pt-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border-slate-200/50  bg-white/40  backdrop-blur-sm shadow-md hover:shadow-lg  p-3 text-center transition-colors hover:bg-muted/30"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="text-xs font-medium leading-tight">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}