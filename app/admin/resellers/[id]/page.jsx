"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Minus, User, Eye } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { DropdownMenuAction } from "@/components/dashboard/resellerList";
import { ListTabsView } from "@/components/dashboard/listTabs";
import { api } from "../../../../lib/api";
import { ResellerSalesChart } from "../../../../components/dashboard/ResellerSalesChart";
import { SendMessageDialog } from "../../../../components/dashboard/SendMessageDialog";
import { StatCard } from "../../../../components/dashboard/stat-card";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Tiny FA icon wrappers so they plug into StatCard's `icon` prop (which expects a component)
const WalletIcon = ({ className }) => <i className={cn("fa-solid fa-wallet", className)} />
const ChartIcon = ({ className }) => <i className={cn("fa-solid fa-chart-line", className)} />
const CoinsIcon = ({ className }) => <i className={cn("fa-solid fa-coins", className)} />
const HeartIcon = ({ className }) => <i className={cn("fa-solid fa-heart", className)} />
const WarnIcon = ({ className }) => <i className={cn("fa-solid fa-triangle-exclamation", className)} />
const ClockIcon = ({ className }) => <i className={cn("fa-solid fa-clock", className)} />

// ─────────────────────────────────────────────────────────────
// API → UI NORMALISER
// Maps the aggregation response shape to what the UI components expect
// ─────────────────────────────────────────────────────────────

function normaliseReseller(raw) {
  if (!raw) return null;

  return {
    _id: raw._id,
    name: raw.name,
    email: raw.email,
    phoneNumber: raw.phoneNumber,
    resellerCode: raw.resellerCode,
    isApproved: raw.isApproved,
    emailVerified: raw.emailVerified,          // was isAccountVerified
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    notes: raw.notes || null,

    // financials
    totalCommissionEarned: raw.totalCommissionEarned ?? 0,
    totalCommissionPaidOut: raw.totalCommissionPaidOut ?? 0,
    availableBalance: raw.availableBalance ?? 0,

    // sales
    totalSales: raw.totalSalesVolume ?? 0,
    totalSalesCount: raw.totalSalesCount ?? 0,
    lifetimeProfit: raw.lifetimePlatformProfit ?? 0,

    // velocity & risk
    salesVelocityPercent: raw.salesVelocity ?? 0,
    pendingRiskPercent: raw.pendingTransactionRisk ?? 0,
    failureRate: raw.failureRate ?? 0,
    daysSinceLastOrder: raw.daysSinceLastOrder ?? null,

    thisMonthRevenue: raw.thisMonthRevenue ?? 0,
    lastMonthRevenue: raw.lastMonthRevenue ?? 0,

    lastActiveDate: raw.lastOrderDate ?? raw.updatedAt,

    // customer stats (replaces topLocations)
    customerStats: raw.customerStats ?? { totalCustomers: 0, repeatCustomers: 0 },

    // recent transactions — mapped to our shape
    transactions: (raw.recentTransactions ?? []).map((tx) => ({
      _id: tx._id,
      saleId: tx.reference,
      description: tx.subscriptionName || `Order ${tx.reference?.split("_")[2] ?? tx._id}`,
      amount: tx.amount,
      status: tx.status === "success" ? "completed" : tx.status,
      createdAt: tx.createdAt,
      service: tx.service || tx.metadata?.service,
    })),

    payouts: (raw.recentPayouts ?? []).map((p) => ({
      _id: p._id,
      amount: p.amount,
      netAmount: p.netAmount,
      network: p.network,
      status: p.status === "completed" ? "paid" : p.status,
      createdAt: p.requestedAt || p.createdAt,
    })),

    // top subscriptions (was top3Products)
    topProducts: (raw.topSubscriptions ?? []).map((p) => ({
      name: p.subscriptionName,
      unitsSold: p.count,
      revenue: p.revenue ?? 0,
      rank: p.rank,
    })),

    auditLog: [
      raw.createdAt && { label: "Account Created", date: raw.createdAt },
      raw.emailVerified && { label: "Email Verified", date: raw.createdAt },
      raw.isApproved && { label: "Account Approved", date: raw.updatedAt },
    ].filter(Boolean),
  };
}


// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getPerformanceTier(totalSales) {
  if (totalSales >= 50000) return { label: "Premium", variant: "default" };
  if (totalSales >= 10000) return { label: "Standard", variant: "secondary" };
  return { label: "Starter", variant: "outline" };
}

