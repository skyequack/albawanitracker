import { prisma } from "./app/lib/prisma";

async function updateUserRole() {
  try {
    // Find "omer" user to get their role
    const omerUser = await prisma.user.findFirst({
      where: {
        name: "omer",
      },
    });

    if (!omerUser) {
      console.log("User 'omer' not found");
      return;
    }

    console.log(`Found 'omer' with role: ${omerUser.role}`);

    // Update "albawani_user" to have the same role as "omer"
    const updatedUser = await prisma.user.updateMany({
      where: {
        name: "albawani_user",
      },
      data: {
        role: omerUser.role,
      },
    });

    console.log(`Updated ${updatedUser.count} user(s)`);
    if (updatedUser.count > 0) {
      // Verify the update
      const verifyUser = await prisma.user.findFirst({
        where: {
          name: "albawani_user",
        },
      });
      console.log(
        `Verified: 'albawani_user' now has role: ${verifyUser?.role}`
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
