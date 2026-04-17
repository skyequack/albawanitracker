import { auth, clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/app/lib/prisma";

const SUPERUSER_USERNAME = "omer";

/**
 * Get the current user from Clerk and ensure a matching Prisma user exists.
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Clerk user is missing an email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email;

  const role = clerkUser.username === SUPERUSER_USERNAME ? "ADMIN" : "PM";

  return prisma.user.upsert({
    where: { id: userId },
    update: {
      clerkId: userId,
      email,
      name,
      role,
    },
    create: {
      id: userId,
      clerkId: userId,
      email,
      name,
      role,
    },
  });
}

/**
 * Verify if the user is a PM (Project Manager)
 */
export function isPM(role?: string): boolean {
  return role === "PM" || role === "ADMIN";
}

/**
 * Verify if the user is the superuser/admin.
 */
export function isAdmin(role?: string): boolean {
  return role === "ADMIN";
}

/**
 * Extract user ID from request
 * This will be replaced with Clerk's user ID extraction
 */
export function getUserIdFromHeaders(): string | null {
  // TODO: Extract from Clerk session
  return null;
}
