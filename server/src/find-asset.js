import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = await prisma.asset.findMany({
    include: {
      allocations: { include: { employee: true } },
      returns: { include: { employee: true } }
    }
  });

  for (const asset of assets) {
    const allocEmps = asset.allocations.map(a => a.employee?.firstName);
    
    // Look for an asset that has allocations or returns involving Neha, Diya, and Rohan
    if (allocEmps.includes('Neha') && allocEmps.includes('Diya') && allocEmps.includes('Rohan')) {
       console.log(`\nFound exact candidate asset: ${asset.assetId} - ${asset.name}`);
       console.log('--- ALLOCATIONS ---');
       asset.allocations.sort((a,b) => new Date(a.allocatedAt) - new Date(b.allocatedAt)).forEach(a => 
         console.log(`  ${a.employee.firstName} on ${new Date(a.allocatedAt).toLocaleDateString()}, Expected: ${new Date(a.expectedReturnDate).toLocaleDateString()}, Actual: ${new Date(a.actualReturnDate).toLocaleDateString()}`)
       );
       console.log('--- RETURNS ---');
       asset.returns.sort((a,b) => new Date(a.returnedAt) - new Date(b.returnedAt)).forEach(r => 
         console.log(`  ${r.employee.firstName} on ${new Date(r.returnedAt).toLocaleDateString()}`)
       );
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
