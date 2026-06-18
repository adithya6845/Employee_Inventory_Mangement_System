const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Processing overdue returns in the database...');

  // 1. AST-1151 (MacBook Pro M3)
  const asset1 = await prisma.asset.findUnique({
    where: { assetId: 'AST-1151' }
  });
  
  if (asset1) {
    // Check if ReturnEvent already exists
    const existingReturn1 = await prisma.returnEvent.findFirst({
      where: { assetId: asset1.id }
    });
    
    if (!existingReturn1) {
      // Create ReturnEvent
      await prisma.returnEvent.create({
        data: {
          assetId: asset1.id,
          employeeId: 'cmpa3j7fp00017mzgdtgkrmjm', // Aditya Sharma
          returnedAt: new Date('2026-05-14T23:46:05.000Z'),
          condition: 'Good',
          notes: 'Returned late'
        }
      });
      console.log('Created ReturnEvent for AST-1151 on 14 May 2026.');
    }

    // Update Allocation
    await prisma.allocation.updateMany({
      where: {
        assetId: asset1.id,
        status: 'Active'
      },
      data: {
        status: 'Returned',
        actualReturnDate: new Date('2026-05-14T23:46:05.000Z')
      }
    });

    // Update Asset Status
    await prisma.asset.update({
      where: { id: asset1.id },
      data: { status: 'In Stock' }
    });
    console.log('Updated AST-1151 status to In Stock and Allocation to Returned.');
  }

  // 2. AST-1152 (Samsung Odyssey G9)
  const asset2 = await prisma.asset.findUnique({
    where: { assetId: 'AST-1152' }
  });
  
  if (asset2) {
    // Check if ReturnEvent already exists
    const existingReturn2 = await prisma.returnEvent.findFirst({
      where: { assetId: asset2.id }
    });
    
    if (!existingReturn2) {
      // Create ReturnEvent
      await prisma.returnEvent.create({
        data: {
          assetId: asset2.id,
          employeeId: 'cmpa3j7ft00037mzgai5x77fs', // Karan Malhotra
          returnedAt: new Date('2026-05-12T23:46:05.000Z'),
          condition: 'Good',
          notes: 'Returned late'
        }
      });
      console.log('Created ReturnEvent for AST-1152 on 12 May 2026.');
    }

    // Update Allocation
    await prisma.allocation.updateMany({
      where: {
        assetId: asset2.id,
        status: 'Active'
      },
      data: {
        status: 'Returned',
        actualReturnDate: new Date('2026-05-12T23:46:05.000Z')
      }
    });

    // Update Asset Status
    await prisma.asset.update({
      where: { id: asset2.id },
      data: { status: 'In Stock' }
    });
    console.log('Updated AST-1152 status to In Stock and Allocation to Returned.');
  }

  console.log('Database update completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
