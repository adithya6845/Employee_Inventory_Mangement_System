import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixAST1051() {
  const asset = await prisma.asset.findUnique({
    where: { assetId: 'AST-1051' },
    include: { allocations: { include: { employee: true } }, returns: { include: { employee: true } } }
  });

  if (!asset) return;

  const nehaAlloc = asset.allocations.find(a => a.employee.firstName === 'Neha');
  const diyaAlloc = asset.allocations.find(a => a.employee.firstName === 'Diya');
  const rohanAlloc = asset.allocations.find(a => a.employee.firstName === 'Rohan');

  const nehaRet = asset.returns.find(r => r.employee.firstName === 'Neha');
  const rohanRet = asset.returns.find(r => r.employee.firstName === 'Rohan');
  let diyaRet = asset.returns.find(r => r.employee.firstName === 'Diya');

  // 1. Neha -> Returns on Apr 15
  if (nehaAlloc) {
    await prisma.allocation.update({
      where: { id: nehaAlloc.id },
      data: { actualReturnDate: new Date('2026-04-15T12:00:00Z'), expectedReturnDate: new Date('2026-04-15T12:00:00Z') }
    });
  }
  if (nehaRet) {
    await prisma.returnEvent.update({
      where: { id: nehaRet.id },
      data: { returnedAt: new Date('2026-04-15T12:00:00Z') }
    });
  }

  // 2. Diya -> Allocated on Apr 15, Returns on May 01
  if (diyaAlloc) {
    await prisma.allocation.update({
      where: { id: diyaAlloc.id },
      data: { allocatedAt: new Date('2026-04-15T13:00:00Z'), actualReturnDate: new Date('2026-05-01T10:00:00Z'), expectedReturnDate: new Date('2026-05-01T10:00:00Z'), status: 'Returned' }
    });
    
    if (!diyaRet) {
      await prisma.returnEvent.create({
        data: {
          assetId: asset.id,
          employeeId: diyaAlloc.employeeId,
          returnedAt: new Date('2026-05-01T10:00:00Z'),
          condition: 'Excellent',
          notes: 'Standard return'
        }
      });
    } else {
      await prisma.returnEvent.update({
        where: { id: diyaRet.id },
        data: { returnedAt: new Date('2026-05-01T10:00:00Z') }
      });
    }
  }

  // 3. Rohan -> Allocated on May 01 (Already May 01, just making sure the time is after Diya's return)
  if (rohanAlloc) {
    await prisma.allocation.update({
      where: { id: rohanAlloc.id },
      data: { allocatedAt: new Date('2026-05-01T11:00:00Z') }
    });
  }

  console.log('Fixed AST-1051 timeline logic completely.');
}

fixAST1051()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
