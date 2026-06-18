import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING DAMAGE SYNC & INTEGRITY AUDIT ---');

  // 1. Audit active allocations for AST-1051 to determine its real status
  const allocs1051 = await prisma.allocation.findMany({
    where: { asset: { assetId: 'AST-1051' } },
    orderBy: { allocatedAt: 'desc' }
  });

  console.log('Allocations for AST-1051:');
  allocs1051.forEach(al => {
    console.log(`- ID: ${al.id}, Status: ${al.status}, AllocatedAt: ${al.allocatedAt}`);
  });

  const activeAlloc1051 = allocs1051.find(al => al.status === 'Active');
  const expectedStatus1051 = activeAlloc1051 ? 'Allocated' : 'In Stock';
  console.log(`Expected status for AST-1051: ${expectedStatus1051}`);

  // 2. Scan all assets in PostgreSQL to find their current open damage reports
  const allAssets = await prisma.asset.findMany({
    include: {
      damageReports: true,
      allocations: true
    }
  });

  console.log('\n--- SCANNING ALL ASSETS IN DATABASE ---');
  let fixedCount = 0;
  
  for (const asset of allAssets) {
    const openDamageReports = asset.damageReports.filter(d => d.status === 'Open' || d.status === 'In Repair');
    const hasOpenDamage = openDamageReports.length > 0;
    
    let expectedStatus = asset.status;
    
    if (hasOpenDamage) {
      expectedStatus = 'Damaged';
    } else {
      // If it is currently marked as Damaged but has no open damage report, restore it!
      if (asset.status === 'Damaged') {
        const activeAlloc = asset.allocations.find(al => al.status === 'Active');
        expectedStatus = activeAlloc ? 'Allocated' : 'In Stock';
      }
    }

    if (asset.status !== expectedStatus) {
      console.log(`🔄 Mismatch found for ${asset.name} (${asset.assetId}): DB is "${asset.status}", expected "${expectedStatus}"`);
      
      await prisma.asset.update({
        where: { id: asset.id },
        data: { status: expectedStatus }
      });
      
      fixedCount++;
    }
  }

  console.log(`\nUpdated ${fixedCount} asset statuses in PostgreSQL to be 100% consistent with damage reports and active allocations!`);

  // 3. Now let's query the final status counts in PostgreSQL
  const finalDamagedCount = await prisma.asset.count({
    where: { status: 'Damaged' }
  });
  const finalOpenReportsCount = await prisma.damageReport.count({
    where: { status: 'Open' }
  });
  console.log(`PostgreSQL Audit completed: Damaged Assets: ${finalDamagedCount}, Open Damage Reports: ${finalOpenReportsCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
