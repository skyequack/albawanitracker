require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const fillerEmployees = [
    { name: "أحمد محمد", employeeId: "EMP001" },
    { name: "فاطمة علي", employeeId: "EMP002" },
    { name: "محمود حسن", employeeId: "EMP003" },
    { name: "سارة خالد", employeeId: "EMP004" },
    { name: "عمر سلطان", employeeId: "EMP005" },
  ];

  try {
    for (const employee of fillerEmployees) {
      const existing = await prisma.employee.findUnique({
        where: { employeeId: employee.employeeId },
      });

      if (!existing) {
        const created = await prisma.employee.create({
          data: employee,
        });
        console.log(`Created employee: ${created.name} (${created.employeeId})`);
      } else {
        console.log(`Employee already exists: ${existing.name}`);
      }
    }

    console.log("✓ Filler employees added successfully!");
  } catch (error) {
    console.error("Error adding employees:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
