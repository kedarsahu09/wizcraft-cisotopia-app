import { Router } from 'express';
import { getToys, getTshirts, getCandles, getCoffee, getProductById } from '../services/productService.js';

const router = Router();

router.get('/toys', async (req, res, next) => {
  try {
    const products = await getToys();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.get('/tshirts', async (req, res, next) => {
  try {
    const products = await getTshirts();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.get('/candles', async (req, res, next) => {
  try {
    const products = await getCandles();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.get('/coffee', async (req, res, next) => {
  try {
    const products = await getCoffee();
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

export default router;
