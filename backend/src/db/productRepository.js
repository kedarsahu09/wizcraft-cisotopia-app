import { db } from './knexClient.js';
import { ensureSchema } from './schema.js';

function toDbRow(product) {
  const now = new Date().toISOString();
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline || null,
    description: product.description || null,
    price: product.price ?? 0,
    old_price: product.old_price ?? null,
    stock: product.stock ?? 0,
    features: JSON.stringify(product.features || []),
    images: JSON.stringify(product.images || []),
    score: product.score ?? 0,
    order_index: product.order_index ?? 0,
    category: product.category || null,
    labels: JSON.stringify(product.labels || []),
    type: product.type || null, // Add type field
    created_at: product.created_at || now,
    updated_at: product.updated_at || now
  };
}

function fromDbRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: Number(row.price),
    old_price: row.old_price ? Number(row.old_price) : null,
    stock: row.stock,
    features: row.features ? JSON.parse(row.features) : [],
    images: row.images ? JSON.parse(row.images) : [],
    score: row.score,
    order_index: row.order_index,
    category: row.category,
    labels: row.labels ? JSON.parse(row.labels) : [],
    type: row.type, // Retrieve type field
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function ensureProductsSeededInSql(products) {
  await ensureSchema();
  const countResult = await db('products').count({ count: '*' }).first();
  const count = Number(countResult?.count || 0);
  if (count > 0) {
    return false;
  }

  const rows = products.map((product, index) => toDbRow({ ...product, order_index: index }));
  await db('products').insert(rows);
  return true;
}

export async function getAllProductsFromSql() {
  await ensureSchema();
  const rows = await db('products').select('*').orderBy('order_index', 'asc');
  return rows.map(fromDbRow);
}

export async function getProductByIdFromSql(id) {
  await ensureSchema();
  const row = await db('products').where({ id }).first();
  return fromDbRow(row);
}

export async function upsertProduct(product) {
  const row = toDbRow({ ...product, updated_at: new Date().toISOString() });
  await ensureSchema();
  const existing = await db('products').where({ id: row.id }).first();
  if (existing) {
    await db('products').where({ id: row.id }).update(row);
  } else {
    await db('products').insert(row);
  }
  return getProductByIdFromSql(row.id);
}

export async function clearProducts() {
  await ensureSchema();
  await db('products').del();
}
