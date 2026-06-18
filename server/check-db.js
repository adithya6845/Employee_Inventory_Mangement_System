import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const assets = await prisma.asset.count();
  const employees = await prisma.employee.count();
  console.log(`Assets in DB: ${assets}`);
  console.log(`Employees in DB: ${employees}`);
}
main().finally(() => prisma.$disconnect());
