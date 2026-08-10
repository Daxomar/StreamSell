"use client"
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, Eye, Package, CheckCircle, Clock, Loader2, FileText, Search, X } from 'lucide-react';
import { api } from '../../../lib/api';

// Main Component
const BulkExportsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedExport, setSelectedExport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch bulk exports with pagination
  const { data: exportsData, isLoading: exportsLoading } = useQuery({
    queryKey: ['bulk-exports', currentPage],
    queryFn: async () => {
      const data = await api(`/api/v1/transaction/bulk-exports/list?page=${currentPage}&limit=10`, {
        method: "GET",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch bulk exports");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch bulk exports");
      }

      return result;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Search for specific export by exportId
  const { data: searchData, isLoading: searchLoading, refetch: searchExport, isError: searchError } = useQuery({
    queryKey: ['search-export', searchQuery],
    queryFn: async () => {
      const response = await api(`/api/v1/transaction/bulk-export/${searchQuery}`, {
        method: "GET",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Export not found");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Export not found");
      }

      return result;
    },
    enabled: false, // Only run when manually triggered
    retry: false, // Don't retry on 404
  });

  // Fetch transactions for selected export (modal view)
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['export-transactions', selectedExport],
    queryFn: async () => {
      const response = await api(`/api/v1/transaction/bulk-export/${selectedExport}`, {
        method: "GET",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch export transactions");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch export transactions");
      }

      return result;
    },
    enabled: !!selectedExport,
    staleTime: 30000,
  });

  // Mark as delivered mutation
  const markDeliveredMutation = useMutation({
    mutationFn: async (exportId) => {
      const response = await api(`/api/v1/transaction/bulk-export/${exportId}/mark-delivered`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to mark export as delivered");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to mark export as delivered");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-exports'] });
      queryClient.invalidateQueries({ queryKey: ['export-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['search-export'] });
    },
  });

  // Export to CSV
  const handleExportCSV = () => {
    const transactions = transactionsData?.transactions || [];
   
    // CSV Headers
    const headers = [
      
      'REFERENCE',
      'PHONE NUMBER',
      'DATA SIZE',
      'NETWORk',
      'JBCP',
      'Status',
      'Delivery Status',
      // 'Created At',
      // 'Exported At',
    ];

    // CSV Rows
    const rows = transactions.map(t => [
      
      t.reference || '',
      t.metadata?.phoneNumberReceivingData || '',
      t.metadata?.bundleData.replace(/\s*GB/i, '') || '',
      t.metadata?.network || '',
      t.JBCP || '',
      t.status || '',
      t.deliveryStatus || '',
      // new Date(t.createdAt).toLocaleString(),
      // t.exportedAt ? new Date(t.exportedAt).toLocaleString() : '',
    ]);


    

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${selectedExport}_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = exportsData?.totalPages || 1;
  const exports = exportsData?.exports || [];

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchExport();
    }
  };

  // Clear search and show all exports
  const clearSearch = () => {
    setSearchQuery('');
    queryClient.resetQueries({ queryKey: ['search-export'] });
  };

  // Transform search data to match table format
  const searchExportData = searchData ? {
    _id: searchData.exportId,
    exportId: searchData.exportId,
    network: null, // Search doesn't return network
    count: searchData.count,
    status: searchData.status,
    createdAt: new Date().toISOString(), // Search doesn't return createdAt
  } : null;

  // Display searched export or all exports
  const displayExports = searchExportData ? [searchExportData] : exports;
  const isSearchMode = !!searchExportData;

  const networkColor = (network) => {
    switch (network?.toLowerCase()) {
      case 'mtn':
        return 'text-yellow-600 bg-yellow-100'
      case 'telecel':
        return 'text-red-600 bg-red-100'
      case 'at':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-blue-500" size={32} />
            Bulk Export Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track your bulk transaction exports</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Export ID (e.g., EXP-xxx-xxx)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              disabled={searchLoading || !searchQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
            </button>
          </form>
          {isSearchMode && (
            <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
              <span>Showing search result for "{searchQuery}"</span>
              <button
                onClick={clearSearch}
                className="text-blue-700 underline hover:text-blue-800"
              >
                Clear search
              </button>
            </div>
          )}
          {searchError && (
            <div className="mt-2 text-sm text-red-600">
              Export not found. Please check the Export ID and try again.
            </div>
          )}
        </div>

        {/* Exports List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Export ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Network</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Count</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(exportsLoading || searchLoading) && !isSearchMode ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                      <p className="text-gray-600 mt-2">Loading exports...</p>
                    </td>
                  </tr>
                ) : displayExports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FileText className="mx-auto text-gray-400" size={48} />
                      <p className="text-gray-600 mt-2">
                        {isSearchMode ? 'Export not found' : 'No exports found'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  displayExports.map((exp, index) => (
                    <tr
                      key={exp._id}
                      className={`border-b border-gray-100 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">
                        {exp.exportId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 ${networkColor(exp.network)} rounded-full font-medium`}>
                          {exp?.network || 'All'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {exp.count}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {exp.status === 'completed' ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={16} />
                            Delivered
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock size={16} />
                            Processing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {exp.createdAt ? new Date(exp.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'N/A'}  
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedExport(exp.exportId)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          {exp.status === 'completed' ? (
                            <button
                              disabled
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                              <CheckCircle size={16} />
                              Delivered
                            </button>
                          ) : (
                            <button
                              onClick={() => markDeliveredMutation.mutate(exp.exportId)}
                              disabled={markDeliveredMutation.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              {markDeliveredMutation.isPending ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!exportsLoading && !isSearchMode && totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction Details Modal */}
        {selectedExport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Export Transactions</h2>
                  <p className="text-blue-100 text-sm">Export ID: {selectedExport}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Download size={18} />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setSelectedExport(null)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {transactionsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto text-blue-500" size={32} />
                    <p className="text-gray-600 mt-2">Loading transactions...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Reference</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Phone</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Network</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Delivery</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionsData?.transactions?.map((txn, index) => (
                          <tr
                            key={txn._id}
                            className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3 text-xs font-mono text-gray-600">
                              {txn?.reference || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700">
                              {txn?.email || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700">
                              {txn.metadata?.phoneNumberReceivingData || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <span className={`px-2 py-1 rounded ${networkColor(txn.metadata?.network)}`}>
                                {txn.metadata?.network || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-gray-700">
                              GH₵ {txn.amount?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <span className={`px-2 py-1 rounded ${
                                txn.status === 'success' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {txn.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              <span className={`px-2 py-1 rounded ${
                                txn.deliveryStatus === 'delivered' 
                                  ? 'bg-green-100 text-green-700' 
                                  : txn.deliveryStatus === 'processing'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {txn.deliveryStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkExportsPage;