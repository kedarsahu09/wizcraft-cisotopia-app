import { clearProducts } from './src/db/productRepository.js';
import { clearOrders } from './src/db/orderRepository.js';
import { db } from './src/db/knexClient.js';

async function runClear() {
  try {
    console.log('Clearing products table...');
    await clearProducts();
    console.log('Products table cleared.');

    console.log('Clearing orders table...');
    await clearOrders();
    console.log('Orders table cleared.');

  } catch (error) {
    console.error('Error clearing tables:', error);
  } finally {
    await db.destroy(); // Close the database connection
  }
}

runClear();
