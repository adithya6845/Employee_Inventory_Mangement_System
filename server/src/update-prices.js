import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), '../database/assets.csv');
const tempPath = path.join(process.cwd(), '../database/assets_temp.csv');
console.log('Reading CSV from:', csvPath);

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

const newLines = [];
newLines.push(lines[0]); // Header

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const columns = line.split(',');
  const id = columns[0];
  const name = columns[2];
  const category = columns[3];

  let newCost = 1000;

  if (name.includes('Dell XPS') || category.toLowerCase() === 'laptop') {
    newCost = 125000 + (parseInt(id) % 5) * 5000;
  } else if (name.includes('iPhone') || category.toLowerCase() === 'phone') {
    newCost = 68000 + (parseInt(id) % 5) * 2000;
  } else if (name.includes('HP Monitor') || category.toLowerCase() === 'monitor') {
    newCost = 10500 + (parseInt(id) % 5) * 800;
  } else if (name.includes('Logitech Mouse') || category.toLowerCase() === 'accessory') {
    newCost = 1500 + (parseInt(id) % 5) * 200;
  } else {
    newCost = 8000 + (parseInt(id) % 5) * 500;
  }

  columns[8] = String(newCost);
  newLines.push(columns.join(','));
}

// Write to temp file first
fs.writeFileSync(tempPath, newLines.join('\n') + '\n', 'utf-8');

try {
  // Overwrite the original file by renaming
  fs.renameSync(tempPath, csvPath);
  console.log('Successfully updated assets.csv with real-world INR prices via atomic swap!');
} catch (err) {
  console.error('Failed to rename temp file, trying to copy and delete...');
  try {
    fs.copyFileSync(tempPath, csvPath);
    fs.unlinkSync(tempPath);
    console.log('Successfully copied assets.csv and cleaned up!');
  } catch (err2) {
    console.error('Copy also failed:', err2);
    process.exit(1);
  }
}
