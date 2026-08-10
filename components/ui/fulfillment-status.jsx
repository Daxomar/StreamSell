"use client"

import { CheckCircle, Clock, Package, XCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Status configurations
const STATUS_CONFIG = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    animate: true,
  },
  delivered: {
    label: "Delivered",
    icon: Package,
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  // Legacy status mappings
  completed: {
    label: "Delivered",
    icon: Package,
    color: "bg-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  pending: {
    label: "Processing",
    icon: Loader2,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    animate: true,
  },
}

// Badge variant of the status indicator
export function FulfillmentBadge({ status, size = "default" }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.processing
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  return (
    <Badge className={`${config.color} hover:${config.color} ${sizeClasses[size]} gap-1.5`}>
      <Icon className={`h-3.5 w-3.5 ${config.animate ? "animate-spin" : ""}`} />
      {config.label}
    </Badge>
  )
}

// Inline text status
export function FulfillmentText({ status, showIcon = true }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.processing
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.textColor} font-medium`}>
      {showIcon && <Icon className={`h-4 w-4 ${config.animate ? "animate-spin" : ""}`} />}
      {config.label}
    </span>
  )
}

// Card-style status indicator
export function FulfillmentCard({ status, timestamp }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.processing
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className={`p-2 rounded-full ${config.color} text-white`}>
        <Icon className={`h-4 w-4 ${config.animate ? "animate-spin" : ""}`} />
      </div>
      <div>
        <p className={`font-medium ${config.textColor}`}>{config.label}</p>
        {timestamp && (
          <p className="text-xs text-slate-500">{timestamp}</p>
        )}
      </div>
    </div>
  )
}

// Timeline status indicator (for tracking page)
export function FulfillmentTimeline({ currentStatus, statusHistory = [] }) {
  const statuses = ["accepted", "processing", "delivered"]
  
  const getStatusIndex = (status) => {
    const normalizedStatus = status?.toLowerCase()
    if (normalizedStatus === "delivered" || normalizedStatus === "completed") return 2
    if (normalizedStatus === "processing" || normalizedStatus === "pending") return 1
    if (normalizedStatus === "accepted") return 0
    return -1
  }

  const currentIndex = getStatusIndex(currentStatus)

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 mx-8" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute top-5 left-0 h-1 bg-green-500 mx-8 transition-all duration-500"
          style={{ width: `${Math.max(0, (currentIndex / 2) * 100)}%` }}
        />
        
        {statuses.map((status, index) => {
          const config = STATUS_CONFIG[status]
          const Icon = config.icon
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex
          const historyItem = statusHistory.find(h => 
            h.status?.toLowerCase() === status || 
            (status === "delivered" && h.status?.toLowerCase() === "completed") ||
            (status === "processing" && h.status?.toLowerCase() === "pending")
          )
          
          return (
            <div key={status} className="flex flex-col items-center z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? isCurrent 
                      ? `${config.color} text-white ring-4 ring-opacity-30 ring-green-500` 
                      : `${config.color} text-white`
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${isCurrent && config.animate ? "animate-spin" : ""}`} />
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? config.textColor : "text-slate-400"}`}>
                {config.label}
              </span>
              {historyItem?.timestamp && (
                <span className="text-xs text-slate-400 mt-0.5">
                  {historyItem.timestamp}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Export all status utilities
export const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.processing
export const getStatusLabel = (status) => getStatusConfig(status).label
export const normalizeStatus = (status) => {
  const normalized = status?.toLowerCase()
  if (normalized === "completed") return "delivered"
  if (normalized === "pending") return "processing"
  return normalized
}
