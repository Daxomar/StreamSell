"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useUser } from "../../contexts/UserContext"
import { api } from "@/lib/api"

const formatCurrency = (amount) => `GHS ${amount?.toFixed(2) || "0.00"}`

export default function ResellerPricingPage() {
  const queryClient = useQueryClient()
  const [localPrices, setLocalPrices] = useState({})
  const [savingSubscriptionId, setSavingSubscriptionId] = useState(null)

  // Filters
  const [selectedService, setSelectedService] = useState("all")
  const [showCustomPricesOnly, setShowCustomPricesOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { reseller, isLoadingReseller, isErrorReseller } = useUser()   // fixed: lowercase

  const isDisabled = !reseller?.emailVerified || !reseller?.isApproved  // fixed: emailVerified

  // ── Fetch subscriptions (public catalogue at this reseller's prices) ──
  // Using the public reseller-pricing endpoint which already returns price + service.
  const fetchSubscriptions = async () => {
    const data = await api(`/api/v1/subscriptions/all`)   // all active subscriptions
    if (!data.success) throw new Error(data.message || "Failed to fetch subscriptions")
    return data
  }

  // ── Fetch this reseller's custom pricing ──
  const fetchResellerPricing = async () => {
    const data = await api(`/api/v1/reseller-pricing/pricing`)   // api() + prefix
    if (!data.success) throw new Error(data.message || "Failed to fetch pricing")
    return data.data
  }

  const { data: subscriptionsDataSet, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  })

  const subscriptions = subscriptionsDataSet?.data

  const { data: pricingData, isLoading: isLoadingPricing } = useQuery({
    queryKey: ["resellerPricing"],
    queryFn: fetchResellerPricing,
    enabled: !!subscriptions,
  })

  useEffect(() => {
    if (pricingData) {
      const priceMap = {}
      pricingData.forEach((p) => {
        priceMap[p._id] = p.customPrice
      })
      setLocalPrices(priceMap)
    }
  }, [pricingData])

  const subscriptionsWithPricing =
    subscriptions?.map((sub) => {
      const pricingInfo = pricingData?.find((p) => p._id === sub._id)
      return {
        ...sub,
        basePrice: sub.sellingPrice,                                  // fixed: JBSP → sellingPrice
        customPrice: pricingInfo?.customPrice || sub.sellingPrice,
        commission: pricingInfo?.commission || 0,
        hasCustomPrice: pricingInfo?.hasCustomPrice || false,
      }
    }) || []

  // Derive the services present (for the filter dropdown)
  const services = Array.from(new Set(subscriptionsWithPricing.map((s) => s.service).filter(Boolean)))

  // ── Filtering ──
  const filteredSubscriptions = subscriptionsWithPricing.filter((sub) => {
    if (selectedService !== "all" && sub.service !== selectedService) return false
    if (showCustomPricesOnly && !sub.hasCustomPrice) return false
    if (searchTerm) {
      const s = searchTerm.toLowerCase()
      return (
        sub.name?.toLowerCase().includes(s) ||
        sub.service?.toLowerCase().includes(s) ||
        sub.subscription_id?.toLowerCase().includes(s)
      )
    }
    return true
  })

  const savePriceMutation = useMutation({
    mutationFn: async ({ subscriptionId, customPrice }) => {
      const data = await api(`/api/v1/reseller-pricing/pricing/set`, {
        method: "POST",
        body: JSON.stringify({ subscriptionId, customPrice }),   // fixed: subscriptionId (was bundleId)
      })
      if (!data.success) throw new Error(data.message || "Failed to update price")
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["resellerPricing"])
      setSavingSubscriptionId(null)
      toast.success("Price updated successfully")
    },
    onError: (error) => {
      setSavingSubscriptionId(null)
      toast.error(error.message || "Failed to save price")
    },
  })

  const handlePriceChange = (subscriptionId, value) => {
    if (value === "") {
      setLocalPrices((prev) => ({ ...prev, [subscriptionId]: "" }))
      return
    }
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setLocalPrices((prev) => ({ ...prev, [subscriptionId]: numValue }))
    }
  }

  const handleSavePrice = (sub) => {
    const customPrice = localPrices[sub._id]
    if (customPrice < sub.basePrice) {
      toast.error(`Price must be at least ${formatCurrency(sub.basePrice)}`)
      return
    }
    setSavingSubscriptionId(sub._id)
    savePriceMutation.mutate({ subscriptionId: sub._id, customPrice })
  }

  const totalCommission = filteredSubscriptions.reduce((sum, sub) => {
    const price = localPrices[sub._id] ?? sub.customPrice
    return sum + (price - sub.basePrice)
  }, 0)

  const avgCommission = filteredSubscriptions.length > 0 ? totalCommission / filteredSubscriptions.length : 0

  const isLoading = isLoadingSubscriptions || isLoadingPricing

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#262626] mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Pricing</h1>
          <p className="text-gray-600 mt-1">Set your selling price for each subscription (must be equal to or above base price)</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Subscriptions</p>
                <p className="text-3xl font-bold mt-1">{subscriptionsWithPricing.length}</p>
                <p className="text-xs text-gray-500 mt-1">Available for resale</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-layer-group text-[#262626] text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Profit</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(avgCommission)}</p>
                <p className="text-xs text-gray-500 mt-1">Per subscription sold</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-arrow-trend-up text-green-600 text-lg" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Prices</p>
                <p className="text-3xl font-bold mt-1">{subscriptionsWithPricing.filter((s) => s.hasCustomPrice).length}</p>
                <p className="text-xs text-gray-500 mt-1">Subscriptions with custom pricing</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-tag text-purple-600 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#262626] focus:outline-none"
              >
                <option value="all">All Services</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Show Custom Prices Only</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCustomPricesOnly}
                  onChange={(e) => setShowCustomPricesOnly(e.target.checked)}
                  className="w-4 h-4 text-[#262626] border-gray-300 rounded focus:ring-[#262626]"
                />
                <span className="text-sm text-gray-700">
                  Only show subscriptions I've customized ({subscriptionsWithPricing.filter((s) => s.hasCustomPrice).length})
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#262626] focus:outline-none"
              />
            </div>
          </div>

          {/* Active filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedService !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-[#262626] rounded-full text-sm">
                Service: {selectedService}
                <button onClick={() => setSelectedService("all")} className="ml-1 hover:text-black">×</button>
              </span>
            )}
            {showCustomPricesOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Custom Prices Only
                <button onClick={() => setShowCustomPricesOnly(false)} className="ml-1 hover:text-purple-900">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-gray-900">×</button>
              </span>
            )}
            {(selectedService !== "all" || showCustomPricesOnly || searchTerm) && (
              <button
                onClick={() => { setSelectedService("all"); setShowCustomPricesOnly(false); setSearchTerm("") }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Showing {filteredSubscriptions.length} of {subscriptionsWithPricing.length} subscriptions
          </div>
        </div>

        {/* Info Card */}
        <div className={`border-2 rounded-lg p-4 ${isDisabled ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex gap-3">
            <i className={`fa-solid fa-circle-info flex-shrink-0 mt-0.5 ${isDisabled ? "text-green-600" : "text-[#262626]"}`} />
            <div>
              <p className={`text-sm font-semibold ${isDisabled ? "text-green-900" : "text-[#262626]"}`}>
                {isDisabled ? "Account not yet eligible" : "How it works"}
              </p>
              <p className={`text-sm mt-1 ${isDisabled ? "text-green-700" : "text-slate-700"}`}>
                {isDisabled ? (
                  <>
                    You can't set your own subscription prices yet. Your reseller account must be <strong>verified</strong> and <strong>approved</strong> before pricing is unlocked. Once approved, you'll be able to set your selling price and earn profit on every sale.
                  </>
                ) : (
                  <>
                    Set your selling price for each subscription. Your price must be equal to or above the base price. The difference between your price and the base price is your profit per sale.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Subscription Prices</h2>
            <p className="text-sm text-gray-600 mt-1">Adjust prices individually and save each one</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Range</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <i className="fa-solid fa-inbox text-4xl text-gray-300" />
                        <p className="font-medium">No subscriptions found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => {
                    const currentPrice = localPrices[sub._id] ?? sub.customPrice
                    const commission = currentPrice - sub.basePrice
                    const isValid = currentPrice >= sub.basePrice
                    const hasChanged = currentPrice !== sub.customPrice
                    const isSaving = savingSubscriptionId === sub._id

                    return (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">{sub.name}</p>
                            <p className="text-xs text-gray-500">{sub.plan}{sub.duration ? ` • ${sub.duration}` : ""}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">{sub.service}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatCurrency(sub.basePrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            step="0.50"
                            min={sub.basePrice}
                            value={currentPrice}
                            disabled={isDisabled}
                            onChange={(e) => handlePriceChange(sub._id, e.target.value)}
                            className={`w-28 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#262626] focus:outline-none ${!isValid ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${commission > 0 ? "text-green-600" : "text-gray-400"}`}>
                            +{formatCurrency(commission)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{sub.recommendedRange || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleSavePrice(sub)}
                            disabled={!hasChanged || !isValid || isSaving || isDisabled}
                            className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${hasChanged && isValid && !isSaving && !isDisabled ? "bg-[#262626] text-white hover:bg-[#3a3a3a]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}