function daysSinceActive(lastActiveDate) {
  if (!lastActiveDate) return null;
  const diff = Date.now() - new Date(lastActiveDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}


// ─────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <Skeleton className={`rounded-md ${className}`} />;
}

function SkeletonCard({ rows = 3 }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader><SkeletonBlock className="h-4 w-32" /></CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-1">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-5 w-40" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ResellerDetailSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-10 w-10" />
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SkeletonCard rows={5} />
          <SkeletonCard rows={2} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader><SkeletonBlock className="h-4 w-28" /></CardHeader>
                <CardContent><SkeletonBlock className="h-8 w-32" /></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardHeader><SkeletonBlock className="h-4 w-40" /></CardHeader>
                <CardContent><SkeletonBlock className="h-48 w-full" /></CardContent>
              </Card>
            ))}
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="h-8 w-20" />
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <div className="space-y-1">
                      <SkeletonBlock className="h-4 w-36" />
                      <SkeletonBlock className="h-3 w-24" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <SkeletonBlock className="h-4 w-20" />
                      <SkeletonBlock className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function PageHeader({ data, onBack }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="border-0 shadow-sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{data.name}</h1>
          <p className="text-gray-500 text-sm">{data.resellerCode}</p>
        </div>
      </div>
      <Badge variant={data.isApproved ? "default" : "secondary"} className="text-sm px-3 py-1">
        {data.isApproved ? "Approved" : "Pending"}
      </Badge>
    </div>
  );
}

function ProfileCard({ data, tier }) {
  const [messageOpen, setMessageOpen] = useState(false)

  return (
    <div className="flex flex-col w-full gap-1">
      <Item className="flex flex-col items-center justify-center bg-white/40 border-0 shadow-sm rounded-b-none">
        <CardHeader className="w-full flex items-center justify-between px-4 text-sm text-gray-500">
          <CardTitle>INFO</CardTitle>
          <CardTitle><DropdownMenuAction /></CardTitle>
        </CardHeader>
        <ItemMedia className="w-full">
          {/* GREEN → #262626 */}
          <div className="w-25 h-25 rounded-full flex items-center justify-center font-bold text-xs text-white bg-[#262626]">
            <i className="fa-solid fa-user text-5xl" />
          </div>
        </ItemMedia>
        <ItemContent className="flex-col items-center">
          <ItemTitle className="text-sm font-semibold">{data.name}</ItemTitle>
          <ItemDescription className="text-xs text-center text-slate-600">Reseller</ItemDescription>
        </ItemContent>
      </Item>

      <Item className="flex flex-col items-start justify-center bg-white/40 border-0 shadow-sm rounded-t-none">
        <ItemContent className="flex-col items-start">
          <ItemDescription className="text-xs text-slate-600">Email</ItemDescription>
          <ItemTitle className="text-sm font-semibold">{data.email}</ItemTitle>
        </ItemContent>

        <ItemContent className="flex-col items-start">
          <ItemDescription className="text-xs text-slate-600">Phone</ItemDescription>
          <ItemTitle className="text-sm font-semibold">{data.phoneNumber || "N/A"}</ItemTitle>
        </ItemContent>

        <ItemContent className="flex-col items-start">
          <ItemDescription className="text-xs text-slate-600">Reseller Code</ItemDescription>
          <ItemTitle className="text-sm font-semibold">{data.resellerCode}</ItemTitle>
        </ItemContent>

        <ItemActions className="w-full flex flex-col items-center justify-center mt-6 gap-2">
          {/* Suspend → Call (tel: dialer with reseller's number) */}
          <a href={`tel:${data.phoneNumber}`} className="w-full">
            <Button className="w-full p-5 bg-[#262626] hover:bg-[#3a3a3a] text-white font-semibold">
              <i className="fa-solid fa-phone mr-2" /> Call
            </Button>
          </a>
          {/* Send message → opens dialog */}
          <Button
            variant="outline"
            onClick={() => setMessageOpen(true)}
            className="w-full p-5 border-[#262626] border-2 hover:bg-[#262626] hover:text-white font-semibold"
          >
            <i className="fa-solid fa-message mr-2" /> Send message
          </Button>
        </ItemActions>
      </Item>

      <SendMessageDialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        reseller={data}
      />
    </div>
  )
}

