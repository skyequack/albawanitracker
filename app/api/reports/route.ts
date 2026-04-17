import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

type ReportTransaction = Prisma.TransactionGetPayload<{
  include: {
    employee: true;
    project: true;
  };
}>;

type BreakdownRow = {
  id: string;
  name: string;
  issued: number;
  cleared: number;
  pending: number;
};

// GET - Generate monthly reports
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;
    const isAdmin = currentUser?.role === "ADMIN";
    const { searchParams } = new URL(request.url);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const month = searchParams.get("month"); // "2026-04"
    const year = searchParams.get("year"); // "2026"
    const projectId = searchParams.get("projectId");
    const employeeId = searchParams.get("employeeId");

    // Build date range for filtering
    let dateStart: Date | null = null;
    let dateEnd: Date | null = null;

    if (month) {
      const [y, m] = month.split("-");
      dateStart = new Date(`${y}-${m}-01`);
      dateEnd = new Date(dateStart);
      dateEnd.setMonth(dateEnd.getMonth() + 1);
    } else if (year) {
      dateStart = new Date(`${year}-01-01`);
      dateEnd = new Date(`${year}-12-31`);
      dateEnd.setDate(31);
    }

    // Build filter conditions
    const where: Prisma.TransactionWhereInput = isAdmin ? {} : { issuedById: userId };
    if (projectId) where.projectId = projectId;
    if (employeeId) where.employeeId = employeeId;
    if (dateStart && dateEnd) {
      where.issuedAt = {
        gte: dateStart,
        lt: dateEnd,
      };
    }

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        employee: true,
        project: true,
      },
    });

    // Calculate aggregates
    const totalIssued = transactions.reduce((sum: number, t: ReportTransaction) => sum + t.amount, 0);
    const totalCleared = transactions
      .filter((t: ReportTransaction) => t.status === "cleared")
      .reduce((sum: number, t: ReportTransaction) => sum + t.amount, 0);
    const pendingBalance = totalIssued - totalCleared;

    // Group by project
    const projectBreakdown: Record<string, BreakdownRow> = {};
    transactions.forEach((t: ReportTransaction) => {
      if (!projectBreakdown[t.project.id]) {
        projectBreakdown[t.project.id] = {
          id: t.project.id,
          name: t.project.name,
          issued: 0,
          cleared: 0,
          pending: 0,
        };
      }
      projectBreakdown[t.project.id].issued += t.amount;
      if (t.status === "cleared") {
        projectBreakdown[t.project.id].cleared += t.amount;
      }
    });

    Object.values(projectBreakdown).forEach((p) => {
      p.pending = p.issued - p.cleared;
    });

    // Group by employee
    const employeeBreakdown: Record<string, BreakdownRow> = {};
    transactions.forEach((t: ReportTransaction) => {
      if (!employeeBreakdown[t.employee.id]) {
        employeeBreakdown[t.employee.id] = {
          id: t.employee.id,
          name: t.employee.name,
          issued: 0,
          cleared: 0,
          pending: 0,
        };
      }
      employeeBreakdown[t.employee.id].issued += t.amount;
      if (t.status === "cleared") {
        employeeBreakdown[t.employee.id].cleared += t.amount;
      }
    });

    Object.values(employeeBreakdown).forEach((e) => {
      e.pending = e.issued - e.cleared;
    });

    return NextResponse.json({
      summary: {
        totalIssued,
        totalCleared,
        pendingBalance,
      },
      projectBreakdown: Object.values(projectBreakdown),
      employeeBreakdown: Object.values(employeeBreakdown),
      transactions,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
