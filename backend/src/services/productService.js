import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  ensureProductsSeededInSql,
  getAllProductsFromSql,
  getProductByIdFromSql,
  clearProducts // Import clearProducts
} from '../db/productRepository.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toysFilePath = path.resolve(__dirname, '../data/toys.json');
const tshirtsFilePath = path.resolve(__dirname, '../data/tshirts.json');
const candlesFilePath = path.resolve(__dirname, '../data/candles.json');
const coffeeFilePath = path.resolve(__dirname, '../data/coffee.json');

// Helper function to construct full image paths
function constructFullImagePaths(products, type) {
  return products.map(product => {
    const images = product.images.map(imageName => `/images/products/${type}/${imageName}`);
    return { ...product, images, type };
  });
}

async function loadSeedProducts() {
  console.log('[seed] Starting loadSeedProducts...');
  const [toysContent, tshirtsContent, candlesContent, coffeeContent] = await Promise.all([
    readFile(toysFilePath, 'utf-8'),
    readFile(tshirtsFilePath, 'utf-8'),
    readFile(candlesFilePath, 'utf-8'),
    readFile(coffeeFilePath, 'utf-8'),
  ]);
  console.log('[seed] Read file contents.');

  const toys = constructFullImagePaths(JSON.parse(toysContent), 'toys');
  console.log('[seed] Parsed toys and constructed image paths:', toys.length);
  const tshirts = constructFullImagePaths(JSON.parse(tshirtsContent), 'tshirts');
  console.log('[seed] Parsed tshirts and constructed image paths:', tshirts.length);
  const candles = constructFullImagePaths(JSON.parse(candlesContent), 'candles');
  console.log('[seed] Parsed candles and constructed image paths:', candles.length);
  const coffee = constructFullImagePaths(JSON.parse(coffeeContent), 'coffee');
  console.log('[seed] Parsed coffee and constructed image paths:', coffee.length);

  const allProducts = [...toys, ...tshirts, ...candles, ...coffee];
  console.log('[seed] Total products loaded from JSON:', allProducts.length);
  return allProducts;
}

export async function ensureProductsSeeded() {
  console.log('[seed] Clearing existing products...');
  await clearProducts(); // Clear existing products before seeding
  const products = await loadSeedProducts();
  console.log('[seed] Loaded products from JSON files:', products.length);
  const seeded = await ensureProductsSeededInSql(products);
  console.log('[seed] Products seeded status:', seeded);

  // Fetch latest snapshot after seeding
  const snapshot = await getAllProductsFromSql();
  console.log('[seed] Snapshot products after seeding:', snapshot.length);

  if (seeded) {
    console.log('[seed] Products loaded into SQL', {
      total: snapshot.length
    });
  }
}

export async function getAllProducts() {
  return getAllProductsFromSql();
}

export async function getProductById(id) {
  return getProductByIdFromSql(id);
}

export async function getToys() {
  const allProducts = await getAllProductsFromSql();
  console.log('[getToys] All products from SQL:', allProducts.length);
  const filteredProducts = allProducts.filter(product => product.type === 'toys');
  console.log('[getToys] Filtered products:', filteredProducts.length);
  return filteredProducts;
}

export async function getTshirts() {
  const allProducts = await getAllProductsFromSql();
  console.log('[getTshirts] All products from SQL:', allProducts.length);
  const filteredProducts = allProducts.filter(product => product.type === 'tshirts');
  console.log('[getTshirts] Filtered products:', filteredProducts.length);
  return filteredProducts;
}

export async function getCandles() {
  const allProducts = await getAllProductsFromSql();
  console.log('[getCandles] All products from SQL:', allProducts.length);
  const filteredProducts = allProducts.filter(product => product.type === 'candles');
  console.log('[getCandles] Filtered products:', filteredProducts.length);
  return filteredProducts;
}

export async function getCoffee() {
  const allProducts = await getAllProductsFromSql();
  console.log('[getCoffee] All products from SQL:', allProducts.length);
  const filteredProducts = allProducts.filter(product => product.type === 'coffee');
  console.log('[getCoffee] Filtered products:', filteredProducts.length);
  return filteredProducts;
}
