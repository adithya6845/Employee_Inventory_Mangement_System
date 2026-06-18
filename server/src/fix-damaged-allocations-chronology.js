import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- REPAIRING ALLOCATIONS OCCURRING DURING ACTIVE REPAIRS ---');

  const damages = await prisma.damageReport.findMany({
    include: {
      asset: {
        include: {
          allocations: {
            include: { employee: true }
          }
        }
      }
    }
  });

  console.log(`Auditing allocations for ${damages.length} damage events...`);

  let shiftedCount = 0;

  for (const dam of damages) {
    const damageDate = new Date(dam.reportedAt);
    const repairCompleteDate = new Date(damageDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

    console.log(`\nAudit for Asset: ${dam.asset?.name} (${dam.asset?.assetId})`);
    console.log(`  - Damaged on: ${damageDate.toLocaleDateString()}`);
    console.log(`  - Repair Completed on: ${repairCompleteDate.toLocaleDateString()}`);

    // Find allocations that start after the damage date but BEFORE the repair completes
    const overlappingAllocs = dam.asset?.allocations.filter(alloc => {
      const allocStart = new Date(alloc.allocatedAt);
      return allocStart >= damageDate && allocStart < repairCompleteDate;
    }) || [];

    for (const alloc of overlappingAllocs) {
      console.log(`  ⚠️ Overlapping Allocation found for employee: ${alloc.employee?.firstName} ${alloc.employee?.lastName}`);
      console.log(`    - Originally Allocated on: ${new Date(alloc.allocatedAt).toLocaleDateString()}`);
      
      // Shift the allocation start date to the repair completion date!
      await prisma.allocation.update({
        where: { id: alloc.id },
        data: {
          allocatedAt: repairCompleteDate
        }
      });

      console.log(`    ✅ Shifted allocation start to: ${repairCompleteDate.toLocaleDateString()}`);
      shiftedCount++;
    }
  }

  console.log(`\nSuccessfully shifted ${shiftedCount} allocations to start after their respective assets were fully repaired!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
