"use client";

import { useEffect, useState } from "react";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Table } from "@/app/components/Table";

interface ReportData {
  summary: {
    totalIssued: number;
    totalCleared: number;
    pendingBalance: number;
  };
  projectBreakdown: Array<{
    id: string;
    name: string;
    issued: number;
    cleared: number;
    pending: number;
  }>;
  employeeBreakdown: Array<{
    id: string;
    name: string;
    issued: number;
    cleared: number;
    pending: number;
  }>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reports?month=${month}`);
        if (!response.ok) throw new Error("Failed to fetch report");
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [month]);

  if (loading) {
    return <div className="text-center py-8">Loading report...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      {/* Filter */}
      <div className="mb-8 max-w-xs">
        <Input
          label="Select Month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {/* Summary Cards */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card title="Total Issued">
              <p className="text-3xl font-bold text-blue-600">
                ﷼{reportData.summary.totalIssued.toFixed(2)}
              </p>
            </Card>
            <Card title="Total Cleared">
              <p className="text-3xl font-bold text-green-600">
                ﷼{reportData.summary.totalCleared.toFixed(2)}
              </p>
            </Card>
            <Card title="Pending Balance">
              <p className="text-3xl font-bold text-orange-600">
                ﷼{reportData.summary.pendingBalance.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Project Breakdown */}
          <Card title="Project-wise Breakdown" className="mb-8">
            {reportData.projectBreakdown.length > 0 ? (
              <Table
                columns={[
                  { header: "Project", accessor: "name" },
                  { header: "Issued", accessor: "issuedDisplay" },
                  { header: "Cleared", accessor: "clearedDisplay" },
                  { header: "Pending", accessor: "pendingDisplay" },
                ]}
                data={reportData.projectBreakdown.map((p) => ({
                  name: p.name,
                  issuedDisplay: `﷼${p.issued.toFixed(2)}`,
                  clearedDisplay: `﷼${p.cleared.toFixed(2)}`,
                  pendingDisplay: `﷼${p.pending.toFixed(2)}`,
                }))}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No data for selected month
              </p>
            )}
          </Card>

          {/* Employee Breakdown */}
          <Card title="Employee-wise Breakdown">
            {reportData.employeeBreakdown.length > 0 ? (
              <Table
                columns={[
                  { header: "Employee", accessor: "name" },
                  { header: "Issued", accessor: "issuedDisplay" },
                  { header: "Cleared", accessor: "clearedDisplay" },
                  { header: "Pending", accessor: "pendingDisplay" },
                ]}
                data={reportData.employeeBreakdown.map((e) => ({
                  name: e.name,
                  issuedDisplay: `﷼${e.issued.toFixed(2)}`,
                  clearedDisplay: `﷼${e.cleared.toFixed(2)}`,
                  pendingDisplay: `﷼${e.pending.toFixed(2)}`,
                }))}
              />
            ) : (
              <p className="text-gray-500 text-center py-4">
                No data for selected month
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
