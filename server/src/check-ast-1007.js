import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const asset = await prisma.asset.findFirst({
    where: { assetId: 'AST-1007' },
    include: {
      allocations: {
        include: {
          employee: true
        }
      },
      returns: {
        include: {
          employee: true
        }
      }
    }
  });

  console.log('=== AST-1007 DATABASE AUDIT ===');
  if (!asset) {
    console.log('Asset AST-1007 not found!');
    return;
  }

  console.log(`Asset: ${asset.name} (${asset.assetId}), Status: ${asset.status}`);
  
  console.log('\n--- ALLOCATIONS ---');
  asset.allocations.forEach(al => {
    console.log(`- ID: ${al.id}, Employee: ${al.employee?.firstName} ${al.employee?.lastName} (${al.employee?.employeeId}), Status: ${al.status}, AllocatedAt: ${al.allocatedAt}`);
  });

  console.log('\n--- RETURNS ---');
  asset.returns.forEach(r => {
    console.log(`- ID: ${r.id}, Employee: ${r.employee?.firstName} ${r.employee?.lastName} (${r.employee?.employeeId}), ReturnedAt: ${r.returnedAt}, Condition: ${r.condition}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
