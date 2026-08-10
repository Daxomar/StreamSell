"use client"

import { createContext, useContext } from "react"
import { useState,useEffect, useRef, } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { api } from "../../lib/api"

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  console.log("🔵 TransactionProvider mounted")

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    network: "",
    search: "",
    resellerCode: "",
    startDate: "",
    endDate: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  })

  const fetchTransactions = async (newFilters = {}) => {
    console.log("🟢 fetchTransactions called with:", newFilters)

    // Merge new filters with existing ones
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    try {
      const params = new URLSearchParams()
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const data = await api(`/api/v1/transactions?${params.toString()}`)

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch transactions")
      }

      console.log("TRANSACTION DATA", data)
      return data.data

    } catch (error) {
      console.error("Fetch transactions error:", error.message)
      toast.error(error.message || "Failed to load transactions")
      throw error
    }
  }

  const {
    data: transactionData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions", filters], // Include filters in queryKey
    queryFn: () => fetchTransactions(filters),
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  })

  const transactions = transactionData?.transactions || []
  const analytics = transactionData?.analytics || null
  const pagination = transactionData?.pagination || null
  const bossuBalance = transactionData?.bossuBalance || null
  

  

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchTransactions({ page })
  }

  return (
    <TransactionContext.Provider
      value={{
        bossuBalance,
        transactions,
        analytics,
        pagination,
        isLoadingTransactions,
        isErrorTransactions,
        refetchTransactions,
        fetchTransactions,
        handlePageChange,
        currentPage
      }}
    >
      {children}
    </TransactionContext.Provider>
  )













}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider")
  }
  return context
}