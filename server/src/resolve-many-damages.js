import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RESOLVING 8 OUT OF 10 DAMAGE REPORTS ---');

  // 1. Get all damage reports sorted by ID or date
  const reports = await prisma.damageReport.findMany({
    orderBy: { reportedAt: 'asc' }
  });

  console.log(`Found ${reports.length} total damage reports in database.`);

  // Resolve the first 8 damage reports, leave 2 open
  let resolvedCount = 0;
  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    let newStatus = 'Open';

    if (i < 8) {
      newStatus = 'Resolved';
      resolvedCount++;
    }

    await prisma.damageReport.update({
      where: { id: report.id },
      data: { status: newStatus }
    });

    console.log(`- Damage Report for Asset ID ${report.assetId}: Status updated to "${newStatus}"`);
  }

  console.log(`\nSuccessfully set ${resolvedCount} damage reports to "Resolved".`);

  // 2. Synchronize all asset statuses based on the updated damage reports & allocations
  console.log('\n--- SYNCHRONIZING ASSET STATUSES WITH RESOLVED DAMAGE REPORTS ---');
  
  const assets = await prisma.asset.findMany({
    include: {
      allocations: true,
      damageReports: true
    }
  });

  let correctedCount = 0;
  for (const asset of assets) {
    const hasOpenDamage = asset.damageReports.some(d => d.status === 'Open' || d.status === 'In Repair' || d.status === 'Pending');
    const hasActiveAllocation = asset.allocations.some(al => al.status === 'Active');

    let expectedStatus = 'In Stock';
    if (hasOpenDamage) {
      expectedStatus = 'Damaged';
    } else if (hasActiveAllocation) {
      expectedStatus = 'Allocated';
    }

    if (asset.status !== expectedStatus) {
      console.log(`🔄 Sync status for ${asset.name} (${asset.assetId}): "${asset.status}" -> "${expectedStatus}"`);
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: expectedStatus }
      });
      correctedCount++;
    }
  }

  console.log(`\nCorrected ${correctedCount} asset cached statuses.`);

  // 3. Print final status counts
  const finalCounts = await prisma.asset.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  console.log('\n--- FINAL DATABASE STATS ---');
  finalCounts.forEach(c => {
    console.log(`- ${c.status}: ${c._count.status}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
