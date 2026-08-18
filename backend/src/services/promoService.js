import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promosFilePath = path.resolve(__dirname, '../../data/promos.csv');

let promosCache = null;

async function loadPromos() {
  if (promosCache) {
    return promosCache;
  }

  const csvContent = await readFile(promosFilePath, 'utf-8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');

  promosCache = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      campaign: values[0],
      code: values[1],
      discount: values[2],
      sensitivity: values[3]
    };
  });

  console.log(`[promo] Loaded ${promosCache.length} promo codes`);
  return promosCache;
}

export async function validatePromoCode(code) {
  const promos = await loadPromos();
  const promo = promos.find(p => p.code === code.toUpperCase());

  if (!promo) {
    return { valid: false, error: 'Promo code not found' };
  }

  return {
    valid: true,
    code: promo.code,
    campaign: promo.campaign,
    discount: promo.discount,
    sensitivity: promo.sensitivity
  };
}

export function calculateDiscount(subtotal, discountString) {
  if (!discountString) {
    return 0;
  }

  // Handle percentage discounts (e.g., "30%", "20%")
  if (discountString.endsWith('%')) {
    const percentage = parseFloat(discountString);
    return subtotal * (percentage / 100);
  }

  // Handle Buy1Get1 - 50% off total
  if (discountString === 'Buy1Get1') {
    return subtotal * 0.5;
  }

  // Handle Free Shipping - return fixed amount (we'll say shipping is $10)
  if (discountString === 'Free Shipping') {
    return 10;
  }

  return 0;
}