function RelationshipsCard({ data }) {
  const days = data.daysSinceLastOrder;

  return (
    <Card className="border-0 shadow-sm w-full">
      <CardHeader>
        <CardTitle className="text-base">Activity & Customers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400">Customers</p>
            <p className="text-lg font-bold text-[#262626]">{data.customerStats?.totalCustomers ?? 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-400">Repeat</p>
            <p className="text-lg font-bold text-[#262626]">{data.customerStats?.repeatCustomers ?? 0}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-0.5">Member Since</p>
          <p className="font-medium text-sm">{new Date(data.createdAt).toLocaleDateString()}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-0.5">Last Order</p>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {data.lastActiveDate ? new Date(data.lastActiveDate).toLocaleDateString() : "N/A"}
            </p>
            {days !== null && (
              <Badge variant={days > 30 ? "destructive" : days > 14 ? "secondary" : "default"} className="text-xs">
                {days === 0 ? "Today" : `${days}d ago`}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCardsGrid({ data }) {
  const cs = data.customerStats || { totalCustomers: 0, repeatCustomers: 0 }
  const loyaltyPct = cs.totalCustomers > 0
    ? Math.round((cs.repeatCustomers / cs.totalCustomers) * 100)
    : 0

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      <StatCard
        title="Available Balance"
        value={data.availableBalance ?? 0}
        isCurrency
        icon={WalletIcon}
      />
      <StatCard
        title="Total Sales Volume"
        value={data.totalSales ?? 0}
        isCurrency
        icon={ChartIcon}
      />
      <StatCard
        title="Commission Earned"
        value={data.totalCommissionEarned ?? 0}
        isCurrency
        icon={CoinsIcon}
      />
      <StatCard
        title="Customer Loyalty"
        value={`${cs.repeatCustomers} of ${cs.totalCustomers}`}
        subtitle={`${loyaltyPct}% repeat buyers`}
        icon={HeartIcon}
      />
      <StatCard
        title="Pending Risk"
        value={`${(data.pendingRiskPercent ?? 0).toFixed(1)}%`}
        subtitle="of transactions pending"
        icon={WarnIcon}
      />
      <StatCard
        title="Days Since Last Order"
        value={data.daysSinceLastOrder === null ? "—" : `${data.daysSinceLastOrder}d`}
        subtitle={
          data.daysSinceLastOrder > 30 ? "inactive"
          : data.daysSinceLastOrder > 14 ? "slowing down"
          : "active"
        }
        icon={ClockIcon}
      />
    </div>
  )
}

function FinancialSummaryCard({ data }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {[
          { label: "Total Commission Earned", value: data.totalCommissionEarned },
          { label: "Total Commission Paid Out", value: data.totalCommissionPaidOut },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-medium text-sm">GHS {value?.toFixed(2) ?? "0.00"}</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg mt-1">
          <span className="font-medium text-sm">Available Balance</span>
          <span className="font-bold text-green-600">
            GHS {data.availableBalance?.toFixed(2) ?? "0.00"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartsRow({ data }) {
  // Backend returns single revenue numbers, not daily arrays.
  // Show a simple 2-bar comparison instead of a daily chart.
  const monthlyChartData = {
    labels: ["Last Month", "This Month"],
    datasets: [
      {
        label: "Revenue (GHS)",
        data: [data.lastMonthRevenue ?? 0, data.thisMonthRevenue ?? 0],
        backgroundColor: [
          "rgba(148, 163, 184, 0.5)",
          "rgba(34, 197, 94, 0.75)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { callback: (v) => `GHS ${v}` },
      },
      x: { grid: { display: false } },
    },
  };

  const hasLocations = data.topLocations?.length > 0;

  const locationChartData = {
    labels: hasLocations ? data.topLocations.map((l) => l.location) : ["No data"],
    datasets: [
      {
        data: hasLocations ? data.topLocations.map((l) => l.sales) : [1],
        backgroundColor: hasLocations
          ? ["rgba(59,130,246,0.85)", "rgba(234,179,8,0.85)", "rgba(239,68,68,0.85)"]
          : ["rgba(200,200,200,0.3)"],
        borderWidth: 0,
      },
    ],
  };

  const locationChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: { label: (ctx) => ` GHS ${ctx.parsed.toLocaleString()}` },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">This Month vs Last Month</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={monthlyChartData} options={monthlyChartOptions} />
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Top 3 Sales Locations</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-52 h-52">
            <Doughnut data={locationChartData} options={locationChartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TopProductsCard({ products }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {products?.length > 0 ? (
          products.map((product, i) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.unitsSold} units sold</p>
                </div>
              </div>
              {product.revenue > 0 && (
                <p className="font-semibold text-sm text-blue-600">
                  GHS {product.revenue.toLocaleString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No product data yet</p>
        )}
      </CardContent>
    </Card>
  );
}

function TransactionsCard({ transactions, onViewAll }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <Button variant="outline" size="sm" className="border-0 shadow-sm text-xs" onClick={onViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions?.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{tx.description}</p>
                <p className="text-xs font-mono text-gray-400">{tx.saleId}</p>
                <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-sm">GHS {tx.amount?.toFixed(2)}</p>
                <Badge
                  variant={
                    tx.status === "completed" ? "default" :
                      tx.status === "failed" ? "destructive" : "secondary"
                  }
                  className="text-xs"
                >
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No transactions yet</p>
        )}
      </CardContent>
    </Card>
  );
}

function PayoutsCard({ payouts, onViewAll }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base">Payout History</CardTitle>
        <Button variant="outline" size="sm" className="border-0 shadow-sm text-xs" onClick={onViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {payouts?.length > 0 ? (
          payouts.map((payout) => (
            <div
              key={payout._id}
              className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">Payout Request</p>
                <p className="text-xs text-gray-400">{new Date(payout.createdAt).toLocaleDateString()}</p>
                {payout.network && (
                  <p className="text-xs text-gray-400">{payout.network}</p>
                )}
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-sm">GHS {payout.amount?.toFixed(2)}</p>
                <Badge
                  variant={
                    payout.status === "paid" ? "default" :
                      payout.status === "pending" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {payout.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No payouts yet</p>
        )}
      </CardContent>
    </Card>
  );
}

function AccountNotesCard({ notes }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Account Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 leading-relaxed">
          {notes || "No notes on file"}
        </p>
      </CardContent>
    </Card>
  );
}

function AuditLogCard({ auditLog }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {auditLog?.length > 0 ? (
          <div className="space-y-1">
            {auditLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                  {i < auditLog.length - 1 && (
                    <div className="w-px h-6 bg-gray-100 mt-1" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium">{entry.label}</p>
                  <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">No activity recorded</p>
        )}
      </CardContent>
    </Card>
  );
}


// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function ResellerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["reseller", id],
    queryFn: async () => {
      const res = await api(`/api/v1/users/${id}/detail`);
      if (!res.success) throw new Error("Failed to fetch reseller");
      return res;
    },
    enabled: !!id,
  });

  if (isLoading) return <ResellerDetailSkeleton />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load reseller details.
      </div>
    );
  }

  // Normalise API response → UI shape
  const data = normaliseReseller(apiResponse?.data);

  if (!data) {
    return <div className="p-6 text-center text-gray-400">Reseller not found.</div>;
  }

  const tier = getPerformanceTier(data.totalSales ?? 0);

  return (
    <div className="space-y-6 p-6">

      {/* <PageHeader data={data} onBack={() => router.back()} /> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"> */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Column 1 ── */}
        <div className="w-full lg:max-w-[300px] flex flex-col md:flex-row lg:flex-col lg:grid-cols-1 lg:col-span-1 space-y-4 ">
          <ProfileCard data={data} tier={tier} />
          <RelationshipsCard
            data={data}
            onViewVendor={() => router.push(`/admin/vendors/${data.parentVendor?._id}`)}
          />
        </div>

        {/* ── Column 2 & 3 ── */}
        <div className="w-full">
          <div className="lg:col-span-3 space-y-4 mb-4">
            <MetricCardsGrid data={data} />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <ResellerSalesChart resellerId={id} />
            <ListTabsView payouts={data.payouts} topProducts={data.topProducts} transactions={data.transactions} />
            {/* <FinancialSummaryCard data={data} /> */}
            {/* <TopProductsCard products={data.topProducts} /> */}
            {/* <TransactionsCard
              transactions={data.transactions}
              onViewAll={() => router.push(`/admin/transactions?resellerCode=${data.resellerCode}`)}
            /> */}
            {/* <PayoutsCard
              payouts={data.payouts}
              onViewAll={() => router.push(`/admin/payouts?resellerId=${id}`)}
            /> */}
            {/* <AccountNotesCard notes={data.notes} /> */}
            <AuditLogCard auditLog={data.auditLog} />
          </div>
        </div>

      </div>
    </div>
  );
}