import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emp = await prisma.employee.findFirst({
    where: { firstName: 'Neha', lastName: 'Joshi' },
    include: {
      allocations: { include: { asset: true } }
    }
  });
  
  if (!emp) {
    console.log('Employee Neha Joshi not found.');
    return;
  }
  
  console.log(`Neha Joshi (${emp.employeeId}) Allocations:`);
  emp.allocations.forEach(a => {
    console.log(`ID: ${a.id}, Asset: ${a.asset?.assetId} (${a.asset?.name}), Status: ${a.status}, AllocatedAt: ${a.allocatedAt}, ReturnedAt: ${a.actualReturnDate}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
