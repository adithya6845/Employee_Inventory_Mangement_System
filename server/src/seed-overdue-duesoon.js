import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING SYSTEM FOR EXACTLY 2 OVERDUE AND 3 DUE SOON RECORDS ---');

  // 1. Get or create a department to link
  let dept = await prisma.department.findFirst();
  if (!dept) {
    dept = await prisma.department.create({
      data: {
        name: 'IT Support Operations',
        code: 'IT-OPS'
      }
    });
  }

  // 2. Create 2 new employees
  console.log('Creating new employees...');
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

  console.log(`Created: ${emp1.firstName} ${emp1.lastName} (${emp1.employeeId}) & ${emp2.firstName} ${emp2.lastName} (${emp2.employeeId})`);

  // 3. Create 5 new assets (marked as Allocated)
  console.log('\nCreating 5 new assets...');
  
  const assetSpecs = [
    { assetId: 'AST-1151', name: 'MacBook Pro M3', category: 'Laptop', serialNumber: 'SN1151' },
    { assetId: 'AST-1152', name: 'Samsung Odyssey G9', category: 'Monitor', serialNumber: 'SN1152' },
    { assetId: 'AST-1153', name: 'Google Pixel 8 Pro', category: 'Phone', serialNumber: 'SN1153' },
    { assetId: 'AST-1154', name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptop', serialNumber: 'SN1154' },
    { assetId: 'AST-1155', name: 'iPad Pro M2', category: 'Accessory', serialNumber: 'SN1155' }
  ];

  const assets = [];
  for (const spec of assetSpecs) {
    // Delete if existing to prevent conflicts
    await prisma.asset.deleteMany({ where: { assetId: spec.assetId } });

    const asset = await prisma.asset.create({
      data: {
        assetId: spec.assetId,
        name: spec.name,
        category: spec.category,
        serialNumber: spec.serialNumber,
        departmentId: dept.id,
        purchaseCost: spec.category === 'Laptop' ? 120000 : spec.category === 'Monitor' ? 65000 : spec.category === 'Phone' ? 85000 : 45000,
        status: 'Allocated', // Must be allocated to show up in dashboard panels!
        location: 'Mumbai HQ'
      }
    });
    assets.push(asset);
    console.log(`  - Created ${asset.name} (${asset.assetId})`);
  }

  // 4. Create allocations with specific chronological dates
  console.log('\nCreating allocations...');
  const now = new Date();

  // OVERDUE 1: Expected return 3 days ago (in the past!)
  const overdue1Date = new Date();
  overdue1Date.setDate(now.getDate() - 3);
  const overdueAlloc1 = await prisma.allocation.create({
    data: {
      assetId: assets[0].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      expectedReturnDate: overdue1Date,
      status: 'Active',
      notes: 'Overdue allocation: Development project'
    }
  });

  // OVERDUE 2: Expected return 5 days ago (in the past!)
  const overdue2Date = new Date();
  overdue2Date.setDate(now.getDate() - 5);
  const overdueAlloc2 = await prisma.allocation.create({
    data: {
      assetId: assets[1].id,
      employeeId: emp2.id,
      allocatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
      expectedReturnDate: overdue2Date,
      status: 'Active',
      notes: 'Overdue allocation: Premium monitor setup'
    }
  });

  // DUE SOON 1: Expected return 2 days from now (within 7 days!)
  const dueSoon1Date = new Date();
  dueSoon1Date.setDate(now.getDate() + 2);
  const dueSoonAlloc1 = await prisma.allocation.create({
    data: {
      assetId: assets[2].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      expectedReturnDate: dueSoon1Date,
      status: 'Active',
      notes: 'Due soon allocation: Android app testing'
    }
  });

  // DUE SOON 2: Expected return 4 days from now (within 7 days!)
  const dueSoon2Date = new Date();
  dueSoon2Date.setDate(now.getDate() + 4);
  const dueSoonAlloc2 = await prisma.allocation.create({
    data: {
      assetId: assets[3].id,
      employeeId: emp2.id,
      allocatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      expectedReturnDate: dueSoon2Date,
      status: 'Active',
      notes: 'Due soon allocation: Design feedback work'
    }
  });

  // DUE SOON 3: Expected return 5 days from now (within 7 days!)
  const dueSoon3Date = new Date();
  dueSoon3Date.setDate(now.getDate() + 5);
  const dueSoonAlloc3 = await prisma.allocation.create({
    data: {
      assetId: assets[4].id,
      employeeId: emp1.id,
      allocatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      expectedReturnDate: dueSoon3Date,
      status: 'Active',
      notes: 'Due soon allocation: Creative illustration drawings'
    }
  });

  console.log('\n✅ Successfully seeded allocations:');
  console.log('🔴 Overdue Allocations Created: 2');
  console.log('🟢 Due Soon Allocations Created: 3');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
