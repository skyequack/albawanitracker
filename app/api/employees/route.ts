import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// GET all employees
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const employees = await prisma.employee.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, employeeId, role } = body;
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedRole = typeof role === "string" ? role.trim() : "";
    const trimmedEmployeeId = typeof employeeId === "string" ? employeeId.trim() : "";

    if (!trimmedName) {
      return NextResponse.json(
        { error: "Employee name is required" },
        { status: 400 }
      );
    }

    if (!trimmedRole) {
      return NextResponse.json(
        { error: "Employee role is required" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name: trimmedName,
        employeeId: trimmedEmployeeId || null,
        role: trimmedRole,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
