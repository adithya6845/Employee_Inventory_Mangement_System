import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- REPAIRING ALLOCATION CHRONOLOGY OVERLAPS ---');

  // 1. Fetch all assets with their allocations
  const assets = await prisma.asset.findMany({
    include: {
      allocations: {
        include: {
          employee: true
        }
      }
    }
  });

  console.log(`Auditing allocations chronology for ${assets.length} assets...`);

  let correctedCount = 0;

  for (const asset of assets) {
    if (asset.allocations.length <= 1) continue;

    // Sort allocations chronologically by expectedReturnDate / actualReturnDate or allocatedAt
    const sortedAllocs = [...asset.allocations].sort((a, b) => {
      const aDate = a.actualReturnDate || a.expectedReturnDate || a.allocatedAt;
      const bDate = b.actualReturnDate || b.expectedReturnDate || b.allocatedAt;
      return new Date(aDate) - new Date(bDate);
    });

    for (let i = 1; i < sortedAllocs.length; i++) {
      const prev = sortedAllocs[i - 1];
      const curr = sortedAllocs[i];

      const prevReturnDate = new Date(prev.actualReturnDate || prev.expectedReturnDate || prev.allocatedAt);
      const currAllocDate = new Date(curr.allocatedAt);

      // If current allocation starts BEFORE previous return, we have an overlap!
      if (currAllocDate < prevReturnDate) {
        console.log(`⚠️ Overlap detected for asset ${asset.name} (${asset.assetId}):`);
        console.log(`  - Prev: Allocated ${new Date(prev.allocatedAt).toLocaleDateString()} -> Returned ${prevReturnDate.toLocaleDateString()} (Employee: ${prev.employee?.firstName} ${prev.employee?.lastName})`);
        console.log(`  - Curr: Allocated ${currAllocDate.toLocaleDateString()} -> Expected ${new Date(curr.expectedReturnDate).toLocaleDateString()} (Employee: ${curr.employee?.firstName} ${curr.employee?.lastName})`);

        // Fix: Set the current allocation date to the previous return date
        const newAllocDate = new Date(prevReturnDate);
        
        // Update in DB
        await prisma.allocation.update({
          where: { id: curr.id },
          data: {
            allocatedAt: newAllocDate
          }
        });

        console.log(`  ✅ Shifted Curr Allocation date to prev return: ${newAllocDate.toLocaleDateString()}`);
        
        // Update local object so subsequent checks use the updated date
        curr.allocatedAt = newAllocDate;
        correctedCount++;
      }
    }
  }

  console.log(`\nSuccessfully corrected ${correctedCount} allocation chronology overlaps database-wide!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
