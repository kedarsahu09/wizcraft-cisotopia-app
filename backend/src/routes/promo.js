import { Router } from 'express';
import { validatePromoCode, calculateDiscount } from '../services/promoService.js';
import { getCart, saveCart } from '../services/cartService.js';

const router = Router();

router.post('/validate', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const result = await validatePromoCode(code);

    if (!result.valid) {
      return res.status(404).json({ valid: false, error: result.error });
    }

    // Get current cart to calculate discount
    const sessionId = req.session.id;
    const cart = await getCart(sessionId);
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = calculateDiscount(subtotal, result.discount);

    // Save promo to cart
    cart.promo = {
      code: result.code,
      campaign: result.campaign,
      discount: result.discount,
      discountAmount: discountAmount
    };
    await saveCart(sessionId, cart);

    return res.json({
      valid: true,
      code: result.code,
      campaign: result.campaign,
      discount: result.discount,
      discountAmount: discountAmount,
      subtotal: subtotal,
      total: subtotal - discountAmount
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/remove', async (req, res, next) => {
  try {
    const sessionId = req.session.id;
    const cart = await getCart(sessionId);

    delete cart.promo;
    await saveCart(sessionId, cart);

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
