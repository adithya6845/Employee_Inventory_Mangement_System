import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const assets = await prisma.asset.findMany();
  console.log(`Checking ${assets.length} assets...`);
  
  let updatedCount = 0;
  for (const asset of assets) {
    let newLocation = asset.location;
    
    if (asset.location === 'Sales Office') {
      newLocation = 'Sales Room';
    } else if (asset.location === 'IT Room') {
      newLocation = 'IT Department';
    } else if (!asset.location || !['IT Department', 'Main Office', 'Sales Room', 'Storage Room', 'Server Room', 'Reception'].includes(asset.location)) {
      // Fallback: assign one of the new locations
      const locs = ['IT Department', 'Main Office', 'Sales Room', 'Storage Room', 'Server Room', 'Reception'];
      newLocation = locs[Math.floor(Math.random() * locs.length)];
    }
    
    if (newLocation !== asset.location) {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { location: newLocation }
      });
      updatedCount++;
    }
  }
  
  console.log(`Successfully updated ${updatedCount} assets with new location standard.`);
}

main().finally(() => prisma.$disconnect());
