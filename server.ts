import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import carparkAvailabilityHandler from './api/carpark-availability';
import apiIndex from './api/index';

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes (Mounted first before Vite SPA fallback)
  app.get('/api', apiIndex);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasLtaKey: Boolean(
        process.env.LTA_DATAMALL_ACCOUNT_KEY ||
        process.env.ACCOUNT_KEY ||
        process.env.LTA_ACCOUNT_KEY
      ),
      timestamp: new Date().toISOString(),
    });
  });

  // Serverless endpoint for LTA DataMall CarParkAvailabilityv2
  app.all('/api/carpark-availability', carparkAvailabilityHandler);
  app.all('/api/carparks', carparkAvailabilityHandler);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
