import { prisma } from "./app/lib/prisma";

async function listAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        clerkId: true,
      },
    });

    console.log("All users in database:");
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers();
