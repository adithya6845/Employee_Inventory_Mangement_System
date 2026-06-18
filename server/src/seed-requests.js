import prisma from './prismaClient.js';

async function main() {
  console.log('Seeding exactly 4 high-fidelity requests...');

  // Delete existing requests
  await prisma.request.deleteMany({});

  // Fetch some real employees from the database
  const employees = await prisma.employee.findMany();
  
  if (employees.length < 5) {
    console.error('Not enough employees to seed requests. Please run seed.js first.');
    return;
  }

  // Helper to find employee by first name or ID
  const findEmp = (first, last) => 
    employees.find(e => e.firstName.toLowerCase() === first.toLowerCase() && e.lastName.toLowerCase() === last.toLowerCase()) || 
    employees.find(e => e.firstName.toLowerCase() === first.toLowerCase()) || 
    employees[0];

  const vihaanSharma = findEmp('vihaan', 'sharma');
  const nehaJoshi = findEmp('neha', 'joshi');
  const aaravGupta = findEmp('aarav', 'gupta');
  const sanjaySharma = findEmp('sanjay', 'sharma');

  // 1 Pending
  await prisma.request.create({
    data: {
      id: 'REQ-1001',
      type: 'Apple iPad Pro',
      description: 'Required for client design presentations & creative mockup sketching.',
      status: 'pending',
      employeeId: vihaanSharma.id,
      createdAt: new Date('2026-05-18T09:30:00Z')
    }
  });

  // 2 Approved
  await prisma.request.create({
    data: {
      id: 'REQ-1002',
      type: 'Dell UltraSharp 27" Monitor',
      description: 'Dual-screen setup upgrade for professional IDE developer efficiency.',
      status: 'approved',
      employeeId: nehaJoshi.id,
      createdAt: new Date('2026-05-16T11:15:00Z')
    }
  });

  await prisma.request.create({
    data: {
      id: 'REQ-1003',
      type: 'Logitech MX Master 3S Mouse',
      description: 'Ergonomic precision mouse requested for heavy UI layout design tasks.',
      status: 'approved',
      employeeId: aaravGupta.id,
      createdAt: new Date('2026-05-17T14:40:00Z')
    }
  });

  // 1 Rejected (accepted/rejected)
  await prisma.request.create({
    data: {
      id: 'REQ-1004',
      type: 'Keychron Q1 Mechanical Keyboard',
      description: 'Standard office peripheral replacement request (Exceeds standard IT procurement budget allowance).',
      status: 'rejected',
      employeeId: sanjaySharma.id,
      createdAt: new Date('2026-05-15T16:20:00Z')
    }
  });

  console.log('Seeded exactly 4 high-fidelity corporate requests successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
