import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SCANNING AND REMOVING ALL EXTRA/DUPLICATE RETURN EVENTS ---');

  const assets = await prisma.asset.findMany({
    include: {
      allocations: { include: { employee: true } },
      returns: { include: { employee: true } }
    }
  });

  console.log(`Auditing returns for ${assets.length} assets...`);

  let deletedCount = 0;

  for (const asset of assets) {
    // Group allocations and returns by employeeId
    const empAllocations = {};
    const empReturns = {};

    asset.allocations.forEach(alloc => {
      if (!empAllocations[alloc.employeeId]) empAllocations[alloc.employeeId] = [];
      empAllocations[alloc.employeeId].push(alloc);
    });

    asset.returns.forEach(ret => {
      if (!empReturns[ret.employeeId]) empReturns[ret.employeeId] = [];
      empReturns[ret.employeeId].push(ret);
    });

    // Check for each employee if they have more returns than allocations
    for (const employeeId of Object.keys(empReturns)) {
      const returnsList = empReturns[employeeId].sort((a, b) => new Date(a.returnedAt) - new Date(b.returnedAt));
      const allocsList = (empAllocations[employeeId] || []).sort((a, b) => new Date(a.allocatedAt) - new Date(b.allocatedAt));

      if (returnsList.length > allocsList.length) {
        console.log(`\n⚠️ Discrepancy found for Asset: ${asset.name} (${asset.assetId})`);
        const emp = returnsList[0].employee;
        console.log(`  - Employee: ${emp?.firstName} ${emp?.lastName} (${emp?.employeeId})`);
        console.log(`  - Returns count: ${returnsList.length}`);
        console.log(`  - Allocations count: ${allocsList.length}`);

        // Keep the returns that align with the allocations, delete the extra ones
        // We will keep the latest matching returns, or pair them chronologically
        const returnsToKeep = [];
        const returnsToDelete = [];

        // For each allocation, find the closest subsequent return event
        const pairedReturnIds = new Set();

        allocsList.forEach(alloc => {
          const allocDate = new Date(alloc.allocatedAt);
          // Find the first return that happened after this allocation and hasn't been paired yet
          const matchingRet = returnsList.find(r => 
            new Date(r.returnedAt) >= allocDate && !pairedReturnIds.has(r.id)
          );

          if (matchingRet) {
            returnsToKeep.push(matchingRet);
            pairedReturnIds.add(matchingRet.id);
          }
        });

        // Any return event that was not paired with an allocation is an extra duplicate!
        returnsList.forEach(r => {
          if (!pairedReturnIds.has(r.id)) {
            returnsToDelete.push(r.id);
            console.log(`    ❌ Flagged for deletion: Return on ${new Date(r.returnedAt).toLocaleDateString()} (ID: ${r.id})`);
          }
        });

        if (returnsToDelete.length > 0) {
          await prisma.returnEvent.deleteMany({
            where: {
              id: { in: returnsToDelete }
            }
          });
          deletedCount += returnsToDelete.length;
          console.log(`    ✅ Successfully deleted ${returnsToDelete.length} extra return records!`);
        }
      }
    }
  }

  console.log(`\nSuccessfully deleted ${deletedCount} extra return records database-wide!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
