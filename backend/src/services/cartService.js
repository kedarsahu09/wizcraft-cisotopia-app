import { cartClient } from './redisClients.js';
import { isRedisAvailable, markRedisUnavailable } from './redisStatus.js';

const CART_KEY_PREFIX = 'cart:';

function getCartKey(sessionId) {
  return `${CART_KEY_PREFIX}${sessionId}`;
}

export async function getCart(sessionId) {
  if (!isRedisAvailable('cart')) {
    console.warn('[cartService] Redis unavailable, cannot get cart.');
    return null;
  }
  try {
    const cartJson = await cartClient.get(getCartKey(sessionId));
    return cartJson ? JSON.parse(cartJson) : { items: [] };
  } catch (error) {
    markRedisUnavailable('cart');
    console.error('[cartService] Failed to get cart from Redis:', error);
    return null;
  }
}

export async function saveCart(sessionId, cart) {
  if (!isRedisAvailable('cart')) {
    console.warn('[cartService] Redis unavailable, cannot save cart.');
    return false;
  }
  try {
    await cartClient.set(getCartKey(sessionId), JSON.stringify(cart));
    return true;
  } catch (error) {
    markRedisUnavailable('cart');
    console.error('[cartService] Failed to save cart to Redis:', error);
    return false;
  }
}

export async function addItemToCart(sessionId, productId, name, price, image, quantity = 1) {
  const cart = await getCart(sessionId);
  if (!cart) return null;

  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, image, quantity });
  }

  await saveCart(sessionId, cart);
  return cart;
}

export async function removeItemFromCart(sessionId, productId) {
  const cart = await getCart(sessionId);
  if (!cart) return null;

  cart.items = cart.items.filter(item => item.productId !== productId);

  await saveCart(sessionId, cart);
  return cart;
}

export async function updateCartItemQuantity(sessionId, productId, quantity) {
  const cart = await getCart(sessionId);
  if (!cart) return null;

  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      cart.items[existingItemIndex].quantity = quantity;
    }
  }

  await saveCart(sessionId, cart);
  return cart;
}

export async function clearCart(sessionId) {
  if (!isRedisAvailable('cart')) {
    console.warn('[cartService] Redis unavailable, cannot clear cart.');
    return false;
  }
  try {
    await cartClient.del(getCartKey(sessionId));
    return true;
  } catch (error) {
    markRedisUnavailable('cart');
    console.error('[cartService] Failed to clear cart in Redis:', error);
    return false;
  }
}