// components/LowStockAlert.jsx

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function LowStockAlert({ lowStock }) {
  if (lowStock <= 0) return null;

  return (
    <div className="rounded-xl border border-red-200/40 bg-red-50/40 dark:border-red-900/30 dark:bg-red-950/20">
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
           {lowStock} Product {lowStock !== 1 ? "s" : ""} running low on stocks
          </p>

          <p className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
            Stock levels need attention
          </p>

          <Link
            href="/dispensary/inventory"
            className="mt-2 inline-block text-xs font-medium text-red-700 hover:text-red-800 hover:underline dark:text-red-400 dark:hover:text-red-300"
          >
            View inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}