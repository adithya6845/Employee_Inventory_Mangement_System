import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- REPAIRING MISSING ALLOCATIONS FOR EXISTING RETURNS ---');

  // 1. Fetch all ReturnEvents in the database
  const returns = await prisma.returnEvent.findMany({
    include: {
      employee: true,
      asset: true
    }
  });

  console.log(`Total ReturnEvents in Database: ${returns.length}`);

  let createdCount = 0;

  for (const ret of returns) {
    // 2. Search for a matching allocation that is 'Returned' for this asset and employee
    const matchingAlloc = await prisma.allocation.findFirst({
      where: {
        assetId: ret.assetId,
        employeeId: ret.employeeId,
        status: 'Returned'
      }
    });

    if (!matchingAlloc) {
      console.log(`⚠️ Missing allocation for Return ID ${ret.id}: Asset ${ret.asset?.name} (${ret.asset?.assetId}) returned by ${ret.employee?.firstName} ${ret.employee?.lastName} (${ret.employee?.employeeId})`);
      
      // Calculate a prior allocation date (e.g. 10 days before return)
      const returnDate = new Date(ret.returnedAt);
      const allocatedAt = new Date(returnDate.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days prior
      
      // Create the missing allocation in PostgreSQL
      await prisma.allocation.create({
        data: {
          assetId: ret.assetId,
          employeeId: ret.employeeId,
          allocatedAt: allocatedAt,
          expectedReturnDate: returnDate,
          actualReturnDate: returnDate,
          status: 'Returned',
          notes: `System generated to backfill matching allocation for Return ID ${ret.id}`
        }
      });

      console.log(`✅ Backfilled missing allocation: Allocated on ${allocatedAt.toLocaleDateString()} -> Returned on ${returnDate.toLocaleDateString()}`);
      createdCount++;
    }
  }

  console.log(`\nSuccess! Backfilled ${createdCount} missing allocation records in PostgreSQL.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
