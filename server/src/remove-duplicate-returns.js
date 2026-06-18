import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SCANNING AND DELETING DUPLICATE RETURN EVENTS ---');

  // 1. First Pass: Delete exact duplicate return events (same asset, employee, and return date)
  const returns = await prisma.returnEvent.findMany();
  console.log(`Current return events count: ${returns.length}`);

  const seenKeys = new Set();
  const exactDuplicatesToDelete = [];

  returns.forEach(r => {
    const key = `${r.assetId}-${r.employeeId}-${new Date(r.returnedAt).getTime()}`;
    if (seenKeys.has(key)) {
      exactDuplicatesToDelete.push(r.id);
    } else {
      seenKeys.add(key);
    }
  });

  console.log(`Found ${exactDuplicatesToDelete.length} exact duplicate ReturnEvent records.`);
  
  for (const id of exactDuplicatesToDelete) {
    await prisma.returnEvent.delete({ where: { id } });
    console.log(`🗑️ Deleted exact duplicate ReturnEvent: ID ${id}`);
  }

  // 2. Second Pass: Scan for consecutive returns for the same asset without an intervening allocation
  console.log('\n--- SCANNING FOR CONSECUTIVE RETURNS FOR THE SAME ASSET ---');
  
  const assets = await prisma.asset.findMany({
    include: {
      allocations: true,
      returns: true
    }
  });

  let consecutiveToDelete = [];

  for (const asset of assets) {
    const events = [];
    
    asset.allocations.forEach(a => {
      events.push({ type: 'alloc', date: new Date(a.allocatedAt) });
    });
    
    asset.returns.forEach(r => {
      // Skip if this return was already deleted in the first pass
      if (exactDuplicatesToDelete.includes(r.id)) return;
      events.push({ type: 'return', date: new Date(r.returnedAt), id: r.id });
    });

    // Sort chronologically ascending
    events.sort((a, b) => a.date - b.date);

    // If we have two returns in a row, the older one is usually the correct return matching the prior allocation,
    // and the newer one is a redundant duplicate created by mistake.
    for (let i = 1; i < events.length; i++) {
      if (events[i - 1].type === 'return' && events[i].type === 'return') {
        console.log(`⚠️ Consecutive returns detected for ${asset.name} (${asset.assetId}):`);
        console.log(`  - 1st Return: ${events[i - 1].date.toLocaleDateString()}`);
        console.log(`  - 2nd Return: ${events[i].date.toLocaleDateString()} (ID: ${events[i].id})`);
        
        consecutiveToDelete.push(events[i].id); // Delete the redundant second return
      }
    }
  }

  console.log(`\nFound ${consecutiveToDelete.length} consecutive duplicate ReturnEvents to delete.`);

  for (const id of consecutiveToDelete) {
    await prisma.returnEvent.delete({ where: { id } });
    console.log(`🗑️ Deleted consecutive duplicate ReturnEvent: ID ${id}`);
  }

  const finalCount = await prisma.returnEvent.count();
  console.log(`\n✅ Database Clean completed successfully!`);
  console.log(`- Deleted exact duplicates: ${exactDuplicatesToDelete.length}`);
  console.log(`- Deleted consecutive duplicates: ${consecutiveToDelete.length}`);
  console.log(`- Final ReturnEvent records count in database: ${finalCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
