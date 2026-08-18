import dotenv from 'dotenv';

import { createApp } from './app.js';
import { shutdownRedis } from './services/redisClients.js';
import { closeDatabase } from './db/knexClient.js';

dotenv.config();

const port = process.env.PORT || 4000;

createApp()
  .then((app) => {
    const server = app.listen(port, () => {
      console.log(`Wiztopia backend listening on port ${port}`);
    });

    const graceful = async () => {
      console.log('Shutting down...');
      server.close();
      await shutdownRedis();
      await closeDatabase();
      process.exit(0);
    };

    process.on('SIGINT', graceful);
    process.on('SIGTERM', graceful);
  })
  .catch((error) => {
    console.error('Failed to start backend', error);
    closeDatabase().catch(() => {});
    process.exit(1);
  });
