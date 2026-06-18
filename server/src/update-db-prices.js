import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Direct Database Pricing Update...');
  const assets = await prisma.asset.findMany();
  console.log(`Found ${assets.length} assets to process.`);

  let updatedCount = 0;
  for (let idx = 0; idx < assets.length; idx++) {
    const asset = assets[idx];
    const category = asset.category || '';
    const name = asset.name || '';

    let newCost = 1000;

    if (name.includes('Dell XPS') || category.toLowerCase() === 'laptop' || category.toLowerCase() === 'hardware') {
      newCost = 125000 + (idx % 5) * 5000;
    } else if (name.includes('iPhone') || category.toLowerCase() === 'phone' || category.toLowerCase() === 'mobile') {
      newCost = 68000 + (idx % 5) * 2000;
    } else if (name.includes('HP Monitor') || category.toLowerCase() === 'monitor') {
      newCost = 10500 + (idx % 5) * 800;
    } else if (name.includes('Logitech Mouse') || category.toLowerCase() === 'accessory') {
      newCost = 1500 + (idx % 5) * 200;
    } else {
      newCost = 8000 + (idx % 5) * 500;
    }

    await prisma.asset.update({
      where: { id: asset.id },
      data: { purchaseCost: newCost }
    });
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} assets directly in SQLite database with realistic INR prices!`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
