import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting CSV-based seed process...');

  // Clear existing data
  await prisma.damageReport.deleteMany({});
  await prisma.returnEvent.deleteMany({});
  await prisma.allocation.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.aiQueryHistory.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  const dbDir = path.join(process.cwd(), '../database');

  // Helper to read CSV
  const readCsv = (filename) => {
    const filePath = path.join(dbDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return parse(content, { columns: true, skip_empty_lines: true });
  };

  const safeDate = (dateStr) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // 1. Create Departments (unique set from users and assets)
  const userData = readCsv('users.csv');
  const assetData = readCsv('assets.csv');
  
  const deptNames = new Set([
    ...userData.map(u => u.department),
    ...assetData.map(a => a.department)
  ]);

  const deptMap = {}; // name -> cuid
  for (const name of deptNames) {
    if (!name) continue;
    const code = name.toUpperCase().replace(/\s+/g, '_');
    const d = await prisma.department.create({
      data: { name, code }
    });
    deptMap[name] = d.id;
  }

  // 2. Create Users and Employees
  const employeeIdMap = {}; // csv_id -> cuid
  for (const u of userData) {
    const nameParts = u.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: hashedPassword,
        role: u.role === 'admin' ? 'admin' : (u.role === 'it_support' ? 'it_support' : 'user')
      }
    });

    const emp = await prisma.employee.create({
      data: {
        employeeId: `EMP${u.id.padStart(3, '0')}`,
        firstName,
        lastName,
        email: u.email,
        role: user.role,
        departmentId: deptMap[u.department],
        userId: user.id,
        createdAt: safeDate(u.created_at)
      }
    });
    employeeIdMap[u.id] = emp.id;
  }

  // 3. Create Assets
  const assetIdMap = {}; // csv_id -> cuid
  for (const a of assetData) {
    const asset = await prisma.asset.create({
      data: {
        assetId: a.asset_code.startsWith('AST') ? a.asset_code : `AST-${a.asset_code}`,
        name: a.name,
        category: a.category,
        departmentId: deptMap[a.department],
        manufacturer: a.name.split(' ')[0],
        model: a.model || 'Standard',
        serialNumber: a.serial_number,
        purchaseDate: a.purchase_date ? safeDate(a.purchase_date) : null,
        purchaseCost: a.purchase_cost ? parseInt(a.purchase_cost) : 1000,
        status: 'In Stock', // Default, updated by events
        location: a.location
      }
    });
    assetIdMap[a.id] = asset.id;
  }

  // 4. Create Allocations
  const allocationData = readCsv('allocations.csv');
  const allocationIdMap = {}; // csv_id -> cuid
  for (const al of allocationData) {
    const allocation = await prisma.allocation.create({
      data: {
        assetId: assetIdMap[al.asset_id],
        employeeId: employeeIdMap[al.user_id],
        status: 'Active', // Default, updated by returns
        allocatedAt: safeDate(al.allocated_at),
        expectedReturnDate: al.expected_return_date ? safeDate(al.expected_return_date) : null,
        notes: al.notes
      }
    });
    allocationIdMap[al.id] = allocation.id;

    // Update asset status to Allocated
    await prisma.asset.update({
      where: { id: assetIdMap[al.asset_id] },
      data: { status: 'Allocated' }
    });
  }

  // 5. Create Returns
  const returnData = readCsv('returns.csv');
  for (const ret of returnData) {
    const allocation = await prisma.allocation.findUnique({
      where: { id: allocationIdMap[ret.allocation_id] },
      include: { asset: true }
    });

    if (!allocation) continue;

    await prisma.returnEvent.create({
      data: {
        assetId: allocation.assetId,
        employeeId: allocation.employeeId,
        returnedAt: safeDate(ret.returned_at),
        condition: ret.condition_on_return,
        notes: ret.notes
      }
    });

    // Update allocation status to Returned
    await prisma.allocation.update({
      where: { id: allocation.id },
      data: { 
        status: 'Returned',
        actualReturnDate: safeDate(ret.returned_at)
      }
    });

    // Update asset status back to In Stock (unless damaged, but we'll let damage reports handle that if they exist)
    await prisma.asset.update({
      where: { id: allocation.assetId },
      data: { status: 'In Stock' }
    });
  }

  // 6. Create Damage Reports
  const damageData = readCsv('damage_reports.csv');
  for (const dam of damageData) {
    const assetId = assetIdMap[dam.asset_id];
    if (!assetId) continue;

    await prisma.damageReport.create({
      data: {
        assetId: assetId,
        reportedById: employeeIdMap[dam.reported_by_id],
        severity: dam.severity,
        description: dam.description,
        status: dam.status,
        reportedAt: safeDate(dam.reported_at)
      }
    });

    // Update asset status to Damaged if it's still Open or In Repair
    if (dam.status !== 'Resolved') {
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: 'Damaged' }
      });
    }
  }

  console.log(`CSV Seed data created successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
