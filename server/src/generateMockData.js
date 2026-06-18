import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Generating frontend mock database from CSV files...');

  const dbDir = path.join(process.cwd(), '../database');

  const readCsv = (filename) => {
    const filePath = path.join(dbDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return parse(content, { columns: true, skip_empty_lines: true });
  };

  const safeDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Departments
  const userData = readCsv('users.csv');
  const assetData = readCsv('assets.csv');

  const deptNames = Array.from(new Set([
    ...userData.map(u => u.department),
    ...assetData.map(a => a.department)
  ].filter(Boolean)));

  const departments = deptNames.map((name, index) => ({
    id: `dept-${index + 1}`,
    name,
    code: name.toUpperCase().replace(/\s+/g, '_')
  }));

  const deptMap = {};
  departments.forEach(d => {
    deptMap[d.name] = d.id;
  });

  // 2. Users & Employees
  const users = [];
  const employees = [];
  const employeeIdMap = {}; // csv_id -> mock_id

  userData.forEach((u, index) => {
    const nameParts = u.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';
    const userId = `user-${index + 1}`;
    const empId = `emp-${index + 1}`;

    const role = u.role === 'admin' ? 'admin' : (u.role === 'it_support' ? 'it_support' : 'user');

    users.push({
      id: userId,
      email: u.email,
      password: hashedPassword, // 'password123'
      role,
      createdAt: safeDate(u.created_at)
    });

    employees.push({
      id: empId,
      employeeId: `EMP${u.id.padStart(3, '0')}`,
      firstName,
      lastName,
      email: u.email,
      role,
      departmentId: deptMap[u.department] || null,
      userId,
      status: 'active',
      createdAt: safeDate(u.created_at)
    });

    employeeIdMap[u.id] = empId;
  });

  // 3. Assets
  const assets = [];
  const assetIdMap = {}; // csv_id -> mock_id

  assetData.forEach((a, index) => {
    const assetId = `asset-${index + 1}`;
    assets.push({
      id: assetId,
      assetId: a.asset_code.startsWith('AST') ? a.asset_code : `AST-${a.asset_code}`,
      name: a.name,
      category: a.category,
      departmentId: deptMap[a.department] || null,
      manufacturer: a.name.split(' ')[0],
      model: a.model || 'Standard',
      serialNumber: a.serial_number || `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      purchaseDate: a.purchase_date ? safeDate(a.purchase_date) : null,
      purchaseCost: a.purchase_cost ? parseInt(a.purchase_cost) : 1000,
      status: 'In Stock',
      location: a.location || 'HQ Store',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    assetIdMap[a.id] = assetId;
  });

  // 4. Allocations
  const allocationData = readCsv('allocations.csv');
  const allocations = [];
  const allocationIdMap = {}; // csv_id -> mock_id

  allocationData.forEach((al, index) => {
    const allocId = `alloc-${index + 1}`;
    const assetId = assetIdMap[al.asset_id];

    allocations.push({
      id: allocId,
      assetId,
      employeeId: employeeIdMap[al.user_id],
      status: 'Active',
      allocatedAt: safeDate(al.allocated_at),
      expectedReturnDate: al.expected_return_date ? safeDate(al.expected_return_date) : null,
      actualReturnDate: null,
      notes: al.notes || ''
    });

    allocationIdMap[al.id] = allocId;

    // Update asset status
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      asset.status = 'Allocated';
    }
  });

  // 5. Returns
  const returnData = readCsv('returns.csv');
  const returns = [];

  returnData.forEach((ret, index) => {
    const allocId = allocationIdMap[ret.allocation_id];
    const allocation = allocations.find(al => al.id === allocId);

    if (allocation) {
      const returnId = `return-${index + 1}`;
      returns.push({
        id: returnId,
        assetId: allocation.assetId,
        employeeId: allocation.employeeId,
        returnedAt: safeDate(ret.returned_at),
        condition: ret.condition_on_return || 'Good',
        notes: ret.notes || ''
      });

      // Update allocation
      allocation.status = 'Returned';
      allocation.actualReturnDate = safeDate(ret.returned_at);

      // Update asset
      const asset = assets.find(a => a.id === allocation.assetId);
      if (asset) {
        asset.status = 'In Stock';
      }
    }
  });

  // 6. Damage Reports
  const damageData = readCsv('damage_reports.csv');
  const damageReports = [];

  damageData.forEach((dam, index) => {
    const assetId = assetIdMap[dam.asset_id];
    if (assetId) {
      const dmgId = `dmg-${index + 1}`;
      damageReports.push({
        id: dmgId,
        assetId,
        reportedById: employeeIdMap[dam.reported_by_id],
        severity: dam.severity || 'Medium',
        description: dam.description || 'Reported damage',
        status: dam.status || 'Open',
        reportedAt: safeDate(dam.reported_at)
      });

      // Update asset status
      if (dam.status !== 'Resolved') {
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
          asset.status = 'Damaged';
        }
      }
    }
  });

  // 7. Initial Mock Requests (empty by default, or seed a few)
  const requests = [
    {
      id: 'req-1',
      type: 'Asset',
      description: 'Requesting high performance laptop for developer project',
      status: 'pending',
      employeeId: employees[0]?.id || 'emp-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 8. AI Query History & Activity Log
  const aiQueryHistory = [];
  const activityLogs = [];

  const mockDb = {
    departments,
    users,
    employees,
    assets,
    allocations,
    returns,
    damageReports,
    requests,
    aiQueryHistory,
    activityLogs
  };

  const outputPath = path.join(process.cwd(), '../client/src/services/mockData.json');
  fs.writeFileSync(outputPath, JSON.stringify(mockDb, null, 2));
  console.log(`Mock database successfully written to ${outputPath}`);
}

main().catch(console.error);
