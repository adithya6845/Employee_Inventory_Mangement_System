import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const returns = await prisma.returnReport.findMany({
    include: { asset: true, employee: true }
  });
  console.log('ACTIVE RETURNS IN DATABASE:');
  returns.forEach(r => {
    console.log(`ID: ${r.id}, Asset: ${r.asset?.assetId}, Emp: ${r.employee?.firstName} ${r.employee?.lastName} (${r.employee?.employeeId}), Date: ${r.returnedAt}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
