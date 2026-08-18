import { db } from './knexClient.js';
import { ensureSchema } from './schema.js';

function toDbRow(order) {
  const now = new Date().toISOString();
  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    creditCardNumber: order.creditCardNumber,
    items: JSON.stringify(order.items || []),
    total: order.total ?? 0,
    orderDate: order.orderDate || now,
    created_at: order.created_at || now,
    updated_at: order.updated_at || now
  };
}

function fromDbRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    creditCardNumber: row.creditCardNumber,
    items: row.items ? JSON.parse(row.items) : [],
    total: Number(row.total),
    orderDate: row.orderDate,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function ensureOrdersSeededInSql(orders) {
  await ensureSchema();
  const countResult = await db('orders').count({ count: '*' }).first();
  const count = Number(countResult?.count || 0);
  if (count > 0) {
    return false;
  }

  const rows = orders.map(toDbRow);
  await db('orders').insert(rows);
  return true;
}

export async function clearOrders() {
  await ensureSchema();
  await db('orders').del();
}
