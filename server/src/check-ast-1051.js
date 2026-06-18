import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const asset = await prisma.asset.findUnique({
    where: { assetId: 'AST-1051' },
    include: {
      allocations: { include: { employee: true } },
      returns: { include: { employee: true } }
    }
  });

  console.log('--- AST-1051 ALLOCATIONS ---');
  asset.allocations.sort((a, b) => new Date(a.allocatedAt) - new Date(b.allocatedAt)).forEach(a => {
    console.log(`- ${a.employee.firstName}: Allocated on ${new Date(a.allocatedAt).toLocaleDateString()}, Returned on ${a.actualReturnDate ? new Date(a.actualReturnDate).toLocaleDateString() : 'N/A'}, Status: ${a.status}`);
  });

  console.log('\n--- AST-1051 RETURNS ---');
  asset.returns.sort((a, b) => new Date(a.returnedAt) - new Date(b.returnedAt)).forEach(r => {
    console.log(`- ${r.employee.firstName}: Returned on ${new Date(r.returnedAt).toLocaleDateString()}, Condition: ${r.condition}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
