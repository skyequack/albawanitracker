import { prisma } from "./app/lib/prisma";

async function debug() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  
  const albawani = users.find(u => u.name === "Al Bawani Admin");
  
  console.log("=== ALL USERS ===");
  users.forEach(u => console.log(`${u.name} (${u.email}): ${u.role}`));
  
  console.log("\n=== AL BAWANI ADMIN ===");
  console.log(`Name: ${albawani?.name}`);
  console.log(`Email: ${albawani?.email}`);
  console.log(`ID: ${albawani?.id}`);
  console.log(`Role: ${albawani?.role}`);
  
  await prisma.$disconnect();
}

debug();
