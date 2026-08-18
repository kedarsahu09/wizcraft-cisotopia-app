import { createClient } from 'redis';
import { markRedisAvailable, markRedisUnavailable } from './redisStatus.js';

const sessionRedisUrl = process.env.REDIS_SESSION_URL || 'redis://redis-session:6379';
const cartRedisUrl = process.env.REDIS_CART_URL || 'redis://redis-cart:6379';

export const sessionClient = createClient({ url: sessionRedisUrl });
export const cartClient = createClient({ url: cartRedisUrl });

function attachLogging(client, label) {
  client.on('ready', () => {
    markRedisAvailable(label);
    console.log(`[redis:${label}] ready`);
  });
  client.on('connect', () => {
    markRedisAvailable(label);
    console.log(`[redis:${label}] connected`);
  });
  client.on('end', () => {
    markRedisUnavailable(label);
    console.warn(`[redis:${label}] connection ended`);
  });
  client.on('reconnecting', () => {
    console.warn(`[redis:${label}] reconnecting attempt`);
  });
  client.on('error', (err) => {
    markRedisUnavailable(label);
    console.error(`[redis:${label}]`, err.message);
  });
}

attachLogging(sessionClient, 'session');
attachLogging(cartClient, 'cart');

async function connectClient(client, label) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    markRedisAvailable(label);
  } catch (error) {
    markRedisUnavailable(label);
    console.error(`[redis:${label}] failed to connect`, error.message);
  }
}

export async function initRedis() {
  await Promise.all([
    connectClient(sessionClient, 'session'),
    connectClient(cartClient, 'cart')
  ]);
}

export async function shutdownRedis() {
  await Promise.allSettled([
    sessionClient.isOpen ? sessionClient.quit() : Promise.resolve(),
    cartClient.isOpen ? cartClient.quit() : Promise.resolve()
  ]);
}
