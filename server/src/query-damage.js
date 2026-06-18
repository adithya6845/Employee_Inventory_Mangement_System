import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const assetsCount = await prisma.asset.count();
  const damagedAssetsCount = await prisma.asset.count({
    where: { status: 'Damaged' }
  });
  const totalReportsCount = await prisma.damageReport.count();
  const openReportsCount = await prisma.damageReport.count({
    where: { status: 'Open' }
  });
  const inRepairReportsCount = await prisma.damageReport.count({
    where: { status: 'In Repair' }
  });
  const resolvedReportsCount = await prisma.damageReport.count({
    where: { status: 'Resolved' }
  });

  console.log('--- DATABASE STATUS ---');
  console.log('Total Assets:', assetsCount);
  console.log('Damaged Assets Status:', damagedAssetsCount);
  console.log('Total Damage Reports:', totalReportsCount);
  console.log('Open Damage Reports:', openReportsCount);
  console.log('In Repair Damage Reports:', inRepairReportsCount);
  console.log('Resolved Damage Reports:', resolvedReportsCount);

  console.log('\n--- DAMAGED ASSET DETAILS ---');
  const damagedAssets = await prisma.asset.findMany({
    where: { status: 'Damaged' },
    select: { id: true, assetId: true, name: true, status: true }
  });
  damagedAssets.forEach(a => {
    console.log(`Asset: ${a.name} (${a.assetId}) - Status: ${a.status}`);
  });

  console.log('\n--- DAMAGE REPORT DETAILS ---');
  const reports = await prisma.damageReport.findMany({
    include: { asset: true }
  });
  reports.forEach(r => {
    console.log(`Report ID: ${r.id} - Asset: ${r.asset.name} (${r.asset.assetId}) - Status: ${r.status}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
