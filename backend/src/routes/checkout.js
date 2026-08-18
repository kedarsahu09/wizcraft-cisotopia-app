import { Router } from 'express';
import { getCart, clearCart } from '../services/cartService.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const cart = await getCart(req.sessionID);
    if (!cart) {
      return res.status(503).json({ error: 'Cart service unavailable' });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // In a real application, this would involve payment processing, order creation in DB, etc.
    // For now, we just clear the cart and return a success message.
    await clearCart(req.sessionID);

    return res.json({ message: 'Checkout successful!', orderDetails: cart });
  } catch (error) {
    return next(error);
  }
});

export default router;
