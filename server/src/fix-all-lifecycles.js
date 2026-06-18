import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SYNCHRONIZING & REPAIRING ALL ASSET LIFECYCLES ---');

  const assets = await prisma.asset.findMany({
    include: {
      allocations: {
        include: { employee: true }
      },
      returns: {
        include: { employee: true }
      }
    }
  });

  console.log(`Auditing ${assets.length} assets...`);

  let returnSyncCount = 0;
  let overlapFixCount = 0;

  for (const asset of assets) {
    // 1. SYNC RETURNS TO ALLOCATIONS
    // For each ReturnEvent, ensure its corresponding Allocation has matching actualReturnDate/expectedReturnDate
    for (const ret of asset.returns) {
      // Find the corresponding Allocation for this employee that was returned
      const matchingAlloc = asset.allocations.find(a => 
        a.employeeId === ret.employeeId && a.status === 'Returned'
      );

      if (matchingAlloc) {
        const retDateStr = new Date(ret.returnedAt).toISOString();
        const allocExpectedStr = matchingAlloc.expectedReturnDate ? new Date(matchingAlloc.expectedReturnDate).toISOString() : null;
        const allocActualStr = matchingAlloc.actualReturnDate ? new Date(matchingAlloc.actualReturnDate).toISOString() : null;

        // If dates don't perfectly match, sync the Allocation to match the ReturnEvent date!
        if (allocExpectedStr !== retDateStr || allocActualStr !== retDateStr) {
          await prisma.allocation.update({
            where: { id: matchingAlloc.id },
            data: {
              expectedReturnDate: ret.returnedAt,
              actualReturnDate: ret.returnedAt
            }
          });
          // Update local memory for step 2
          matchingAlloc.expectedReturnDate = ret.returnedAt;
          matchingAlloc.actualReturnDate = ret.returnedAt;
          returnSyncCount++;
        }
      }
    }

    // 2. ENFORCE CHRONOLOGICAL SEQUENCE OF ALLOCATIONS
    // Now that Allocations have true return dates synced from ReturnEvents, let's fix any overlaps
    if (asset.allocations.length <= 1) continue;

    // Sort allocations chronologically by start date
    const sortedAllocs = [...asset.allocations].sort((a, b) => new Date(a.allocatedAt) - new Date(b.allocatedAt));

    for (let i = 1; i < sortedAllocs.length; i++) {
      const prev = sortedAllocs[i - 1];
      const curr = sortedAllocs[i];

      // Use the actualReturnDate (now perfectly synced with ReturnEvent) or fallback to allocatedAt
      const prevReturnDate = new Date(prev.actualReturnDate || prev.expectedReturnDate || prev.allocatedAt);
      const currAllocDate = new Date(curr.allocatedAt);

      if (currAllocDate < prevReturnDate) {
        console.log(`⚠️ Resolving Lifecycle Overlap for ${asset.name} (${asset.assetId}):`);
        console.log(`  - Prev Holder: ${prev.employee?.firstName} returned on ${prevReturnDate.toLocaleDateString()}`);
        console.log(`  - Curr Holder: ${curr.employee?.firstName} was allocated early on ${currAllocDate.toLocaleDateString()}`);

        const newAllocDate = new Date(prevReturnDate);
        
        // Also if current expected return is now before new allocation date, push it forward!
        const currExpected = new Date(curr.expectedReturnDate);
        const updates = { allocatedAt: newAllocDate };
        
        if (currExpected && currExpected <= newAllocDate) {
           const duration = currExpected - currAllocDate; // ms
           updates.expectedReturnDate = new Date(newAllocDate.getTime() + (duration > 0 ? duration : 30*24*60*60*1000));
        }

        await prisma.allocation.update({
          where: { id: curr.id },
          data: updates
        });
        
        console.log(`  ✅ Shifted Curr Holder allocation strictly to ${newAllocDate.toLocaleDateString()}`);
        
        curr.allocatedAt = newAllocDate;
        if (updates.expectedReturnDate) curr.expectedReturnDate = updates.expectedReturnDate;
        overlapFixCount++;
      }
    }
  }

  console.log(`\nSuccessfully synchronized ${returnSyncCount} Allocation dates with ReturnEvents!`);
  console.log(`Successfully corrected ${overlapFixCount} chronological lifecycle overlaps!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
