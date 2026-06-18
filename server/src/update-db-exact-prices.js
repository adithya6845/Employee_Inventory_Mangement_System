import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exactPrices = {
  "AST-1018": 72999,
  "AST-1040": 98500,
  "AST-1010": 105000,
  "AST-1001": 92000,
  "AST-1034": 18500,
  "AST-1006": 74999,
  "AST-1019": 22000,
  "AST-1011": 16500,
  "AST-1012": 19000,
  "AST-1002": 1299,
  "AST-1003": 21000,
  "AST-1004": 69999,
  "AST-1005": 1499,
  "AST-1014": 115000,
  "AST-1016": 24000,
  "AST-1022": 1799,
  "AST-1023": 17999,
  "AST-1024": 1199,
  "AST-1032": 14500,
  "AST-1033": 89999,
  "AST-1035": 108000,
  "AST-1036": 79999,
  "AST-1038": 2199,
  "AST-1041": 20999,
  "AST-1043": 95500,
  "AST-1045": 999,
  "AST-1046": 84999,
  "AST-1053": 102000,
  "AST-1049": 67999,
  "AST-1071": 23000,
  "AST-1059": 19500,
  "AST-1047": 109999,
  "AST-1068": 76999,
  "AST-1060": 74000,
  "AST-1050": 899,
  "AST-1052": 118000,
  "AST-1054": 112000,
  "AST-1055": 73500,
  "AST-1063": 116000,
  "AST-1064": 68500,
  "AST-1065": 71000,
  "AST-1066": 17500,
  "AST-1069": 91000,
  "AST-1070": 1099,
  "AST-1072": 15500,
  "AST-1073": 1899,
  "AST-1074": 26000,
  "AST-1077": 1499,
  "AST-1078": 88500,
  "AST-1079": 2299,
  "AST-1080": 21500,
  "AST-1082": 104000,
  "AST-1083": 120000,
  "AST-1084": 69500,
  "AST-1085": 18999,
  "AST-1086": 16999,
  "AST-1087": 93500,
  "AST-1093": 20000,
  "AST-1110": 66500,
  "AST-1113": 1399,
  "AST-1128": 110000,
  "AST-1134": 78500,
  "AST-1094": 97999,
  "AST-1095": 24500,
  "AST-1096": 19999,
  "AST-1097": 65999,
  "AST-1099": 15999,
  "AST-1100": 94000,
  "AST-1104": 107000,
  "AST-1105": 27000,
  "AST-1106": 799,
  "AST-1107": 68999,
  "AST-1108": 101000,
  "AST-1109": 75500,
  "AST-1111": 2499,
  "AST-1112": 67500,
  "AST-1117": 113000,
  "AST-1119": 99999,
  "AST-1121": 1599,
  "AST-1122": 2199,
  "AST-1123": 14999,
  "AST-1125": 74500,
  "AST-1126": 25000,
  "AST-1129": 999,
  "AST-1130": 21999,
  "AST-1132": 1499,
  "AST-1135": 899,
  "AST-1136": 70999,
  "AST-1137": 1299,
  "AST-1138": 106500,
  "AST-1124": 22999,
  "AST-1031": 1099,
  "AST-1056": 1399,
  "AST-1091": 16500,
  "AST-1115": 1999,
  "AST-1139": 2299,
  "AST-1140": 27500,
  "AST-1141": 899,
  "AST-1142": 114000,
  "AST-1144": 18000,
  "AST-1145": 1299,
  "AST-1146": 24999,
  "AST-1147": 71500,
  "AST-1149": 90000,
  "AST-1143": 17999,
  "AST-1150": 72000
};

async function main() {
  console.log('Starting Target-based Database Pricing Correction...');
  const assets = await prisma.asset.findMany();
  console.log(`Loaded ${assets.length} assets from the active database.`);

  let matchCount = 0;
  let fallbackCount = 0;

  for (let idx = 0; idx < assets.length; idx++) {
    const asset = assets[idx];
    
    // Check if the asset ID (e.g. AST-1001) has an exact user-provided price mapping
    const code = asset.assetId;
    let targetPrice = exactPrices[code];

    if (targetPrice) {
      matchCount++;
    } else {
      // Fallback to the user's recommended range averages
      const name = asset.name || '';
      const category = asset.category || '';
      
      if (name.includes('Dell XPS') || category.toLowerCase() === 'laptop' || category.toLowerCase() === 'hardware') {
        targetPrice = 98000;
      } else if (name.includes('iPhone') || category.toLowerCase() === 'phone' || category.toLowerCase() === 'mobile') {
        targetPrice = 72000;
      } else if (name.includes('HP Monitor') || category.toLowerCase() === 'monitor') {
        targetPrice = 19500;
      } else if (name.includes('Logitech Mouse') || category.toLowerCase() === 'accessory') {
        targetPrice = 1490;
      } else {
        targetPrice = 8000;
      }
      fallbackCount++;
    }

    await prisma.asset.update({
      where: { id: asset.id },
      data: { purchaseCost: targetPrice }
    });
  }

  console.log(`Successfully completed!`);
  console.log(`- Exact price matches corrected: ${matchCount}`);
  console.log(`- Recommended fallback range prices applied: ${fallbackCount}`);
  console.log(`Total database assets processed: ${assets.length}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
