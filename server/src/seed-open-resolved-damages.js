import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- ADJUSTING DAMAGE REPORT STATUSES TO MATCH DESIGN MOCKUP ---');
  console.log('Goal: 11 Total, 5 Open (Pending), 6 Resolved');

  const reports = await prisma.damageReport.findMany({
    orderBy: {
      reportedAt: 'asc'
    }
  });

  console.log(`Current damage reports in DB: ${reports.length}`);

  if (reports.length < 11) {
    console.log('⚠️ Less than 11 reports found. We will adjust what is available.');
  }

  // Set first 6 to Resolved, and the rest to Pending (which renders as Open in UI)
  let resolvedCount = 0;
  let pendingCount = 0;

  for (let i = 0; i < reports.length; i++) {
    const rep = reports[i];
    let newStatus = 'Resolved';
    
    // We want the most recent 5 to be "Pending" (Open) so they represent active issues!
    if (i >= reports.length - 5) {
      newStatus = 'Pending';
      pendingCount++;
    } else {
      resolvedCount++;
    }

    await prisma.damageReport.update({
      where: { id: rep.id },
      data: { status: newStatus }
    });

    console.log(`  - Report DMG-${rep.id.substring(rep.id.length - 4).toUpperCase()}: Updated to ${newStatus}`);
  }

  console.log(`\nSuccessfully adjusted database!`);
  console.log(`✅ Resolved reports: ${resolvedCount}`);
  console.log(`✅ Open (Pending) reports: ${pendingCount}`);
  console.log(`✅ Total: ${reports.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
