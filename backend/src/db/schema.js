import { db } from './knexClient.js';

export async function ensureSchema() {
  const hasTable = await db.schema.hasTable('products');
  if (!hasTable) {
    await db.schema.createTable('products', (table) => {
      table.string('id').primary();
      table.string('name').notNullable();
      table.string('tagline');
      table.text('description');
      table.decimal('price', 10, 2).notNullable();
      table.decimal('old_price', 10, 2);
      table.integer('stock').defaultTo(0);
      table.text('features');
      table.text('images');
      table.integer('score').defaultTo(0);
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
      table.integer('order_index').defaultTo(0);
      table.string('category');
      table.text('labels');
      table.string('type'); // Add type column
    });
  } else {
    // Ensure old_price column exists for existing tables
    const hasOldPrice = await db.schema.hasColumn('products', 'old_price');
    if (!hasOldPrice) {
      await db.schema.table('products', (table) => {
        table.decimal('old_price', 10, 2).nullable();
      });
    }
  }

  const hasOrdersTable = await db.schema.hasTable('orders');
  if (!hasOrdersTable) {
    await db.schema.createTable('orders', (table) => {
      table.string('id').primary();
      table.string('customerName').notNullable();
      table.string('customerEmail').notNullable();
      table.string('creditCardNumber').notNullable();
      table.text('items').notNullable(); // JSON string of items
      table.decimal('total', 10, 2).notNullable();
      table.timestamp('orderDate').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
      table.timestamp('updated_at').defaultTo(db.fn.now());
    });
  }
}

export async function touchUpdatedAt(id) {
  await db('products')
    .where({ id })
    .update({ updated_at: db.fn.now() });
}
