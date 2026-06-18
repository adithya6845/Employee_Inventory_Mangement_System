import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== AUDITING ACTIVE ALLOCATIONS VS ASSET STATUS ===');
  
  const activeAllocs = await prisma.allocation.findMany({
    where: { status: 'Active' },
    include: { asset: true, employee: true }
  });

  console.log(`Total Active Allocations in DB: ${activeAllocs.length}`);

  let mismatchedCount = 0;
  for (const alloc of activeAllocs) {
    if (!alloc.asset) {
      console.log(`⚠️ Allocation ID ${alloc.id} has no associated asset!`);
      continue;
    }
    
    if (alloc.asset.status !== 'Allocated') {
      console.log(`❌ Mismatch: Allocation ID ${alloc.id} is Active for ${alloc.asset.name} (${alloc.asset.assetId}), but asset status is "${alloc.asset.status}"!`);
      mismatchedCount++;
    }
  }

  console.log(`Total mismatched assets: ${mismatchedCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
