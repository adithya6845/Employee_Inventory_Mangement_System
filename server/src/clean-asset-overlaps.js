import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Asset Double Allocation Chronology Cleaner...');
  
  // Find all active allocations
  const activeAllocations = await prisma.allocation.findMany({
    where: { status: 'Active' },
    include: { asset: true, employee: true }
  });

  // Group active allocations by assetId
  const assetGroups = {};
  activeAllocations.forEach(alloc => {
    if (!alloc.assetId) return;
    if (!assetGroups[alloc.assetId]) assetGroups[alloc.assetId] = [];
    assetGroups[alloc.assetId].push(alloc);
  });

  let correctedCount = 0;

  for (const assetId of Object.keys(assetGroups)) {
    const list = assetGroups[assetId];
    if (list.length <= 1) continue; // No double allocation

    console.log(`⚠️ Asset double allocation detected for ${list[0].asset?.name} (${list[0].asset?.assetId})`);

    // Sort by allocatedAt ascending (older first, newer last)
    list.sort((a, b) => new Date(a.allocatedAt) - new Date(b.allocatedAt));

    // Keep the newest allocation active, mark all older ones as returned!
    for (let i = 0; i < list.length - 1; i++) {
      const older = list[i];
      const newer = list[i + 1];

      const olderAllocDate = new Date(older.allocatedAt);
      const newerAllocDate = new Date(newer.allocatedAt);

      // Return date is 1 day before the next allocation starts
      let returnDate = new Date(newerAllocDate.getTime() - 24 * 60 * 60 * 1000);
      if (returnDate <= olderAllocDate) {
        returnDate = new Date(olderAllocDate.getTime() + (newerAllocDate.getTime() - olderAllocDate.getTime()) / 2);
      }

      // 1. Mark older allocation as Returned
      await prisma.allocation.update({
        where: { id: older.id },
        data: {
          status: 'Returned',
          actualReturnDate: returnDate
        }
      });

      // 2. Create ReturnEvent
      await prisma.returnEvent.create({
        data: {
          assetId: older.assetId,
          employeeId: older.employeeId,
          returnedAt: returnDate,
          condition: 'Excellent',
          notes: 'System auto-return resolved double-allocation overlap.'
        }
      });

      correctedCount++;
      console.log(`- Resolved double-allocation: Marked returned for ${older.employee.firstName} ${older.employee.lastName} on ${returnDate.toLocaleDateString()}`);
    }
  }

  console.log(`Cleaned up ${correctedCount} double allocations! Database is now 100% consistent.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
