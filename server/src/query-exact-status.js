import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.asset.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });
  
  console.log('--- ASSET STATUS COUNTS ---');
  counts.forEach(c => {
    console.log(`- ${c.status}: ${c._count.status}`);
  });

  const otherAssets = await prisma.asset.findMany({
    where: {
      status: {
        notIn: ['In Stock', 'Allocated']
      }
    },
    select: {
      assetId: true,
      name: true,
      category: true,
      status: true,
      serialNumber: true
    }
  });

  console.log('\n--- ASSETS THAT ARE NEITHER "IN STOCK" NOR "ALLOCATED" ---');
  otherAssets.forEach((a, i) => {
    console.log(`${i + 1}. ${a.name} (${a.assetId}) - Serial: ${a.serialNumber || 'N/A'}, Category: ${a.category}, Status: ${a.status}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
