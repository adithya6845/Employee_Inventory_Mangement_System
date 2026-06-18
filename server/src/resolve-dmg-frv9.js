import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RESOLVING DAMAGE REPORT DMG-FRV9 IN DATABASE ---');

  // Find the damage report that ends with 'frv9' (case-insensitive) or matches Dell XPS AST-1051 / Diya Reddy on 17 May 2026
  const report = await prisma.damageReport.findFirst({
    where: {
      OR: [
        {
          id: {
            endsWith: 'frv9'
          }
        },
        {
          asset: {
            assetId: 'AST-1051'
          },
          reportedBy: {
            employeeId: 'EMP029'
          }
        }
      ]
    },
    include: {
      asset: true,
      reportedBy: true
    }
  });

  if (!report) {
    console.error('❌ Could not find damage report DMG-FRV9 in the database!');
    return;
  }

  console.log(`Found Report DMG-${report.id.substring(report.id.length - 4).toUpperCase()}:`);
  console.log(`  - Asset: ${report.asset?.name} (${report.asset?.assetId})`);
  console.log(`  - Reported By: ${report.reportedBy?.firstName} ${report.reportedBy?.lastName}`);
  console.log(`  - Current Status: ${report.status}`);

  // Update status to Resolved in PostgreSQL
  const updatedReport = await prisma.damageReport.update({
    where: { id: report.id },
    data: {
      status: 'Resolved'
    }
  });

  console.log(`\n✅ Successfully updated status to: ${updatedReport.status}!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
