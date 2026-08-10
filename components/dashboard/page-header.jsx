"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "./use-reduced-motion"

export function PageHeader({ title, description, actions, className }) {
  const reducedMotion = useReducedMotion()

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
      }

  return (
    <motion.header
      className={cn(
        " mb-2 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...motionProps}
    >
      <div className="space-y-1  ">
        {description && (
          <p className="max-w-2xl text-sm ">{description}</p>
        )}
        <h1 className=" text-3xl font-semibold tracking-tight ">
          {title}
        </h1>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </motion.header>
  )
}
