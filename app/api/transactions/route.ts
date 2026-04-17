import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// GET all transactions for the current user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;
    const isAdmin = currentUser?.role === "ADMIN";
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const projectId = searchParams.get("projectId");

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const where: Prisma.TransactionWhereInput = isAdmin ? {} : { issuedById: userId };
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        employee: true,
        project: true,
        issuedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new transaction (issue money)
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;
    const isAdmin = currentUser?.role === "ADMIN";

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, note, employeeId, projectId } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!employeeId || !projectId) {
      return NextResponse.json(
        { error: "Employee and project are required" },
        { status: 400 }
      );
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || (!isAdmin && project.createdBy !== userId)) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        note: note || null,
        employeeId,
        projectId,
        issuedById: userId,
        status: "issued",
      },
      include: {
        employee: true,
        project: true,
        issuedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
