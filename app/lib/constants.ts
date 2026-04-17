/**
 * Application-wide constants
 */

export const APP_NAME = "Petty Cash Tracker";

export const TRANSACTION_STATUS = {
  ISSUED: "issued",
  CLEARED: "cleared",
  PENDING: "pending",
} as const;

export const TRANSACTION_STATUS_LABELS = {
  issued: "Issued",
  cleared: "Cleared",
  pending: "Pending",
} as const;

export const ROLE = {
  PM: "PM",
} as const;

export const PAGE_TITLES = {
  DASHBOARD: "Dashboard",
  PROJECTS: "Projects",
  TRANSACTIONS: "Transactions",
  REPORTS: "Reports",
} as const;

export const ROUTES = {
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
} as const;

// Format constants
export const CURRENCY_FORMAT = "USD";

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_MAX_RESULTS = 100;
