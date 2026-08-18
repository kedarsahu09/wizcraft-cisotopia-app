import { Router } from 'express';
import { getCart, addItemToCart, removeItemFromCart, updateCartItemQuantity, clearCart } from '../services/cartService.js';
import { getProductById } from '../services/productService.js';

const router = Router();

// Get current cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await getCart(req.sessionID);
    if (!cart) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }
    return res.json(cart);
  } catch (error) {
    return next(error);
  }
});

// Add item to cart
router.post('/items', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedCart = await addItemToCart(
      req.sessionID,
      product.id,
      product.name,
      product.price,
      product.images[0], // Use the first image
      quantity
    );

    if (!updatedCart) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }
    return res.json(updatedCart);
  } catch (error) {
    return next(error);
  }
});

// Update item quantity in cart
router.put('/items/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative number' });
    }

    const updatedCart = await updateCartItemQuantity(req.sessionID, productId, quantity);

    if (!updatedCart) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }
    return res.json(updatedCart);
  } catch (error) {
    return next(error);
  }
});

// Remove item from cart
router.delete('/items/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updatedCart = await removeItemFromCart(req.sessionID, productId);
    if (!updatedCart) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }
    return res.json(updatedCart);
  } catch (error) {
    return next(error);
  }
});

// Clear cart
router.delete('/', async (req, res, next) => {
  try {
    const success = await clearCart(req.sessionID);
    if (!success) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }
    return res.status(204).send(); // No content
  } catch (error) {
    return next(error);
  }
});

export default router;
