"use client"

import { cn, formatCurrency } from "@/lib/utils"

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading = false,
  isCurrency = false,
  className,
}) {
  const displayValue =
    value == null
      ? "—"
      : isCurrency
        ? formatCurrency(value)
        : value

  return (
    <div
      className={cn(
        " rounded-xl p-6  border-slate-200/50  bg-white/40  lg:backdrop-blur-sm shadow-md hover:shadow-lg transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium ">{title}</p>
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="h-8 w-28 animate-pulse rounded-md bg-[#03563E]/10" />
        ) : (
          <p className="liquid-font-display text-2xl font-semibold tabular-nums">
            {displayValue}
          </p>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-sm ">
          {isLoading ? (
            <div className="h-4 w-36 animate-pulse rounded bg-[#03563E]/8" />
          ) : (
            subtitle
          )}
        </div>
      )}
    </div>
  )
}


// "use client"

// import { cn, formatCurrency } from "@/lib/utils"

// export function StatCard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   isLoading = false,
//   isCurrency = false,
//   className,
// }) {
//   const displayValue =
//     value == null
//       ? "—"
//       : isCurrency
//         ? formatCurrency(value)
//         : value

//   return (
//     <div
//       className={cn(
//         "liquid-stat-card rounded-xl  transition-shadow hover:shadow-md ",
//         className
//       )}
     
//     >
//       <div className="flex items-start  gap-3  p-2  text-white rounded-t-xl">
//         {Icon && (
//           <Icon className="h-4 w-4 shrink-0 " aria-hidden />
//         )}
//         <p className=" text-[12px] md:text-sm font-medium ">{title}</p>
//       </div>

//       <div className="  bg-white  rounded-t-xl">
//         {isLoading ? (
//           <div className="h-8 w-28 animate-pulse rounded-md bg-[#03563E]/10" />
//         ) : (
//           <p className="liquid-font-display text-lg md:text-2xl font-semibold tabular-nums text-[#03563E] p-3">
//             {displayValue}
//           </p>
//         )}
//       </div>

//       {subtitle && (
//         <div className="text-[12px]   text-[#03563E]/55 p-3  bg-white rounded-b-xl">
//           {isLoading ? (
//             <div className="h-6 w-36 animate-pulse rounded bg-[#03563E]/8 p-3" />
//           ) : (
//             subtitle
//           )}
//         </div>
//       )}
//     </div>
//   )
// }
