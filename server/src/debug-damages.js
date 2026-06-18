import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const damages = await prisma.damageReport.findMany({
    include: { asset: true, reportedBy: true }
  });
  console.log('ACTIVE DAMAGE REPORTS IN DATABASE:');
  console.log('ID\tAsset ID\tName\tSeverity\tPurchaseCost\tComputed Cost (8%)');
  damages.forEach(d => {
    const cost = d.asset?.purchaseCost || 0;
    const computed = Math.round(cost * 0.08);
    console.log(`${d.id}\t${d.asset?.assetId}\t${d.asset?.name}\t${d.severity}\t₹${cost}\t₹${computed}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
