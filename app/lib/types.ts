/**
 * Shared TypeScript types for the application
 */

export interface User {
  id: string;
  clerkId: string | null;
  email: string;
  name: string;
  role: "PM" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  note: string | null;
  employeeId: string;
  projectId: string;
  issuedById: string;
  status: "issued" | "cleared" | "pending";
  issuedAt: Date;
  clearedAt: Date | null;
  invoiceUrl: string | null;
  clearingNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
  project?: Project;
  issuedBy?: Partial<User>;
}

export interface MonthlyReport {
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
  transactions?: Transaction[];
}

export type TransactionStatus = "issued" | "cleared" | "pending";

export type UserRole = "PM" | "ADMIN";
