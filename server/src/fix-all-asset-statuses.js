import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RUNNING FULL DATABASE INTEGRITY & SYNC ---');

  // 1. Get all assets with their allocations and damage reports
  const assets = await prisma.asset.findMany({
    include: {
      allocations: true,
      damageReports: true
    }
  });

  console.log(`Total Assets in Database: ${assets.length}`);

  let updatedCount = 0;
  
  for (const asset of assets) {
    // Determine expected status
    const hasOpenDamage = asset.damageReports.some(d => d.status === 'Open' || d.status === 'In Repair');
    const hasActiveAllocation = asset.allocations.some(al => al.status === 'Active');

    let expectedStatus = 'In Stock';
    if (hasOpenDamage) {
      expectedStatus = 'Damaged';
    } else if (hasActiveAllocation) {
      expectedStatus = 'Allocated';
    }

    if (asset.status !== expectedStatus) {
      console.log(`🔄 Correcting status for ${asset.name} (${asset.assetId}): "${asset.status}" -> "${expectedStatus}"`);
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: expectedStatus }
      });
      updatedCount++;
    }
  }

  console.log(`\nCorrected ${updatedCount} asset statuses.`);

  // 2. Query final counts
  const finalCounts = await prisma.asset.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });

  console.log('\n--- FINAL INTEGRITY STATS ---');
  let sum = 0;
  finalCounts.forEach(c => {
    console.log(`- ${c.status}: ${c._count.status}`);
    sum += c._count.status;
  });
  console.log(`Sum: ${sum} assets.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
