import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const asset = await prisma.asset.findUnique({
    where: { assetId: 'AST-1051' },
    include: {
      allocations: true,
      returns: true,
      damageReports: true
    }
  });

  console.log('--- AST-1051 Details ---');
  console.log('Asset ID:', asset.assetId);
  console.log('Status:', asset.status);
  console.log('Allocations count:', asset.allocations.length);
  console.log('Returns count:', asset.returns.length);
  console.log('Damage Reports count:', asset.damageReports.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
