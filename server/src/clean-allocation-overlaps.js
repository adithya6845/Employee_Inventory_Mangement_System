import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Database Allocation Chronology Cleaner...');
  
  const employees = await prisma.employee.findMany({
    include: {
      allocations: {
        include: { asset: true }
      }
    }
  });

  let correctedAllocations = 0;
  let createdReturns = 0;

  for (const emp of employees) {
    // Group allocations by asset category
    const groups = {};
    emp.allocations.forEach(alloc => {
      if (!alloc.asset) return;
      const cat = (alloc.asset.category || 'General').toLowerCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(alloc);
    });

    // Process each category group
    for (const cat of Object.keys(groups)) {
      const list = groups[cat];
      if (list.length <= 1) continue;

      // Sort by allocatedAt ascending
      list.sort((a, b) => new Date(a.allocatedAt) - new Date(b.allocatedAt));

      for (let i = 0; i < list.length - 1; i++) {
        const current = list[i];
        const next = list[i + 1];

        if (current.status === 'Active') {
          // Calculate realistic return date: 2 days before next allocation
          const currentAllocDate = new Date(current.allocatedAt);
          const nextAllocDate = new Date(next.allocatedAt);
          
          let returnDate = new Date(nextAllocDate.getTime() - 2 * 24 * 60 * 60 * 1000);
          // Safety fallback: if return date is before allocation date, set it in between
          if (returnDate <= currentAllocDate) {
            returnDate = new Date(currentAllocDate.getTime() + (nextAllocDate.getTime() - currentAllocDate.getTime()) / 2);
          }

          // 1. Update Allocation
          await prisma.allocation.update({
            where: { id: current.id },
            data: {
              status: 'Returned',
              actualReturnDate: returnDate
            }
          });

          // 2. Log corresponding ReturnEvent
          await prisma.returnEvent.create({
            data: {
              assetId: current.assetId,
              employeeId: current.employeeId,
              returnedAt: returnDate,
              condition: 'Good',
              notes: 'Returned in good condition during upgrade.'
            }
          });

          // 3. Update Asset cached status to In Stock if there are no open damage reports
          const openDamages = await prisma.damageReport.count({
            where: { assetId: current.assetId, status: { in: ['Open', 'In Repair'] } }
          });

          await prisma.asset.update({
            where: { id: current.assetId },
            data: { status: openDamages > 0 ? 'Damaged' : 'In Stock' }
          });

          correctedAllocations++;
          createdReturns++;
          console.log(`- Cleaned overlap: Emp ${emp.firstName} returned ${current.asset.name} (${current.asset.assetId}) on ${returnDate.toLocaleDateString()}`);
        }
      }
    }
  }

  console.log(`Database Allocation Chronology Cleaned!`);
  console.log(`- Overlapping allocations marked Returned: ${correctedAllocations}`);
  console.log(`- ReturnEvent records generated: ${createdReturns}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
