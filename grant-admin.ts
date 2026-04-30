import { prisma } from "./app/lib/prisma";

async function updateAlBawaniToAdmin() {
  try {
    // Update "Al Bawani Admin" to have ADMIN role using email (unique constraint)
    const updatedUser = await prisma.user.update({
      where: {
        email: "altamash@bawaniint.com",
      },
      data: {
        role: "ADMIN",
      },
    });

    console.log(`✓ Successfully updated user: ${updatedUser.name}`);
    console.log(`  Email: ${updatedUser.email}`);
    console.log(`  Old role: PM → New role: ${updatedUser.role}`);
    console.log(`  Updated at: ${updatedUser.updatedAt}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAlBawaniToAdmin();
