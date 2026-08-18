import { db } from './knexClient.js';

export async function addOldPriceColumn() {
  const hasColumn = await db.schema.hasColumn('products', 'old_price');
  
  if (!hasColumn) {
    console.log('Adding old_price column to products table...');
    await db.schema.table('products', (table) => {
      table.decimal('old_price', 10, 2).nullable();
    });
    console.log('old_price column added successfully');
  } else {
    console.log('old_price column already exists');
  }
}
