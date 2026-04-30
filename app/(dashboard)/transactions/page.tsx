"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Select } from "@/app/components/Select";
import { Modal } from "@/app/components/Modal";
import { Table } from "@/app/components/Table";

interface Transaction {
  id: string;
  amount: number;
  note: string | null;
  status: string;
  issuedAt: string;
  employee: { id: string; name: string };
  project: { id: string; name: string };
}

interface Project {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string | null;
  role: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Issue Money Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    amount: "",
    note: "",
    employeeId: "",
    projectId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear Modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [clearFormData, setClearFormData] = useState({
    invoiceUrl: "",
    clearingNote: "",
  });

  // Filter
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, projRes, empRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/projects"),
        fetch("/api/employees"),
      ]);

      if (!transRes.ok || !projRes.ok || !empRes.ok) {
        throw new Error("Failed to fetch data");
      }

      setTransactions(await transRes.json());
      setProjects(await projRes.json());
      setEmployees(await empRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueMoney = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueFormData.amount || !issueFormData.employeeId || !issueFormData.projectId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...issueFormData,
          employeeId: issueFormData.employeeId,
          amount: parseFloat(issueFormData.amount),
        }),
      });

      if (!response.ok) throw new Error("Failed to create transaction");

      const newTrans = await response.json();
      setTransactions([newTrans, ...transactions]);
      setIsIssueModalOpen(false);
      setIssueFormData({ amount: "", note: "", employeeId: "", projectId: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to issue money");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/transactions/${selectedTransaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clearFormData),
      });

      if (!response.ok) throw new Error("Failed to clear transaction");

      const updated = await response.json();
      setTransactions(
        transactions.map((t) => (t.id === updated.id ? updated : t))
      );
      setIsClearModalOpen(false);
      setSelectedTransaction(null);
      setClearFormData({ invoiceUrl: "", clearingNote: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to clear transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openClearModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsClearModalOpen(true);
  };

  const filteredTransactions =
    statusFilter === "all"
      ? transactions
      : transactions.filter((t) => t.status === statusFilter);

  if (loading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setIsIssueModalOpen(true)}>+ Issue Money</Button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Filter */}
      <div className="mb-6">
        <Select
          label="Filter by Status"
          options={[
            { value: "all", label: "All" },
            { value: "issued", label: "Issued" },
            { value: "cleared", label: "Cleared" },
            { value: "pending", label: "Pending" },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <Card>
        {filteredTransactions.length > 0 ? (
          <Table
            columns={[
              { header: "Employee", accessor: "employeeName" },
              { header: "Project", accessor: "projectName" },
              { header: "Amount", accessor: "amountDisplay" },
              { header: "Status", accessor: "status" },
              { header: "Issued", accessor: "issuedDisplay" },
              { header: "Action", accessor: "action" },
            ]}
            data={filteredTransactions.map((t) => ({
              employeeName: t.employee.name,
              projectName: t.project.name,
              amountDisplay: `﷼${t.amount.toFixed(2)}`,
              status: t.status,
              issuedDisplay: new Date(t.issuedAt).toLocaleDateString(),
              action:
                t.status === "issued" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      openClearModal(t);
                    }}
                  >
                    Clear
                  </Button>
                ) : (
                  t.status
                ),
            }))}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions found</p>
        )}
      </Card>

      {/* Issue Money Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Money"
      >
        <form onSubmit={handleIssueMoney} className="space-y-4">
          <Select
            label="Project"
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            value={issueFormData.projectId}
            onChange={(e) =>
              setIssueFormData({ ...issueFormData, projectId: e.target.value })
            }
            required
          />

          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <Select
              options={employees.map((e) => ({
                value: e.id,
                label: `${e.name} (${e.role})`,
              }))}
              value={issueFormData.employeeId}
              onChange={(e) =>
                setIssueFormData({
                  ...issueFormData,
                  employeeId: e.target.value,
                })
              }
            />
            {employees.length === 0 && (
              <p className="text-sm text-amber-600">
                No employees exist yet. Ask an admin to add one first.
              </p>
            )}
          </div>

          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={issueFormData.amount}
            onChange={(e) =>
              setIssueFormData({ ...issueFormData, amount: e.target.value })
            }
            placeholder="0.00"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={issueFormData.note}
              onChange={(e) =>
                setIssueFormData({ ...issueFormData, note: e.target.value })
              }
              placeholder="Short description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
                type="button"
              onClick={() => setIsIssueModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Issue Money
            </Button>
          </div>
        </form>
      </Modal>

      {/* Clear Transaction Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Transaction"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p>
                <strong>Employee:</strong> {selectedTransaction.employee.name}
              </p>
              <p>
                <strong>Project:</strong> {selectedTransaction.project.name}
              </p>
              <p>
                <strong>Amount:</strong> ﷼{selectedTransaction.amount.toFixed(2)}
              </p>
            </div>

            <Input
              label="Invoice URL (Optional)"
              type="text"
              value={clearFormData.invoiceUrl}
              onChange={(e) =>
                setClearFormData({
                  ...clearFormData,
                  invoiceUrl: e.target.value,
                })
              }
              placeholder="https://..."
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clearing Note (Optional)
              </label>
              <textarea
                value={clearFormData.clearingNote}
                onChange={(e) =>
                  setClearFormData({
                    ...clearFormData,
                    clearingNote: e.target.value,
                  })
                }
                placeholder="Any notes about this clearance"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsClearModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleClearTransaction}
                isLoading={isSubmitting}
              >
                Clear Transaction
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
