import prisma from './prismaClient.js';

async function main() {
  const employees = await prisma.employee.findMany({
    take: 10,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      employeeId: true
    }
  });
  console.log(JSON.stringify(employees, null, 2));
}

main().finally(() => prisma.$disconnect());
