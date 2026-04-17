"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/app/components/Card";
import { Table } from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";

interface Transaction {
  id: string;
  amount: number;
  note: string | null;
  status: string;
  issuedAt: string;
  employee: { name: string };
  project: { name: string };
}

interface DashboardData {
  totalIssued: number;
  totalCleared: number;
  pendingBalance: number;
  recentTransactions: Transaction[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current month's summary
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        const response = await fetch(`/api/reports?month=${month}`);
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const reportData = await response.json();

        setData({
          totalIssued: reportData.summary.totalIssued,
          totalCleared: reportData.summary.totalCleared,
          pendingBalance: reportData.summary.pendingBalance,
          recentTransactions: reportData.transactions.slice(0, 5),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time overview of petty cash flow</p>
        </div>
        <div className="flex gap-3">
          <Link href="/transactions">
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
              New Transaction
            </button>
          </Link>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          label="Total Issued"
          value={`﷼${data?.totalIssued.toFixed(2) || "0.00"}`}
          valueColor="blue"
          subtext="Current Month"
        />
        <StatCard
          label="Total Cleared"
          value={`﷼${data?.totalCleared.toFixed(2) || "0.00"}`}
          valueColor="green"
          subtext="Across Projects"
        />
        <StatCard
          label="Pending Balance"
          value={`﷼${data?.pendingBalance.toFixed(2) || "0.00"}`}
          valueColor="orange"
          subtext="Requires Action"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <Card title="Recent Transactions" className="h-full">
            <div className="mt-2 -mx-6 overflow-hidden">
              {data?.recentTransactions && data.recentTransactions.length > 0 ? (
                <Table
                  columns={[
                    { header: "Employee", accessor: "employeeName" as any },
                    { header: "Project", accessor: "projectName" as any },
                    { header: "Amount", accessor: "amountDisplay" as any },
                    { header: "Status", accessor: "statusDisplay" as any },
                    { header: "Date", accessor: "dateDisplay" as any },
                  ]}
                  data={data.recentTransactions.map((t) => ({
                    employeeName: <span className="font-semibold text-slate-700">{t.employee.name}</span>,
                    projectName: <span className="text-slate-500">{t.project.name}</span>,
                    amountDisplay: <span className="font-bold text-slate-900">﷼{t.amount.toFixed(2)}</span>,
                    statusDisplay: (
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.status === "CLEARED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    ),
                    dateDisplay: <span className="text-slate-400 text-xs italic">{new Date(t.issuedAt).toLocaleDateString()}</span>,
                  })) as any}
                />
              ) : (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Insights */}
        <div className="space-y-6">
          <Card title="Shortcuts" className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
            <div className="space-y-1 mt-4">
              <Link href="/projects" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group">
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Review Projects</span>
                <span className="text-slate-600 group-hover:text-white">→</span>
              </Link>
              <Link href="/reports" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group border-t border-white/5 pt-5">
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Generate Reports</span>
                <span className="text-slate-600 group-hover:text-white">→</span>
              </Link>
            </div>
          </Card>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase italic tracking-tight">Need Help?</h3>
              <p className="text-blue-100 text-xs mt-2 font-medium leading-relaxed opacity-80">
                Check our training manual for petty cash reconciliation processes.
              </p>
              <button className="mt-5 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                Documentation
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
