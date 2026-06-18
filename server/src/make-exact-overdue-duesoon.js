import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- RESETTING AND SEEDING FOR EXACTLY 2 OVERDUE & 3 DUE SOON RECORDS ---');

  const now = new Date();
  const soon = new Date(now.getTime() + 7 * 86400000);

  // 1. Find or create the IT Support Operations department
  let dept = await prisma.department.findFirst({
    where: { code: 'IT-OPS' }
  });
  if (!dept) {
    dept = await prisma.department.create({
      data: {
        name: 'IT Support Operations',
        code: 'IT-OPS'
      }
    });
  }

  // 2. Clean up any existing allocations for assets AST-1151 to AST-1155 and employees EMP051/EMP052 to prevent constraint/double allocation issues
  console.log('Cleaning up existing target assets and allocations...');
  
  const targetAssetIds = ['AST-1151', 'AST-1152', 'AST-1153', 'AST-1154', 'AST-1155'];
  const dbAssets = await prisma.asset.findMany({
    where: { assetId: { in: targetAssetIds } }
  });
  const dbAssetIds = dbAssets.map(a => a.id);

  if (dbAssetIds.length > 0) {
    await prisma.allocation.deleteMany({
      where: { assetId: { in: dbAssetIds } }
    });
    await prisma.returnEvent.deleteMany({
      where: { assetId: { in: dbAssetIds } }
    });
    await prisma.damageReport.deleteMany({
      where: { assetId: { in: dbAssetIds } }
    });
    await prisma.asset.deleteMany({
      where: { id: { in: dbAssetIds } }
    });
  }

  // Clear employees EMP051 and EMP052 if they exist
  const targetEmpIds = ['EMP051', 'EMP052'];
  const dbEmps = await prisma.employee.findMany({
    where: { employeeId: { in: targetEmpIds } }
  });
  const dbEmpIds = dbEmps.map(e => e.id);

  if (dbEmpIds.length > 0) {
    await prisma.allocation.deleteMany({
      where: { employeeId: { in: dbEmpIds } }
    });
    await prisma.returnEvent.deleteMany({
      where: { employeeId: { in: dbEmpIds } }
    });
    await prisma.damageReport.deleteMany({
      where: { reportedById: { in: dbEmpIds } }
    });
    await prisma.employee.deleteMany({
      where: { id: { in: dbEmpIds } }
    });
  }

  // 3. For any OTHER active allocations currently in the DB:
  // Move their expected return dates 30 days into the future so they DO NOT count as overdue or due soon.
  console.log('Pushing all other active allocations to future dates to ensure exact metrics...');
  const thirtyDaysFuture = new Date();
  thirtyDaysFuture.setDate(now.getDate() + 30);

  const otherAllocations = await prisma.allocation.findMany({
    where: { status: 'Active' }
  });

  for (const alloc of otherAllocations) {
    // Only alter other allocations if they fall into overdue or due soon ranges
    const d = new Date(alloc.expectedReturnDate);
    const isOverdue = alloc.expectedReturnDate && d < now;
    const isDueSoon = alloc.expectedReturnDate && d >= now && d <= soon;
    if (isOverdue || isDueSoon) {
      await prisma.allocation.update({
        where: { id: alloc.id },
        data: { expectedReturnDate: thirtyDaysFuture }
      });
    }
  }

  // 4. Create new clean target employees
  console.log('Creating new employees EMP051 and EMP052...');
  const emp1 = await prisma.employee.create({
    data: {
      employeeId: 'EMP051',
      firstName: 'Aditya',
      lastName: 'Sharma',
      email: 'aditya.sharma@enterprise.com',
      role: 'Software Engineer',
      departmentId: dept.id,
      status: 'active'
    }
  });

  const emp2 = await prisma.employee.create({
    data: {
      employeeId: 'EMP052',
      firstName: 'Karan',
      lastName: 'Malhotra',
      email: 'karan.malhotra@enterprise.com',
      role: 'UX Designer',
      departmentId: dept.id,
      status: 'active'
    }
  });

  // 5. Create 5 new assets and mark them as Allocated
  console.log('Creating 5 new target assets (AST-1151 to AST-1155)...');
  const assetSpecs = [
    { assetId: 'AST-1151', name: 'MacBook Pro M3', category: 'Laptop', serialNumber: 'SN1151' },
    { assetId: 'AST-1152', name: 'Samsung Odyssey G9', category: 'Monitor', serialNumber: 'SN1152' },
    { assetId: 'AST-1153', name: 'Google Pixel 8 Pro', category: 'Phone', serialNumber: 'SN1153' },
    { assetId: 'AST-1154', name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptop', serialNumber: 'SN1154' },
    { assetId: 'AST-1155', name: 'iPad Pro M2', category: 'Accessory', serialNumber: 'SN1155' }
  ];

  const assets = [];
  for (const spec of assetSpecs) {
    const asset = await prisma.asset.create({
      data: {
        assetId: spec.assetId,
        name: spec.name,
        category: spec.category,
        serialNumber: spec.serialNumber,
        departmentId: dept.id,
        purchaseCost: spec.category === 'Laptop' ? 120000 : spec.category === 'Monitor' ? 65000 : spec.category === 'Phone' ? 85000 : 45000,
        status: 'Allocated',
        location: 'Mumbai HQ'
      }
    });
    assets.push(asset);
  }

  // 6. Create allocations with exact target dates
  console.log('Creating exact active allocations (2 Overdue, 3 Due Soon)...');

  // OVERDUE 1: Expected return 3 days ago
  const overdue1Date = new Date();
  overdue1Date.setDate(now.getDate() - 3);
  await prisma.allocation.create({
    data: {
      assetId: assets[0].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      expectedReturnDate: overdue1Date,
      status: 'Active',
      notes: 'Overdue allocation: Development project'
    }
  });

  // OVERDUE 2: Expected return 5 days ago
  const overdue2Date = new Date();
  overdue2Date.setDate(now.getDate() - 5);
  await prisma.allocation.create({
    data: {
      assetId: assets[1].id,
      employeeId: emp2.id,
      allocatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      expectedReturnDate: overdue2Date,
      status: 'Active',
      notes: 'Overdue allocation: Premium monitor setup'
    }
  });

  // DUE SOON 1: Expected return 2 days from now (within 7 days)
  const dueSoon1Date = new Date();
  dueSoon1Date.setDate(now.getDate() + 2);
  await prisma.allocation.create({
    data: {
      assetId: assets[2].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      expectedReturnDate: dueSoon1Date,
      status: 'Active',
      notes: 'Due soon allocation: Android app testing'
    }
  });

  // DUE SOON 2: Expected return 4 days from now (within 7 days)
  const dueSoon2Date = new Date();
  dueSoon2Date.setDate(now.getDate() + 4);
  await prisma.allocation.create({
    data: {
      assetId: assets[3].id,
      employeeId: emp2.id,
      allocatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      expectedReturnDate: dueSoon2Date,
      status: 'Active',
      notes: 'Due soon allocation: Design feedback work'
    }
  });

  // DUE SOON 3: Expected return 5 days from now (within 7 days)
  const dueSoon3Date = new Date();
  dueSoon3Date.setDate(now.getDate() + 5);
  await prisma.allocation.create({
    data: {
      assetId: assets[4].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      expectedReturnDate: dueSoon3Date,
      status: 'Active',
      notes: 'Due soon allocation: Creative illustration drawings'
    }
  });

  console.log('\n======================================================');
  console.log('🎉 SUCCESS: Seeding finished successfully!');
  console.log('🔴 Overdue Allocations Created: 2');
  console.log('🟢 Due Soon Allocations Created: 3');
  console.log('======================================================');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
