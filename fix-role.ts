import { prisma } from "./app/lib/prisma";

async function fixRole() {
  const updated = await prisma.user.update({
    where: { email: "altamash@bawaniint.com" },
    data: { role: "ADMIN" },
  });
  
  console.log(`✓ Updated ${updated.name} to role: ${updated.role}`);
  await prisma.$disconnect();
}

fixRole();
