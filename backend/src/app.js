import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import RedisStore from 'connect-redis';

import { errorHandler, notFound } from './middleware/errorHandler.js';
import productRouter from './routes/product.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import promoRouter from './routes/promo.js';
import { ensureOrdersSeeded } from './services/orderService.js';
import { ensureProductsSeeded } from './services/productService.js';
import { initRedis, sessionClient } from './services/redisClients.js';
import { getRedisStatusSnapshot } from './services/redisStatus.js';

dotenv.config();

const DEFAULT_SESSION_OPTIONS = {
  name: 'wiztopia.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

export async function createApp({
  skipRedis = false,
  preloadOrders = true,
  preloadProducts = true,
  redisInit = initRedis,
  seedOrders = ensureOrdersSeeded,
  seedProducts = ensureProductsSeeded,
  sessionStore,
  sessionConfig = {},
  corsOrigins,
  additionalMiddleware = []
} = {}) {
  if (!skipRedis) {
    await redisInit();
  }

  if (preloadOrders) {
    try {
      await seedOrders();
    } catch (error) {
      console.error('[seed] failed to preload orders', error.message);
    }
  }

  if (preloadProducts) {
    try {
      await seedProducts();
    } catch (error) {
      console.error('[seed] failed to preload products', error.message);
    }
  }

  const app = express();
  const redisStatus = getRedisStatusSnapshot();
  if (!skipRedis) {
    console.log('[redis] availability snapshot', redisStatus);
  }
  const resolvedCorsOrigins = Array.isArray(corsOrigins)
    ? corsOrigins
    : (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (resolvedCorsOrigins.includes('*')) return callback(null, true);
        if (resolvedCorsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true
    })
  );

  additionalMiddleware.forEach((middleware) => {
    if (typeof middleware === 'function') {
      app.use(middleware);
    }
  });

  const defaultSessionConfig = {
    ...DEFAULT_SESSION_OPTIONS,
    secret: process.env.SESSION_SECRET || 'wiztopia-super-secret'
  };

  const finalSessionConfig = {
    ...defaultSessionConfig,
    ...sessionConfig,
    cookie: {
      ...defaultSessionConfig.cookie,
      ...(sessionConfig.cookie || {})
    }
  };

  if (sessionConfig.store) {
    finalSessionConfig.store = sessionConfig.store;
  } else if (sessionStore) {
    finalSessionConfig.store = sessionStore;
  } else {
    finalSessionConfig.store = new RedisStore({
      client: sessionClient,
      prefix: 'wiztopia:sess:'
    });
  }

  app.use(session(finalSessionConfig));

  app.get('/healthz', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/products', productRouter);
  app.use('/cart', cartRouter);
  app.use('/checkout', checkoutRouter);
  app.use('/promo', promoRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
