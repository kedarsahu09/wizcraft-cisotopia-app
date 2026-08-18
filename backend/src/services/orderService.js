import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureOrdersSeededInSql } from '../db/orderRepository.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, '../data/orders.json');

async function loadSeedOrders() {
  const contents = await readFile(ordersFilePath, 'utf-8');
  return JSON.parse(contents);
}

export async function ensureOrdersSeeded() {
  const orders = await loadSeedOrders();
  const seeded = await ensureOrdersSeededInSql(orders);

  if (seeded) {
    console.log('[seed] Orders loaded into SQL', {
      total: orders.length
    });
  }
}
