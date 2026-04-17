import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

// PATCH - Clear a transaction (mark as cleared and upload invoice)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
    const { invoiceUrl, clearingNote } = body;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || (!isAdmin && transaction.issuedById !== userId)) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status: "cleared",
        clearedAt: new Date(),
        invoiceUrl: invoiceUrl || null,
        clearingNote: clearingNote || null,
      },
      include: {
        employee: true,
        project: true,
        issuedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error clearing transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a transaction
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;
    const isAdmin = currentUser?.role === "ADMIN";

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || (!isAdmin && transaction.issuedById !== userId)) {
      return NextResponse.json(
        { error: "Transaction not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
